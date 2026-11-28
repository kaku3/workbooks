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
  assert.equal(await evaluate("document.querySelectorAll('[data-guide-target][data-card-id]').length"),1,'only the first task is selectable');
  assert.equal(await evaluate("document.querySelector('[data-guide-target][data-card-id]')===document.querySelector('.todo [data-card-id]')"),true,'the highlighted task is at the top');
  assert.equal(await evaluate("document.querySelector('.guide-card').textContent.includes('キーボード')"),false,'guide does not include keyboard shortcuts');
  const otherTask=await evaluate("document.querySelectorAll('.todo [data-card-id]')[1].dataset.cardId");
  await drop(otherTask,'working');assert.equal((await state()).phase,'desk','lower tasks cannot bypass the first-task guide');
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
  await click('[data-action="investigate:wm.purpose-check"]');
  await waitFor("Boolean(document.querySelector('dialog.task-detail[open] .operation-guide[data-guide=task-done]'))");
  assert.equal(await evaluate("document.querySelector('[data-guide-target]').dataset.action"),'task-status:done','the popup guide highlights only Done');
  await click('[data-action="task-status:todo"]');
  assert.equal((await state()).board['wm.purpose-check'],'working','other status buttons are blocked during the completion guide');
  await screenshot('guide-task-done-popup-desktop');
  await click('[data-action="task-status:done"]');await waitGuide('history');
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
  assert.ok(await evaluate("(()=>{const card=document.querySelector('.guide-card'),text=card.querySelector('#guide-description').textContent,alpha=Number(getComputedStyle(card).backgroundColor.match(/[\\d.]+/g).at(-1));return text.includes('タップ')&&!text.includes('ドラッグ')&&alpha<1&&alpha>.75;})()"),'guide explains tap selection and has a slightly translucent background');
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
  for(let step=0;step<3&&(await state()).phase==='scene';step++){
    assert.ok(await evaluate("import('./data/content.mjs').then(({cases})=>{const s=JSON.parse(localStorage.getItem('report-drill.pdf-incident.v1')),c=s.conversation,line=cases.watermark.scenario.scenes[c.ids[c.scene]].lines[c.line],area=document.querySelector('.reporting'),camera=area.querySelector('.report-stage>.meeting-camera');return area.classList.contains('meeting-unshared')&&area.classList.contains('report-speaking')&&getComputedStyle(area.querySelector('.report-board')).display==='none'&&camera.dataset.speaker===(line.speaker||'client')&&camera.getBoundingClientRect().width>innerWidth/3;})"),'report dialogue stops sharing and enlarges the current speaker');
    if(step===0){await screenshot('report-speaker-desktop');await size(390,844,true);await screenshot('report-speaker-mobile');await size(1440,1000);}
    await click('[data-action=scene-next]');
  }
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
  for(const [width,height] of [[320,568],[375,667],[390,844]]){
    await size(width,height,true);await delay(200);
    const layout=await evaluate("(()=>{const board=document.querySelector('.kanban').getBoundingClientRect(),todo=document.querySelector('[data-status=todo]').getBoundingClientRect(),working=document.querySelector('[data-status=working]').getBoundingClientRect(),guide=document.querySelector('.guide-card').getBoundingClientRect();return {board:board.toJSON(),todo:todo.toJSON(),working:working.toJSON(),guide:guide.toJSON(),viewport:innerWidth};})()");
    assert.ok(layout.todo.width<layout.board.width*.7&&layout.todo.width>layout.board.width*.6&&layout.working.left<layout.board.right&&layout.board.right-layout.working.left>layout.board.width*.25&&Math.abs(layout.todo.top-layout.working.top)<1&&layout.guide.width<=layout.viewport*2/3,`mobile shows the neighboring status and a compact guide at ${width}px: ${JSON.stringify(layout)}`);
    assert.equal(await evaluate("document.querySelectorAll('[data-guide-target][data-card-id]').length"),1);
  }
  await size(390,844,true);await delay(200);
  await screenshot('guide-task-mobile');
  assert.ok(await evaluate("document.querySelector('#guide-description').textContent.includes('取っ手')&&getComputedStyle(document.querySelector('[data-guide-target][data-card-id]')).touchAction==='pan-y'"),'mobile task guide explains the handle and lets the card body scroll');
  const points=await evaluate(`(()=>{
    for(const el of document.querySelectorAll('[data-guide-target][data-card-id]')){
      const r=el.querySelector('.task-drag-handle').getBoundingClientRect(),x=r.left+r.width/2;
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
  await evaluate("document.querySelector('.kanban').scrollLeft=0");await delay(200);
  assert.ok(await evaluate("document.querySelector('[data-status=done]').getBoundingClientRect().left>=innerWidth-12"),'the Done column is outside the phone viewport');
  const taskTap=await evaluate("(()=>{const r=document.querySelector('.working [data-guide-target]').getBoundingClientRect(),deck=document.querySelector('.clue-drawer').getBoundingClientRect();return {x:(Math.max(0,r.left)+Math.min(innerWidth,r.right))/2,y:(Math.max(0,r.top)+Math.min(innerHeight,deck.top,r.bottom))/2};})()");
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[taskTap]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await waitFor("Boolean(document.querySelector('dialog.task-detail[open] .operation-guide[data-guide=task-done]'))");
  await screenshot('guide-task-done-popup-mobile');
  await reload();await waitGuide('task-done');
  await click(`[data-action="investigate:${points.id}"]`);
  await waitFor("Boolean(document.querySelector('dialog.task-detail[open] .operation-guide[data-guide=task-done]'))");
  await click('[data-action="task-status:done"]');
  await waitGuide('history');assert.equal((await state()).board[points.id],'done','the popup Done button completes the guide without dragging to the hidden column');
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
  if(await evaluate("document.querySelector('.desktop').classList.contains('show-chat')"))await click('[data-action="panel:chat"]');
  assert.equal(await evaluate("document.querySelector('.topbar')"),null,'game has no header row');
  assert.equal(await evaluate("document.querySelector('.mobile-tabs [data-action=notebook]')"),null,'clues are removed from the sub tabs');
  assert.equal(await evaluate("document.querySelector('.mobile-tabs')"),null,'the subtab row is removed');
  assert.equal(await evaluate("document.querySelector('[data-action=notebook]')"),null,'there is no clues button');
  assert.ok(await evaluate("(()=>{const chat=document.querySelector('.floating-chat').getBoundingClientRect(),menu=document.querySelector('.game-menu-toggle').getBoundingClientRect();return Math.abs(chat.right-menu.right)<1&&chat.top>menu.bottom&&chat.width>0;})()"),'floating chat is directly below the hamburger');
  await click('[data-action=menu-toggle]');
  assert.equal(await evaluate("document.querySelector('#game-menu-panel').hidden"),false);
  assert.equal(await evaluate("document.querySelectorAll('#game-menu-panel .stat').length"),2,'both knowledge statuses are in the menu');
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.game-menu-actions button')].map(b=>({label:b.getAttribute('aria-label'),text:b.textContent,svg:Boolean(b.querySelector('svg'))}))"),[{label:'タイトルへ',text:'',svg:true},{label:'設定',text:'',svg:true}],'menu actions are accessible home and gear icons');
  await screenshot('game-menu-mobile');
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
  assert.equal(await evaluate("document.querySelector('#game-menu-panel').hidden"),true,'Escape closes the menu');
  const bodySwipe=await evaluate("(()=>{const list=document.querySelector('.todo .kanban-cards'),card=list.querySelector('.action-card');for(let i=0;i<5;i++){const copy=card.cloneNode(true);copy.dataset.scrollFixture='';list.append(copy);}list.scrollTop=0;const r=card.querySelector('.action-top h3').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};})()");
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[bodySwipe]});
  for(let n=1;n<=8;n++){await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:bodySwipe.x,y:bodySwipe.y-100*n/8}]});await delay(16);}
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await delay(100);
  assert.ok(await evaluate("document.querySelector('.todo .kanban-cards').scrollTop>0"),'swiping the card title scrolls the column vertically');
  assert.equal((await state()).phase,'desk','scrolling the card body does not start a task');
  assert.equal(await evaluate("document.querySelector('.touch-card-ghost')"),null,'scrolling the body does not create a drag ghost');
  await evaluate("document.querySelectorAll('[data-scroll-fixture]').forEach(el=>el.remove());document.querySelector('.todo .kanban-cards').scrollTop=0");await delay(100);
  await screenshot('task-drag-handle-mobile');
  const freeDrag=await evaluate("(()=>{const source=document.querySelector('.todo [data-card-id]'),r=source.querySelector('.task-drag-handle').getBoundingClientRect(),d=document.querySelector('[data-status=working]').getBoundingClientRect();return {id:source.dataset.cardId,x:r.left+r.width/2,y:r.top+r.height/2,tx:(d.left+Math.min(d.right,innerWidth-12))/2};})()");
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:freeDrag.x,y:freeDrag.y}]});
  for(let n=1;n<=6;n++)await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:freeDrag.x+(freeDrag.tx-freeDrag.x)*n/6,y:freeDrag.y}]});
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal((await state()).phase,'scene','ordinary touch drag starts a task with no guide active');
  assert.equal((await state()).conversation.actionId,freeDrag.id);
  assert.equal(await evaluate("document.querySelector('.touch-card-ghost')"),null,'ordinary drag cleans up the ghost');
  await settle();await click('[data-action=report]');
  if(await evaluate("Boolean(document.querySelector('[data-action=join-meeting]'))"))await click('[data-action=join-meeting]');
  await waitFor("document.querySelector('.reporting')?.dataset.meetingPhase==='speaking'");
  await click('[data-action=meeting-share]');
  assert.equal(await guide(),null,'tap selection is also tested outside the guide');
  assert.equal(await evaluate("document.querySelectorAll('.reporting [draggable=true]').length"),0,'report cards are not draggable');
  const clueDrag=await evaluate("(()=>{const source=document.querySelector('#shared-clue-deck [data-evidence-id]'),r=source.querySelector('.evidence-top').getBoundingClientRect();return {id:source.dataset.evidenceId,x:Math.min(r.right-12,180),y:r.top+r.height/2};})()");
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:clueDrag.x,y:clueDrag.y}]});
  for(let n=1;n<=8;n++){await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:clueDrag.x-140*n/8,y:clueDrag.y}]});await delay(16);}
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await delay(150);
  assert.ok(await evaluate("document.querySelector('#shared-clue-deck .evidence-grid').scrollLeft>0"),'swiping a card header scrolls the hand horizontally');
  assert.equal((await state()).selected.length,0,'swiping does not select a card');
  assert.equal(await evaluate("document.querySelector('.touch-card-ghost')"),null,'swiping creates no drag ghost');
  await click(`#shared-clue-deck [data-action="select:${clueDrag.id}"]`);
  assert.ok((await state()).selected.includes(clueDrag.id),'tap selects a clue');
  const secondClue=await evaluate("document.querySelectorAll('#shared-clue-deck [data-evidence-id]')[1].dataset.evidenceId");
  await click(`#shared-clue-deck [data-action="select:${secondClue}"]`);
  assert.deepEqual((await state()).reportSlots.slice(0,2),[clueDrag.id,secondClue],'tap fills the next available slot');
  assert.equal(await evaluate("document.querySelector('.report-slot .evidence-card')"),null,'mobile selected clues contain titles');
  // Add a third known clue to the short fixture to check a full selection.
  const thirdClue=await evaluate("import('./data/content.mjs').then(({cases})=>{const s=JSON.parse(localStorage.getItem('report-drill.pdf-incident.v1')),id=cases.watermark.problem.evidence.find(c=>!s.evidence.includes(c.id)).id;s.evidence.push(id);s.acquired[id]=s.time;localStorage.setItem('report-drill.pdf-incident.v1',JSON.stringify(s));return id;})");
  await reload();
  if(await evaluate("Boolean(document.querySelector('[data-action=join-meeting]'))"))await click('[data-action=join-meeting]');
  await waitFor("document.querySelector('.reporting')?.dataset.meetingPhase==='speaking'");
  await click('[data-action=meeting-share]');
  await click(`[data-action="select:${thirdClue}"]`);
  assert.equal(await evaluate("document.querySelectorAll('.report-clue-title').length"),3,'all three selected clues are represented by titles');
  await evaluate("(()=>{const source=document.querySelector('[data-report-slot=\"0\"] .report-clue-title'),target=document.querySelector('[data-report-slot=\"2\"]'),dataTransfer=new DataTransfer();source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer}));target.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer}));target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer}));source.dispatchEvent(new DragEvent('dragend',{bubbles:true,dataTransfer}));})()");
  assert.deepEqual((await state()).reportSlots,[clueDrag.id,secondClue,thirdClue],'dragging does not change a full three-item selection');
  let previousCardHeight=0;
  for(const [width,height] of [[375,667],[390,844],[430,932]]){
    await size(width,height,true);
    const layout=await evaluate("(()=>{const list=document.querySelector('.report-slots'),cards=[...list.querySelectorAll('.report-clue-title')];return {height:cards[0].getBoundingClientRect().height,scroll:list.scrollHeight,client:list.clientHeight,cardBackground:getComputedStyle(cards[0]).backgroundColor,noteBackground:getComputedStyle(document.querySelector('.report-board')).backgroundImage};})()");
    assert.ok(layout.height>previousCardHeight,`selected cards grow with the available height at ${width}x${height}`);
    assert.ok(layout.scroll<=layout.client+1,'selected cards fit inside the shared view');
    assert.notEqual(layout.cardBackground,'rgba(0, 0, 0, 0)','selected titles have a paper card background');
    assert.ok(layout.noteBackground.includes('repeating-linear-gradient'),'notebook rules cover the shared app body');
    previousCardHeight=layout.height;
    await screenshot(`selected-cards-mobile-${width}`);
  }
  await size(390,844,true);
  await screenshot('selected-title-list-mobile');
  for(const width of [1024,1440]){
    await size(width,900);
    await waitFor("document.querySelectorAll('.report-slot .evidence-card').length===3");
    assert.ok(await evaluate("(()=>{const cards=[...document.querySelectorAll('.report-slot .evidence-card')],rows=cards.map(c=>c.getBoundingClientRect()),message=document.querySelector('.report-conversation .conversation-window').getBoundingClientRect(),submit=document.querySelector('.share-submit button').getBoundingClientRect();return rows.every((r,i)=>r.height>=160&&Math.abs(r.top-rows[0].top)<1&&(!i||r.left>rows[i-1].left))&&cards.every(c=>c.querySelector('h3')&&c.querySelector('p'))&&message.right<=submit.left&&Math.abs(message.bottom-submit.bottom)<2;})()"),`desktop shares full cards horizontally and keeps Submit beside the message at ${width}px`);
    if(width===1440)await screenshot('selected-cards-desktop');
  }
  await size(390,844,true);
  await waitFor("document.querySelectorAll('.report-clue-title').length===3");
  assert.deepEqual((await state()).reportSlots,[clueDrag.id,secondClue,thirdClue],'resizing preserves the selected order');
  await click('[data-action=submit]');await settle();
  if(await guide()==='back-to-investigate')await click('[data-action=investigate]');
  if(await guide()==='report-tab')await click('[data-action=report]');
  assert.ok(await evaluate("Number(document.querySelector('.floating-chat .chat-unread-badge')?.textContent)>0"),'new work updates the floating chat notification badge');
  await click('[data-action="panel:chat"]');
  assert.equal(await evaluate("document.querySelector('.desktop').classList.contains('show-chat')"),true,'floating icon opens chat');
  assert.equal(await evaluate("document.querySelector('.floating-chat .chat-unread-badge')"),null,'opening chat clears unread badge');
  await screenshot('floating-chat-mobile');
  await click('[data-action="panel:chat"]');
  assert.equal(await evaluate("document.querySelector('.desktop').classList.contains('show-chat')"),false,'the same floating icon returns to the desk');
  await click('[data-action=investigate]');
  const taskTime=(await state()).time;
  await click(`[data-action="investigate:${freeDrag.id}"]`);
  assert.ok(await evaluate("Boolean(document.querySelector('dialog.task-detail[open]'))"),'working task opens its status and log popup');
  assert.deepEqual(await evaluate("[...document.querySelectorAll('.task-status-button')].map(b=>b.textContent)"),['未着手','作業中','完了']);
  assert.equal(await evaluate("document.querySelector('.task-status-button[aria-pressed=true]').dataset.status"),'working');
  assert.ok(await evaluate("Boolean(document.querySelector('.task-log-list .bot-message .history-inline'))"),'task popup reuses chatbot history cards and conversation logs');
  await click('[data-action="task-status:done"]');
  assert.equal((await state()).board[freeDrag.id],'done');
  assert.equal((await state()).time,taskTime,'status movement consumes no time');
  await click(`[data-action="investigate:${freeDrag.id}"]`);
  assert.equal(await evaluate("document.querySelector('.task-status-button[aria-pressed=true]').dataset.status"),'done','completed task also opens the popup with its active status');
  await size(1440,1000);
  assert.ok(await evaluate("(()=>{const summary=document.querySelector('.task-log-list .history-item'),title=summary.querySelector('.history-copy').getBoundingClientRect(),gains=summary.querySelector('.history-deltas')?.getBoundingClientRect(),savings=summary.querySelector('.history-savings')?.getBoundingClientRect();return getComputedStyle(summary).display==='grid'&&title.width>300&&title.height<80&&(!gains||!gains.height||gains.top>=title.bottom)&&(!savings||!savings.height||savings.top>=title.bottom);})()"),'desktop task log title retains its width and the gains and savings sit below it');
  await evaluate("(()=>{const logs=document.querySelector('.task-log-list'),entry=logs.firstElementChild;for(let i=0;i<4;i++)logs.append(entry.cloneNode(true));})()");
  for(const [width,height] of [[320,568],[390,844],[1440,1000]]){
    await size(width,height,width<700);
    assert.ok(await evaluate("(()=>{const popup=document.querySelector('.task-detail'),logs=popup.querySelector('.task-log-list'),toolbar=popup.querySelector('.task-status-toolbar'),before=toolbar.getBoundingClientRect().top;logs.scrollTop=logs.scrollHeight;return getComputedStyle(popup).overflowY==='hidden'&&getComputedStyle(logs).overflowY==='auto'&&logs.scrollHeight>logs.clientHeight&&logs.scrollTop>0&&toolbar.getBoundingClientRect().top===before&&[...logs.querySelectorAll('.history-inline')].every(e=>getComputedStyle(e).overflowY==='visible');})()"),`only task logs scroll and status buttons stay fixed at ${width}x${height}`);
  }
  await size(390,844,true);
  await screenshot('task-popup-mobile');
  await size(1440,1000);await screenshot('task-popup-desktop');await size(390,844,true);
  await click('[data-action="task-status:working"]');
  assert.equal((await state()).phase,'scene','working button reruns the completed task');
  assert.ok((await state()).time>taskTime,'rerunning consumes the task time');
  await settle();
  await click(`[data-action="investigate:${freeDrag.id}"]`);
  assert.ok(await evaluate("document.querySelectorAll('.task-log-list .bot-message').length>=2"),'rerun adds a new task log while preserving earlier logs');
  const rerunTime=(await state()).time;
  await click('[data-action="task-status:todo"]');
  assert.equal((await state()).board[freeDrag.id],'todo');
  assert.equal((await state()).time,rerunTime,'moving back to todo consumes no time');
  assert.deepEqual(errors,[],'no browser runtime errors');

  console.log('Guides: input blocking, drag, pause, reload, one-time history, manual sharing, mobile and report: OK');
} finally {
  if(socket)socket.close();if(browser)browser.kill();server.kill();
}
