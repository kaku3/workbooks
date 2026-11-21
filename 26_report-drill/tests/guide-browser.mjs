import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const artifacts=new URL('./artifacts/',import.meta.url);
await mkdir(artifacts,{recursive:true});
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:'0'},windowsHide:true,stdio:['ignore','pipe','pipe']});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser,socket;
try {
  const url=await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('Server did not start')),10000);
    server.stdout.on('data',chunk=>{const match=chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timer);resolve(match[0]);}});
    server.on('error',reject);server.on('exit',code=>reject(new Error(`Server exited ${code}`)));
  });
  assert.equal((await fetch(url)).status,200);
  const profile=await mkdtemp(path.join(tmpdir(),'report-drill-browser-'));
  browser=spawn(process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-allow-origins=*','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:['ignore','ignore','pipe']});
  if(process.env.REPORT_BROWSER_DEBUG) browser.stderr.on('data', data=>console.error(String(data)));
  let browserError;
  browser.on('error',error=>{browserError=error;});
  let port;
  for(let i=0;i<100;i++){if(browserError)throw browserError;try{port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await delay(100);}}
  assert.ok(port,'Edge starts');
  const targets=await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket=new WebSocket(targets.find(item=>item.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  let seq=0;const pending=new Map(),errors=[];
  if(process.env.REPORT_BROWSER_DEBUG) {
    socket.addEventListener('message', event=>console.error('CDP', String(event.data).slice(0,400)));
    socket.addEventListener('close', event=>console.error('CDP closed',event.code,event.reason));
  }
  socket.onmessage=({data})=>{const msg=JSON.parse(data);if(msg.id){const task=pending.get(msg.id);if(!task)return;pending.delete(msg.id);clearTimeout(task.timer);msg.error?task.reject(new Error(JSON.stringify(msg.error))):task.resolve(msg.result);}else if(msg.method==='Runtime.exceptionThrown')errors.push(JSON.stringify(msg.params.exceptionDetails));};
  const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(new Error(`Timeout: ${method}`));},10000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));});
  const evaluate=async expression=>{const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(JSON.stringify(result.exceptionDetails));return result.result.value;};
  const click=async selector=>{
    await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw new Error('Missing element: '+${JSON.stringify(selector)});if(el.disabled)throw new Error('Disabled element');el.click();return true;})()`);
    if(await evaluate("document.querySelector('#app').getAttribute('aria-busy')==='true'"))await waitFor("document.querySelector('#app').getAttribute('aria-busy')!=='true'");
  };
  const expire=async()=>{
    await evaluate("(()=>{const s=JSON.parse(localStorage.getItem('report-drill.pdf-incident.v1'));s.time=1079;s.timerRemainder=0;s.phase='desk';s.conversation=null;localStorage.setItem('report-drill.pdf-incident.v1',JSON.stringify(s));})()");
    await call('Page.reload');await waitFor("Boolean(document.querySelector('[data-action=continue]'))");await click('[data-action=continue]');
    await evaluate('advanceGameTimer(5000)');
  };
  const state=()=>evaluate("JSON.parse(localStorage.getItem('report-drill.pdf-incident.v1'))");
  const settle=async(begin=true)=>{for(let i=0;i<12;i++){if(!await evaluate("Boolean(document.querySelector('dialog[open] [data-action=scene-skip],.reporting [data-action=scene-skip]'))")){if(begin&&await evaluate("Boolean(document.querySelector('[data-action=begin-work]'))")){await click('[data-action=begin-work]');await waitFor("!document.querySelector('.ticket-flight')");}return;}await click('dialog[open] [data-action=scene-skip],.reporting [data-action=scene-skip]');}throw new Error('Scene did not finish');};
  const screenshot=async name=>{const result=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(new URL(`${name}.png`,artifacts),Buffer.from(result.data,'base64'));};
  const waitFor=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await delay(50);}throw new Error(`Wait failed: ${expression}\nBrowser errors: ${errors.join("\n")}`);};
  const size=(width,height,mobile=false)=>call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
  await call('Page.addScriptToEvaluateOnNewDocument',{source:`
    const nativeInterval=window.setInterval.bind(window),nativeNow=performance.now.bind(performance);
    let timerCallback,offset=0;
    performance.now=()=>nativeNow()+offset;
    window.setInterval=(callback,ms,...args)=>ms===250?(timerCallback=callback,-1):nativeInterval(callback,ms,...args);
    window.advanceGameTimer=ms=>{offset+=ms;timerCallback();};
  `});

  await call('Runtime.enable');await call('Page.enable');await size(1440,1000);
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await call('Page.navigate',{url});await waitFor("Boolean(document.querySelector('[data-action=start]'))");
  await evaluate(`(async()=>{
    const {cases}=await import('./data/content.mjs');const {createEngine}=await import('./engine.mjs');
    const {problem,scenario}=cases.watermark;const e=createEngine(problem,scenario),s=e.start();
    while(s.phase==='scene')e.advance(s,true);e.beginWork(s);s.settings={instant:true,reduced:true};
    localStorage.setItem('report-drill.pdf-incident.v1',JSON.stringify(s));
  })()`);
  const reload=async()=>{await call('Page.reload');await waitFor("Boolean(document.querySelector('[data-action=continue]'))");await click('[data-action=continue]');};
  const guide=()=>evaluate("document.querySelector('.operation-guide')?.dataset.guide||null");
  const waitGuide=id=>waitFor(`document.querySelector('.operation-guide')?.dataset.guide===${JSON.stringify(id)}`);
  const drop=async(id,status)=>evaluate(`(()=>{const card=document.querySelector('[data-card-id="'+${JSON.stringify(id)}+'"]'),column=document.querySelector('[data-status="'+${JSON.stringify(status)}+'"]'),dataTransfer=new DataTransfer();card.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer}));column.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer}));column.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer}));card.dispatchEvent(new DragEvent('dragend',{bubbles:true,dataTransfer}));})()`);
  await reload();await waitGuide('overview');
  assert.equal(await evaluate("document.querySelectorAll('[data-guide-target]').length"),0,'overview shades the whole background');
  assert.equal(await evaluate("document.querySelector('.guide-card button').textContent"),'了解した');
  const overviewTime=(await state()).time;await evaluate('advanceGameTimer(60000)');assert.equal((await state()).time,overviewTime,'overview pauses the clock');
  await click('[data-action=report]');assert.equal((await state()).phase,'desk','overview blocks background operations');
  for(const [width,height] of [[1440,1000],[390,844]]){
    await size(width,height,width<600);await delay(200);
    assert.equal(await evaluate("(()=>{const r=document.querySelector('.guide-card').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1&&Math.abs((r.left+r.right)/2-innerWidth/2)<2;})()"),true,'overview stays centered and inside the viewport');
    assert.equal(await evaluate("(()=>{const card=document.querySelector('.guide-card').getBoundingClientRect(),label=document.querySelector('.guide-label').getBoundingClientRect();return label.top<card.top&&label.bottom>card.top&&label.left>card.left&&label.top>=0;})()"),true,'guide label sits on the upper left border');
    assert.equal(await evaluate("document.querySelectorAll('.guide-focus-target').length"),0,'overview has no operation target effect');
    await screenshot(`guide-overview-${width}`);
  }
  await size(1440,1000);await reload();await waitGuide('overview');
  await click('.guide-card button');await waitGuide('task-start');
  assert.equal(await evaluate("document.querySelectorAll('[data-guide-target]').length>1"),true,'both source and destination are highlighted');
  assert.equal(await evaluate("document.querySelectorAll('.guide-focus-target').length===document.querySelectorAll('.guide-outlines rect').length"),true,'every visible operation target has a focus effect');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.guide-focus-effects')).display"),'none','reduced motion retains only the static outline');
  await call('Emulation.setEmulatedMedia',{features:[]});
  await evaluate("document.body.classList.remove('reduce-motion')");
  assert.equal(await evaluate("[...document.querySelectorAll('.guide-focus-target>span')].every(el=>el.getAnimations().some(animation=>animation.playState==='running'))"),true,'square frames converge repeatedly around the targets');
  await evaluate("document.querySelectorAll('.guide-focus-target>span').forEach((el,index)=>el.getAnimations().forEach(animation=>{animation.pause();animation.currentTime=500+(index%3)*650;}))");
  await delay(250);
  await screenshot('guide-focus-squares');
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.guide-focus-effects')).display"),'none','system reduced motion also stops the effect');
  await evaluate("document.body.classList.add('reduce-motion')");
  const before=await state();await evaluate('advanceGameTimer(60000)');assert.equal((await state()).time,before.time,'guide pauses the clock');
  await click('[data-action=report]');assert.equal((await state()).phase,'desk','outside clicks are blocked');
  await click('[data-action="investigate:wm.purpose-check"]');assert.deepEqual((await state()).done,[],'task click cannot bypass drag instruction');
  await drop('wm.purpose-check','done');assert.equal((await state()).board['wm.purpose-check'],undefined,'wrong destination is blocked');
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});assert.equal(await guide(),'task-start');
  await screenshot('guide-task-start');
  await reload();await waitGuide('task-start');
  await drop('wm.purpose-check','working');assert.equal((await state()).phase,'scene');
  await settle();await waitGuide('clue');await screenshot('guide-clue');
  await click('.guide-card button');await waitGuide('task-done');
  await drop('wm.purpose-check','done');await waitGuide('history');
  assert.equal(await evaluate("document.querySelector('[data-guide-target]').matches('summary.history-item')"),true,'desktop highlights the history post');
  const historyTime=(await state()).time;await evaluate('advanceGameTimer(60000)');assert.equal((await state()).time,historyTime,'history guide pauses the clock');
  await screenshot('guide-history-desktop');
  await click('summary[data-guide-target]');await waitFor("!document.querySelector('.operation-guide')");
  assert.equal(await evaluate("Boolean(document.querySelector('.chat-panel .history-entry[open] .history-inline'))"),true,'clicking the post opens its dialogue');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.history-entry[open] .history-inline p')).color"),'rgb(32, 52, 70)','dialogue uses dark ink on the light history background');
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.history-entry[open] .history-inline p>strong:first-child')).color"),'rgb(32, 70, 56)','speaker uses dark ink too');
  await screenshot('history-readable');
  await reload();await waitFor("Boolean(document.querySelector('.kanban'))");await delay(250);assert.equal(await guide(),null,'completed guides do not repeat after reload');
  await click('[data-action="investigate:wm.ai"]');await settle();await waitGuide('report-tab');
  await click('[data-action=report]');await waitGuide('join');await click('[data-action=join-meeting]');await waitGuide('share');
  await delay(700);assert.equal(await evaluate("document.querySelector('.reporting').dataset.meetingPhase"),'speaking','request completion never automatically shares');
  await screenshot('guide-share');
  await reload();await waitFor("Boolean(document.querySelector('[data-action=join-meeting]'))");
  await click('[data-action=join-meeting]');await waitGuide('share');
  await click('[data-action=meeting-share]');await waitGuide('select');
  for(const [width,height] of [[1440,1000],[390,844]]){
    await size(width,height,width<600);await delay(200);
    assert.equal(await evaluate("(()=>{const r=document.querySelector('.guide-card').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1;})()"),true,'guide text stays inside viewport');
    await screenshot(`guide-select-${width}`);
  }
  await size(1440,1000);await delay(200);
  for(const id of (await state()).evidence.slice(0,3))await click(`#shared-clue-deck [data-action="select:${id}"]`);
  await waitGuide('submit');await screenshot('guide-submit');
  await click('[data-action=submit]');assert.equal((await state()).phase,'scene');
  assert.equal(await guide(),null,'return guide waits until report feedback finishes');
  await settle();await waitGuide('back-to-investigate');
  const rejectedState=await state();
  assert.equal(await evaluate("document.querySelector('[data-guide-target]').dataset.action"),'investigate','return guide highlights the Backlog tab');
  await click('[data-action=submit]');assert.equal((await state()).time,rejectedState.time,'cannot submit again during the return guide');
  for(const [width,height] of [[1440,1000],[390,844]]){
    await size(width,height,width<600);await delay(200);await screenshot(`guide-back-to-investigate-${width}`);
    assert.equal(await evaluate("(()=>{const r=document.querySelector('[data-guide-target]').getBoundingClientRect();return r.width>0&&r.left>=0&&r.right<=innerWidth+1;})()"),true,'return tab remains visible on desktop and mobile');
  }
  await reload();await waitGuide('back-to-investigate');
  assert.equal(await evaluate("document.querySelector('[data-guide-target]').dataset.action"),'investigate','return guide takes priority over rejoining the meeting');
  await click('[data-action=investigate]');await waitFor("Boolean(document.querySelector('.kanban'))");
  assert.equal((await state()).phase,'desk');
  assert.equal((await state()).time,rejectedState.time,'returning to the board costs no game time');
  assert.deepEqual((await state()).evidence,rejectedState.evidence,'returning preserves the collected clues');
  assert.equal(await guide(),null,'all guides finish after their operations');
  assert.deepEqual(await evaluate("JSON.parse(localStorage.getItem('report-drill.guides.v1')).pending"),[]);
  await click('[data-action=investigate]');await click('[data-action=report]');
  if(await evaluate("Boolean(document.querySelector('[data-action=join-meeting]'))"))await click('[data-action=join-meeting]');
  await waitFor("document.querySelector('.reporting')?.dataset.meetingPhase==='speaking'");
  await delay(700);assert.equal(await evaluate("document.querySelector('.reporting').classList.contains('meeting-unshared')"),true,'sharing remains manual after guides are completed');
  await click('[data-action=meeting-share]');await click('[data-action=meeting-share]');
  await click('[data-action=submit]');assert.equal((await state()).phase,'report','cannot submit while sharing is off');
  await click('[data-action=meeting-share]');await click('[data-action=submit]');await settle();
  assert.equal(await guide(),null,'another insufficient report does not repeat the return guide');

  await evaluate(`(async()=>{
    const {cases}=await import('./data/content.mjs');const {createEngine}=await import('./engine.mjs');
    const e=createEngine(cases.watermark.problem,cases.watermark.scenario),s=e.start();while(s.phase==='scene')e.advance(s,true);e.beginWork(s);s.settings={instant:true,reduced:true};
    localStorage.setItem('report-drill.pdf-incident.v1',JSON.stringify(s));localStorage.removeItem('report-drill.guides.v1');
  })()`);
  await reload();await waitGuide('overview');await click('.guide-card button');await waitGuide('task-start');await size(390,844,true);await call('Emulation.setTouchEmulationEnabled',{enabled:true});await delay(250);
  await screenshot('guide-task-mobile');
  const points=await evaluate(`(()=>{
    for(const el of document.querySelectorAll('[data-guide-target][data-card-id]')){
      const r=el.getBoundingClientRect(),x=r.left+r.width/2;
      for(let y=Math.max(r.top+10,10);y<Math.min(r.bottom-10,innerHeight-10);y+=20){
        if(el.contains(document.elementFromPoint(x,y))){const d=document.querySelector('[data-status="working"]').getBoundingClientRect();return {id:el.dataset.cardId,x,y,tx:(d.left+Math.min(d.right,innerWidth-10))/2,ty:y};}
      }
    }
  })()`);
  assert.ok(points,'a visible task can be touched without the guide covering it');
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:points.x,y:points.y}]});
  for(let n=1;n<=5;n++)await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:points.x+(points.tx-points.x)*n/5,y:points.ty}]});
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal((await state()).phase,'scene','touch drag starts the selected task');
  await settle();await waitGuide('clue');await click('.guide-card button');await waitGuide('task-done');
  await size(1440,1000);await delay(200);
  await evaluate(`document.querySelector('.working [data-card-id="${points.id}"]').focus()`);
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',modifiers:1});
  await waitGuide('history');assert.equal((await state()).board[points.id],'done','keyboard movement completes the task guide');
  await size(390,844,true);await delay(250);
  assert.equal(await evaluate("document.querySelector('[data-guide-target]').dataset.action"),'panel:chat','mobile guide starts at the chat tab');
  await screenshot('guide-history-mobile-tab');
  await click('[data-action="panel:chat"]');await waitFor("Boolean(document.querySelector('summary[data-guide-target]'))");
  assert.equal(await guide(),'history','opening chat keeps the history guide active');
  await screenshot('guide-history-mobile');
  await reload();await waitGuide('history');
  await click('[data-action="panel:chat"]');await waitFor("Boolean(document.querySelector('summary[data-guide-target]'))");
  await click('summary[data-guide-target]');await waitFor("!document.querySelector('.operation-guide')");
  await reload();await delay(250);assert.equal(await guide(),null,'opened history guide never repeats after reload');
  assert.deepEqual(errors,[],'no browser runtime errors');

  console.log('Guides: input blocking, drag, pause, reload, one-time history, manual sharing, mobile and report: OK');
} finally {
  if(socket)socket.close();if(browser)browser.kill();server.kill();
}
