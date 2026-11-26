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
    if(['[data-action=report]','[data-action=continue]'].includes(selector)&&await evaluate("Boolean(document.querySelector('.reporting'))")){if(await evaluate("Boolean(document.querySelector('[data-action=join-meeting]'))"))await click('[data-action=join-meeting]');await waitFor("['speaking','shared'].includes(document.querySelector('.reporting')?.dataset.meetingPhase)");if(await evaluate("document.querySelector('.reporting')?.classList.contains('meeting-unshared')"))await click('[data-action=meeting-share]');}
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
  await call('Runtime.enable');await call('Page.enable');
  await call('Page.addScriptToEvaluateOnNewDocument',{source:"localStorage.setItem('report-drill.guides.v1',JSON.stringify({seen:['overview','task-start','clue','task-done','history','report-tab','back-to-investigate','join','share','select','submit'],pending:[]}))"});
  await call('Page.navigate',{url});await waitFor("Boolean(document.querySelector('[data-action=start]'))");
  const seed=async phase=>{
    await evaluate(`Promise.all([import('./data/content.mjs'),import('./engine.mjs')]).then(([{cases},{createEngine}])=>{const {problem,scenario}=cases.watermark,s=createEngine(problem,scenario).start();s.settings.instant=true;s.settings.reduced=true;if(${JSON.stringify(phase)}!=='scene'){s.phase=${JSON.stringify(phase)};s.conversation=null;}else s.conversation.line=3;if(s.phase==='desk')s.done=[problem.investigations[0].id];localStorage.setItem('report-drill.pdf-incident.v1',JSON.stringify(s));})`);
    await call('Page.reload');await waitFor("Boolean(document.querySelector('[data-action=continue]'))");await click('[data-action=continue]');
  };
  for(const [width,height] of [[320,568],[375,667],[390,844],[667,375]]){
    await size(width,height,true);await seed('scene');
    const cast=await evaluate("(()=>{const active=document.querySelector('.portrait.speaking').getBoundingClientRect(),stage=document.querySelector('.portrait-stage').getBoundingClientRect();return {center:active.left+active.width/2,stageCenter:stage.left+stage.width/2,width:active.width,otherWidths:[...document.querySelectorAll('.portrait:not(.speaking)')].map(p=>p.getBoundingClientRect().width)};})()");
    assert.ok(Math.abs(cast.center-cast.stageCenter)<1,'speaker is centered');
    assert.ok(cast.otherWidths.every(w=>w<cast.width),'speaker is larger than the supporting cast');
    const next=await evaluate("(()=>{const n=document.querySelector('.conversation-next'),r=n.getBoundingClientRect();return {width:r.width,height:r.height,radius:getComputedStyle(n).borderRadius};})()");
    assert.equal(next.width,next.height);assert.equal(next.radius,'50%','next button is circular');
    if(width===390)await screenshot('mobile-centered-speaker');
    for(const phase of ['briefing','desk','report']){
      await seed(phase);
      assert.ok(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth+1'),`no page overflow in ${phase} at ${width}px`);
      if(phase==='desk')assert.ok(await evaluate("(()=>{const board=document.querySelector('.kanban');return board.scrollWidth<=board.clientWidth+1;})()"),'the investigation board does not scroll horizontally');
      if(phase==='briefing')assert.ok(await evaluate("(()=>{const o=document.querySelector('.ticket-overview');return o.scrollWidth<=o.clientWidth+1&&o.getBoundingClientRect().right<=innerWidth;})()"),'overview fits without horizontal scrolling');
      if(width===390)await screenshot(`mobile-${phase}`);
    }
  }
  await size(390,844,true);await seed('scene');
  await evaluate("document.querySelector('[data-action=settings]')?.click()");
  // Re-seed without reduced motion to check the stage movement animation itself.
  await evaluate("(()=>{const s=JSON.parse(localStorage.getItem('report-drill.pdf-incident.v1'));s.settings.reduced=false;localStorage.setItem('report-drill.pdf-incident.v1',JSON.stringify(s));})()");
  await call('Page.reload');await waitFor("Boolean(document.querySelector('[data-action=continue]'))");await click('[data-action=continue]');
  await click('[data-action=scene-next]');
  assert.ok(await evaluate("[...document.querySelectorAll('.portrait')].some(p=>p.getAnimations().length>0)"),'cast moves between stage positions when the speaker changes');
  assert.equal(await evaluate("[...document.querySelectorAll('.portrait')].some(p=>p.getAnimations().some(a=>a.effect.getKeyframes().some(frame=>frame.opacity!==undefined)))"),false,'returning speakers do not fade in again');
  await click('[data-action=scene-next]');await click('[data-action=scene-next]');
  assert.ok(await evaluate("document.querySelector('.portrait[data-speaker=player]').getAnimations().some(a=>a.effect.getKeyframes().some(frame=>Number(frame.opacity)===0))"),'a new speaker fades in');
  assert.equal(await evaluate("[...document.querySelectorAll('.portrait:not([data-speaker=player])')].some(p=>p.getAnimations().some(a=>a.effect.getKeyframes().some(frame=>frame.opacity!==undefined)))"),false,'existing cast keeps moving without a new fade');
  await delay(500);
  assert.ok(await evaluate("(()=>{const p=document.querySelector('.portrait.speaking').getBoundingClientRect(),s=document.querySelector('.portrait-stage').getBoundingClientRect();return Math.abs(p.left+p.width/2-s.left-s.width/2)<1;})()"));
  assert.deepEqual(errors,[]);
  console.log('PASS: centered larger speaker, stage animation, round next, overview, desk and meeting bounded at four mobile sizes');
}finally{if(socket)socket.close();if(browser)browser.kill();server.kill();}
