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
    assert.ok(await evaluate("(()=>{const label=document.querySelector('dialog[open]>.conversation-task'),r=label?.getBoundingClientRect();return r&&Math.abs(r.left-12)<1&&Math.abs(r.top-12)<1&&r.right<=innerWidth-10&&!document.querySelector('dialog[open] .conversation-pagination .conversation-label');})()"),`mobile task label sits at the screen top left at ${width}px`);
    const cast=await evaluate("(()=>{const active=document.querySelector('.portrait.speaking').getBoundingClientRect(),stage=document.querySelector('.portrait-stage').getBoundingClientRect();return {center:active.left+active.width/2,stageCenter:stage.left+stage.width/2,width:active.width,otherWidths:[...document.querySelectorAll('.portrait:not(.speaking)')].map(p=>p.getBoundingClientRect().width)};})()");
    assert.ok(Math.abs(cast.center-cast.stageCenter)<1,'speaker is centered');
    assert.ok(cast.otherWidths.every(w=>w<cast.width),'speaker is larger than the supporting cast');
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.portrait:not(.across-table)')].map(p=>p.dataset.speaker)"),['player','lead','sales'],'fixed supplier seats are visible while the client side stays behind the camera');
    assert.ok(await evaluate("(()=>{const s=document.querySelector('.portrait-stage').getBoundingClientRect();return [...document.querySelectorAll('.portrait:not(.across-table) img')].every(p=>{const r=p.getBoundingClientRect();return r.left>=s.left+8&&r.right<=s.right-8;});})()"),'all visible portraits fit inside the stage');
    const next=await evaluate("(()=>{const n=document.querySelector('.conversation-next'),r=n.getBoundingClientRect();return {width:r.width,height:r.height,radius:getComputedStyle(n).borderRadius};})()");
    assert.equal(next.radius,'0px','next arrow has no surrounding circle');
    assert.ok(await evaluate("(()=>{const n=document.querySelector('.conversation-next'),s=getComputedStyle(n);return s.borderTopWidth==='0px'&&s.backgroundColor==='rgba(0, 0, 0, 0)'&&s.boxShadow==='none'&&getComputedStyle(n,'::after').content==='none';})()"),'next arrow has no border, background, shadow or ring');
    for(const sample of ['**拡大文字**を含むセリフです。','通常の文字と**大きな文字**\\n**強調した次の行**です。',Array(4).fill('**強調**の台詞です。').join('\n')]){
      const dimensions=await evaluate(`import('./dialogue-text.mjs').then(({setDialogue})=>{const text=document.querySelector('#dialogue-text');text.dataset.fullDialogue=${JSON.stringify(sample)}.replaceAll('\\\\n','\\n');dispatchEvent(new Event('resize'));setDialogue(text,text.dataset.fullDialogue);return {scroll:text.scrollHeight,client:text.clientHeight,right:getComputedStyle(text).paddingRight};})`);
      assert.ok(dimensions.scroll<=dimensions.client,`short emphasized dialogue has no scrollbar at ${width}px: ${JSON.stringify(dimensions)}`);
      assert.equal(dimensions.right,'8px','mobile dialogue does not reserve a column for the caret');
    }
    if(width===390)await screenshot('mobile-centered-speaker');
    for(const phase of ['briefing','desk','report']){
      await seed(phase);
      assert.ok(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth+1'),`no page overflow in ${phase} at ${width}px`);
      if(phase==='desk')assert.ok(await evaluate("(()=>{const board=document.querySelector('.kanban'),r=board.getBoundingClientRect(),working=board.querySelector('[data-status=working]').getBoundingClientRect();return board.scrollWidth>board.clientWidth&&working.left<r.right;})()"),'the board scrolls internally and shows the neighboring status');
      if(phase==='desk')assert.ok(await evaluate("!document.querySelector('.mobile-tabs')&&![...document.querySelectorAll('.board-view p')].some(p=>p.textContent.includes('イベント開始'))&&[...document.querySelectorAll('.kanban-column>h2')].every(h=>h.getBoundingClientRect().height<24)"),'subtabs and the instruction are removed, and column headers are compact');
      if(phase==='desk')assert.equal(await evaluate("document.querySelectorAll('.menu-knowledge .stat').length"),2,'phone keeps knowledge statuses inside the menu');
      if(phase==='desk'){
        for(const deckSize of ['medium','small']){
          await click(`[data-action="deck-size:${deckSize}"]`);
          assert.ok(await evaluate("(()=>{const area=document.querySelector('.work-area').getBoundingClientRect(),board=document.querySelector('.board-view').getBoundingClientRect(),deck=document.querySelector('.clue-drawer').getBoundingClientRect();return Math.abs(board.top-area.top)<1&&Math.abs(board.bottom-deck.top)<1&&Math.abs(deck.bottom-innerHeight)<2&&Math.abs(board.height+deck.height-area.height)<2;})()"),`board fills remaining space at ${width}x${height}, ${deckSize} deck`);
        }
        assert.ok(await evaluate("!document.querySelector('.game-menu-toggle').hidden&&document.querySelector('#game-menu-panel .game-menu-actions')"),'phone keeps the two actions inside its hamburger menu');
        await click('[data-action="deck-size:large"]');
        assert.ok(await evaluate("(()=>{const r=document.querySelector('.game-menu-toggle').getBoundingClientRect();return Boolean(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.closest('.deck-large'));})()"),'full-screen workbook covers the phone hamburger menu');
        await click('[data-action="deck-size:small"]');
      }
      if(phase==='briefing')assert.ok(await evaluate("(()=>{const o=document.querySelector('.ticket-overview');return o.scrollWidth<=o.clientWidth+1&&o.getBoundingClientRect().right<=innerWidth;})()"),'overview fits without horizontal scrolling');
      if(phase==='report')assert.ok(await evaluate("(()=>{const text=document.querySelector('.report-request'),frame=text.closest('.conversation-window').getBoundingClientRect();return frame.height<=150&&text.scrollHeight<=text.clientHeight;})()"),'report message frame is compact and its request fits without scrolling');
      if(phase==='report')assert.ok(await evaluate("import('./dialogue-text.mjs').then(({setDialogue})=>{const text=document.querySelector('.report-request'),span=text.querySelector('.report-request-text'),sample=Array(4).fill('**強調**の台詞です。').join('\\n');text.dataset.fullDialogue=sample;dispatchEvent(new Event('resize'));setDialogue(span,sample);return text.contains(span)&&text.scrollHeight<=text.clientHeight;})"),'four emphasized report lines fit without scrolling and keep the typewriter span connected');
      if(phase==='report'){
        assert.ok(await evaluate("(()=>{const message=document.querySelector('.report-conversation .conversation-window').getBoundingClientRect(),people=document.querySelector('.self-panel').getBoundingClientRect(),submit=document.querySelector('.share-submit button').getBoundingClientRect();return message.right<=people.left&&message.right<=submit.left&&Math.abs(people.left-submit.left)<1&&people.bottom>message.top&&submit.top>=people.bottom&&Math.abs(submit.bottom-message.bottom)<2;})()"),'participant gallery extends beside the message and Submit sits below it at the message right');
        if(width===320)await screenshot('mobile-meeting-layout-debug');
        const meetingLayout=await evaluate("JSON.stringify({stage:document.querySelector('.report-stage').getBoundingClientRect().toJSON(),controls:document.querySelector('.meeting-controls').getBoundingClientRect().toJSON(),people:[...document.querySelector('.self-panel').children].map(p=>p.getBoundingClientRect().toJSON())})");
        assert.ok(await evaluate("(()=>{const stage=document.querySelector('.report-stage').getBoundingClientRect(),controls=document.querySelector('.meeting-controls').getBoundingClientRect(),people=[...document.querySelector('.self-panel').children].map(p=>p.getBoundingClientRect());return people.length===3&&people.every(p=>p.width>0&&p.height>0&&p.left>stage.left+stage.width/2&&p.right<=innerWidth)&&people.every((p,i)=>!i||p.top>=people[i-1].bottom)&&controls.left<=stage.left+10&&controls.top<=stage.top+8&&controls.right<=people[0].left;})()"),`sharing stacks three cameras on the right and puts controls in the top left: ${meetingLayout}`);
        await click('[data-action=meeting-camera]');
        assert.equal(await evaluate("document.querySelectorAll('.self-panel>*>img').length"),3,'all three face images appear when the camera is on');
        await click('[data-action=meeting-share]');
        assert.ok(await evaluate("(()=>{const area=document.querySelector('.reporting').getBoundingClientRect(),r=document.querySelector('.meeting-controls').getBoundingClientRect();return r.left<=area.left+10&&r.top<=area.top+8;})()"),'controls also stay in the upper left when not sharing');
        await click('[data-action=meeting-share]');
      }
      if(width===390)await screenshot(`mobile-${phase}`);
    }
  }
  await size(390,844,true);
  await evaluate("Promise.all([import('./data/content.mjs'),import('./engine.mjs')]).then(([{cases},{createEngine}])=>{const {problem,scenario}=cases.watermark,e=createEngine(problem,scenario),s=e.start();while(s.phase==='scene')e.advance(s,true);e.beginWork(s);e.investigate(s,'wm.purpose-check');s.settings={instant:true,reduced:true};localStorage.setItem('report-drill.pdf-incident.v1',JSON.stringify(s));})");
  await call('Page.reload');await waitFor("Boolean(document.querySelector('[data-action=continue]'))");await click('[data-action=continue]');
  assert.equal(await evaluate("document.querySelector('dialog[open]>.conversation-task').textContent"),'依頼と現物を確認する - 20m経過');
  await click('[data-action=scene-next]');
  assert.equal(await evaluate("document.querySelectorAll('dialog[open]>.conversation-task').length"),1,'advancing updates the task label without duplicates');
  await size(1024,768);
  assert.equal(await evaluate("document.querySelectorAll('.left-rail .stat').length"),2,'resizing to desktop moves both statuses back to the left column');
  assert.equal(await evaluate("document.querySelector('dialog[open]>.conversation-task').textContent"),'依頼と現物を確認する - 20m経過','desktop uses the same task label');
  for(const [width,height] of [[1024,768],[1440,900]]){
    await size(width,height);await seed('desk');
    assert.ok(await evaluate("document.querySelector('.game-menu-toggle').hidden&&document.querySelectorAll('.game-menu>.game-menu-actions button').length===2&&[...document.querySelectorAll('.game-menu>.game-menu-actions button')].every(b=>b.getBoundingClientRect().width>0)"),'desktop shows Home and Settings directly without a hamburger');
    await click('[data-action="deck-size:large"]');
    assert.ok(await evaluate("(()=>{const r=document.querySelector('.game-menu').getBoundingClientRect();return Boolean(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.closest('.deck-large'));})()"),'full-screen workbook covers desktop menu actions');
    await click('[data-action="deck-size:small"]');
    assert.equal(await evaluate("document.querySelectorAll('.left-rail .stat').length"),2,'desktop shows both statuses in the left column');
    assert.equal(await evaluate("document.querySelectorAll('.menu-knowledge .stat').length"),0,'desktop menu does not duplicate the statuses');
    const layout=await evaluate("(()=>{const area=document.querySelector('.work-area').getBoundingClientRect(),board=document.querySelector('.board-view').getBoundingClientRect(),deck=document.querySelector('.clue-drawer').getBoundingClientRect(),main=document.querySelector('.desktop').getBoundingClientRect(),chat=document.querySelector('.chat-panel').getBoundingClientRect();return {area:area.toJSON(),board:board.toJSON(),deck:deck.toJSON(),main:main.toJSON(),chat:chat.toJSON(),height:innerHeight};})()");
    assert.ok(Math.abs(layout.board.top-layout.area.top)<1&&Math.abs(layout.board.bottom-layout.deck.top)<1&&Math.abs(layout.deck.bottom-height)<2,`desktop board fills available height at ${width}x${height}: ${JSON.stringify(layout)}`);
    if(width===1024){
      await click('[data-action="panel:chat"]');
      assert.ok(await evaluate(`getComputedStyle(document.querySelector('.chat-panel')).display==='flex'&&Math.abs(document.querySelector('.board-view').getBoundingClientRect().height-${layout.board.height})<1`),'tablet chat opens without taking board height');
      await click('[data-action="panel:chat"]');
      assert.equal(await evaluate("getComputedStyle(document.querySelector('.chat-panel')).display"),'none','tablet chat closes with the same icon');
    }
    await seed('report');
    assert.ok(await evaluate("(()=>{const message=document.querySelector('.report-conversation .conversation-window').getBoundingClientRect(),people=document.querySelector('.self-panel').getBoundingClientRect(),submit=document.querySelector('.share-submit button').getBoundingClientRect();return message.right<=people.left&&message.right<=submit.left&&Math.abs(people.left-submit.left)<1&&people.bottom>message.top&&submit.top>=people.bottom&&Math.abs(submit.bottom-message.bottom)<2;})()"),`desktop report uses the side gallery and bottom submit at ${width}px`);
    if(width===1440)await screenshot('desktop-report-sidebar');
  }
  for(const [width,height] of [[1920,870],[1500,1000],[980,700],[700,900]]){
    await size(width,height);await seed('scene');
    assert.ok(await evaluate("(()=>{const r=document.querySelector('dialog[open]>.conversation-task').getBoundingClientRect();return Math.abs(r.left-12)<1&&Math.abs(r.top-12)<1;})()"),`desktop task label sits at the screen top left at ${width}px`);
    assert.ok(await evaluate("(()=>{const s=document.querySelector('.portrait-stage').getBoundingClientRect();return [...document.querySelectorAll('.portrait:not(.across-table) img')].every(p=>{const r=p.getBoundingClientRect();return r.left>=s.left+8&&r.right<=s.right-8;});})()"),`desktop edge portraits fit at ${width}x${height}`);
    assert.equal(await evaluate("document.querySelector('.portrait-stage').getAnimations({subtree:true}).length"),0,'reduced motion skips camera animations');
    assert.ok(await evaluate("import('./dialogue-text.mjs').then(({setDialogue})=>{const text=document.querySelector('#dialogue-text');text.dataset.fullDialogue='**拡大文字**を含む短いセリフです。';dispatchEvent(new Event('resize'));setDialogue(text,text.dataset.fullDialogue);return text.scrollHeight<=text.clientHeight&&getComputedStyle(text).paddingRight==='16px';})"),`desktop emphasized text fits without scrolling at ${width}px`);
    if(width===1500)await screenshot('desktop-seated-conversation');
    if(width===700)assert.ok(await evaluate("import('./dialogue-text.mjs').then(({setDialogue})=>{const text=document.querySelector('#dialogue-text');text.dataset.fullDialogue=Array(30).fill('**長い会話**も最後まで読めます。').join('\\n');dispatchEvent(new Event('resize'));setDialogue(text,text.dataset.fullDialogue);return text.scrollHeight>text.clientHeight&&getComputedStyle(text).overflowY==='auto';})"),'genuinely long dialogue remains scrollable');
  }
  await size(390,844,true);await seed('scene');
  await evaluate("document.querySelector('[data-action=settings]')?.click()");
  // Re-seed without reduced motion to check the stage movement animation itself.
  await evaluate("(()=>{const s=JSON.parse(localStorage.getItem('report-drill.pdf-incident.v1'));s.settings.reduced=false;localStorage.setItem('report-drill.pdf-incident.v1',JSON.stringify(s));})()");
  await call('Page.reload');await waitFor("Boolean(document.querySelector('[data-action=continue]'))");await click('[data-action=continue]');
  await click('[data-action=scene-next]');
  assert.ok(await evaluate("[...document.querySelectorAll('.portrait')].some(p=>p.getAnimations().length>0)"),'cast moves between stage positions when the speaker changes');
  assert.equal(await evaluate("document.querySelector('.portrait-stage').dataset.cameraSide"),'client');
  assert.ok(await evaluate("document.querySelector('.portrait.speaking').getAnimations().some(a=>a.effect.getKeyframes().some(frame=>frame.transform&&frame.filter?.includes('blur(22px)')))"),'opposite side slides in with a fast blur');
  assert.ok(await evaluate("Boolean(document.querySelector('.conversation-camera-trail'))"),'the outgoing view sweeps away');
  await click('[data-action=scene-next]');
  assert.ok(await evaluate("document.querySelector('.portrait.speaking').getAnimations().some(a=>a.effect.getKeyframes().some(frame=>/-\\s*[\\d.]+px/.test(frame.transform||'')&&frame.filter?.includes('blur(22px)')))"),'returning to the supplier reverses the camera turn');
  await click('[data-action=scene-next]');
  assert.ok(await evaluate("document.querySelector('.portrait[data-speaker=player]').getAnimations().some(a=>a.effect.getKeyframes().some(frame=>frame.transform))"),'the camera pans to the player in their existing seat');
  assert.equal(await evaluate("[...document.querySelectorAll('.portrait:not([data-speaker=player])')].some(p=>p.getAnimations().some(a=>a.effect.getKeyframes().some(frame=>frame.opacity!==undefined)))"),false,'existing cast keeps moving without a new fade');
  await evaluate("Promise.all(document.querySelector('.portrait-stage').getAnimations({subtree:true}).map(a=>a.finished.catch(()=>{})))");
  assert.ok(await evaluate("document.querySelector('.conversation-next svg').getAnimations().some(a=>a.effect.getKeyframes().some(f=>Number(f.opacity)===.3&&f.transform))"),'the caret pulses and moves sideways to distinguish it from overlapping text');
  assert.ok(await evaluate("(()=>{const p=document.querySelector('.portrait.speaking').getBoundingClientRect(),s=document.querySelector('.portrait-stage').getBoundingClientRect();return Math.abs(p.left+p.width/2-s.left-s.width/2)<1;})()"));
  await click('[data-action=scene-skip]');
  assert.equal(await evaluate("document.querySelector('.conversation-camera-trail')"),null,'skipping removes the outgoing view');
  assert.deepEqual(errors,[]);
  console.log('PASS: fixed seating, blurred camera turns, portrait bounds, plain next arrow, emphasized dialogue without scrolling, overview, desk and meeting layouts');
}finally{if(socket)socket.close();if(browser)browser.kill();server.kill();}
