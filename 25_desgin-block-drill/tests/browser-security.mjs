import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdtemp} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(process.env.DRILL_ROOT || fileURLToPath(new URL('../src/',import.meta.url)))+path.sep;
const runner=`<!doctype html><meta charset="utf-8"><pre id="report">RUNNING</pre><iframe id="game" style="width:1500px;height:1000px"></iframe><script type="module">
import {securityDrills,securitySolution} from './security-drills.mjs';
import {stages} from './story.mjs';
import {shareText,shareURL} from './sharing.mjs';
const report=document.querySelector('#report'),frame=document.querySelector('#game');
const check=(value,message)=>{if(!value)throw new Error(message)};
const runtimeErrors=[]; const load=url=>new Promise(resolve=>{frame.onload=()=>{frame.contentWindow.addEventListener('error',e=>runtimeErrors.push(e.message));resolve(frame.contentDocument)};frame.src=url;});
let assertions=0;
try{
 for(const drill of securityDrills){
  const graph=structuredClone(drill.initialGraph),canonical=securitySolution();
  graph.nodes.push(...structuredClone(drill.availableBlocks));
  for(const node of graph.nodes){Object.assign(node,structuredClone(canonical.nodes.find(n=>n.id===node.id)));for(const branch of ['success','failure'])if(!graph.nodes.some(n=>n.id===node[branch]))node[branch]='END'}
  if(drill.id==='security-login')graph.nodes.find(n=>n.id==='login').success='password';
  localStorage.setItem('design-block-drill.v2.'+drill.id,JSON.stringify(graph));
  const doc=await load('./index.html?drill='+drill.id);
  check(doc.querySelectorAll('.case').length===drill.tests.length,drill.id+' case count');
  if(doc.querySelector('#assignmentDialog').open)doc.querySelector('#assignmentDialog').close();
  for(let c=0;c<drill.tests.length;c++){
   doc.querySelectorAll('.case')[c].click();let finished=false;
   // Reopen token details between steps: the title must retain its help button.
   doc.querySelector('#step').click();
   for(let reopen=0;reopen<2;reopen++){
    doc.querySelector('#tokens .token').click();
    check(doc.querySelector('#editorHelp'),'token details removed the help button');
    check(!doc.querySelector('.state-panel').hidden,'token details did not reopen');
    doc.querySelector('#closeBlockDrawer').click();
   }
   doc.querySelector('#nodes .node-action').click();
   check(!doc.querySelector('#editorHelp').hidden,'block editor help did not return');
   for(let i=0;i<200;i++){doc.querySelector('#step').click();const status=doc.querySelector('#resultTitle').textContent;if(['Pass','Fail'].includes(status)){check(status==='Pass',drill.id+'/'+drill.tests[c].id+' failed');finished=true;break;}}
   check(finished,'did not finish');assertions++;
  }
  check(runtimeErrors.length===0,'runtime errors: '+runtimeErrors.join('|'));
  check(doc.querySelectorAll('#logs .processing-card').length>0,'no log cards');
  check(doc.querySelectorAll('.log-panel .dashboard-ambient').length===1,'ambient layer missing or duplicated');
  check(doc.querySelectorAll('.ambient-bars i').length===12,'ambient bars missing');
  if(!frame.contentWindow.matchMedia('(prefers-reduced-motion: reduce)').matches)check(doc.querySelector('.dashboard-ambient').getAnimations({subtree:true}).length>0,'ambient animations not running');
  doc.querySelector('#tokens .token').click();check(doc.querySelector('#state table'),'security details missing');
 }
 localStorage.setItem('design-block-drill.story.v1',JSON.stringify({completedStages:stages.slice(0,8).map(s=>s.id),seenEvents:[],currentStage:'02-04',started:true}));
 let doc=await load('./index.html');check(doc.querySelectorAll('#chapterList .chapter-card').length===3,'chapter count');
 check([...doc.querySelectorAll('#chapterList a')].filter(a=>a.href.includes('security-')).length===0,'chapter 3 drill should stay locked until own clear');
 for(const id of ['shareX','shareLine']){const link=new URL(doc.querySelector('#'+id).href);check(link.searchParams.get('text')===shareText,'share text/hashtags missing');check(link.searchParams.get('url')===shareURL,'share URL incorrect')}
 check(doc.querySelector('.workbooks-link').href==='https://kaku3.github.io/workbooks/','workbooks link missing');
 const copied=[];Object.defineProperty(frame.contentWindow.navigator,'clipboard',{configurable:true,value:{writeText:async text=>copied.push(text)}});doc.querySelector('#copyShare').click();await Promise.resolve();check(copied[0]===shareText+'\\n'+shareURL,'copy share text incorrect');
 doc.querySelector('#continueStory').click();
 await new Promise(resolve=>{frame.onload=resolve});doc=frame.contentDocument;
 check(new URL(frame.contentWindow.location.href).searchParams.get('drill')==='security-login','save migration');
 for(let i=0;i<70&&!doc.querySelector('#storyDialog').open;i++)await new Promise(r=>setTimeout(r,100));
 check(doc.querySelector('#storyDialog').open,'intro did not open');doc.querySelector('#storySkip').click();
 for(let i=0;i<50&&!doc.querySelector('#assignmentDialog').open;i++)await new Promise(r=>setTimeout(r,100));check(doc.querySelector('#assignmentDialog').open,'assignment after intro, errors='+runtimeErrors.join('|')+', introOpen='+doc.querySelector('#storyDialog').open+', badge='+doc.querySelector('.badge').textContent);
 
 const waitIntro=async()=>{for(let i=0;i<70&&!doc.querySelector('#storyDialog').open;i++)await new Promise(r=>setTimeout(r,100));check(doc.querySelector('#storyDialog').open,'story did not open')};
 const runBatch=async()=>{
  if(doc.querySelector('#assignmentDialog').open)doc.querySelector('#assignmentDialog').close();
  const speed=doc.querySelector('#speed'),option=doc.createElement('option');option.value='1';speed.append(option);speed.value='1';
  doc.querySelector('#batch').click();
  for(let i=0;i<400&&!doc.querySelector('#batchResult').open;i++)await new Promise(r=>setTimeout(r,50));
  check(doc.querySelector('#batchResult').open,'batch did not finish');
  check(doc.querySelector('#batchResult').dataset.grade==='excellent','batch did not pass');
 };
 await runBatch();
 check(JSON.parse(localStorage.getItem('design-block-drill.story.v1')).completedStages.includes('03-01'),'batch did not record clear');
 let nextLoaded=new Promise(resolve=>frame.onload=resolve);doc.querySelector('#batchResult').close();await nextLoaded;
 check(new URL(frame.contentWindow.location.href).searchParams.get('drill')==='security-lock','batch must advance to next stage');

 localStorage.setItem('design-block-drill.story.v1',JSON.stringify({completedStages:stages.slice(0,9).map(s=>s.id),seenEvents:[],currentStage:'03-02',started:true}));
 report.textContent='RUNNING mid-chapter';doc=await load('./index.html?mode=story&drill=security-lock');await waitIntro();doc.querySelector('#storySkip').click();
 await new Promise(r=>setTimeout(r,300));check(!doc.querySelector('#assignmentDialog').open,'mid-chapter assignment should stay closed');
 localStorage.setItem('design-block-drill.story.v1',JSON.stringify({completedStages:stages.slice(0,8).map(s=>s.id),seenEvents:[],currentStage:'03-01',pendingClear:'02-04',started:true}));
 report.textContent='RUNNING chapter-clear';doc=await load('./index.html?mode=story&drill=approval-system');await waitIntro();
 let loaded=new Promise(resolve=>frame.onload=resolve);doc.querySelector('#storySkip').click();await loaded;
 check(new URL(frame.contentWindow.location.href).searchParams.get('drill')==='security-login','chapter 2 clear must proceed to chapter 3');
 localStorage.setItem('design-block-drill.story.v1',JSON.stringify({completedStages:stages.map(s=>s.id),seenEvents:[],currentStage:'03-04',pendingClear:'03-04',started:true}));
 report.textContent='RUNNING final-clear';doc=await load('./index.html?mode=story&drill=security-system');await waitIntro();
 loaded=new Promise(resolve=>frame.onload=resolve);doc.querySelector('#storySkip').click();await loaded;
 check(!new URL(frame.contentWindow.location.href).searchParams.get('drill'),'final clear must return to title');
 check(JSON.parse(localStorage.getItem('design-block-drill.story.v1')).pendingClear===null,'clear remains pending');
 check([...frame.contentDocument.querySelectorAll('#chapterList a')].filter(a=>a.href.includes('security-')).length===4,'chapter 3 drill not unlocked after own clear');
 frame.style.width='390px';await new Promise(r=>setTimeout(r,100));check(frame.contentDocument.documentElement.scrollWidth<=frame.contentWindow.innerWidth,'mobile overflow '+frame.contentDocument.documentElement.scrollWidth+'/'+frame.contentWindow.innerWidth+' '+JSON.stringify([...frame.contentDocument.body.querySelectorAll('*')].map(e=>({id:e.id,c:e.className,r:e.getBoundingClientRect().right,l:e.getBoundingClientRect().left})).filter(e=>e.r>390).slice(0,12)));report.textContent='PASS: '+assertions+' browser cases, batch clear/advance, details/logs, chapter unlock, save migration, intro/assignment, chapter/final clears and mobile title';
}catch(error){report.textContent='FAIL: '+error.stack;}
</script>`;
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/__test.html'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(runner);return;}
  const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));if(!file.startsWith(root)){res.writeHead(403).end();return;}
  let data=await readFile(file);if(path.extname(file)==='.html')data=Buffer.from(data.toString('utf8').replace(/<link[^>]+fonts\.googleapis\.com[^>]*>/g,''));
  res.setHeader('Content-Type',{'.html':'text/html; charset=utf-8','.mjs':'application/javascript','.css':'text/css','.png':'image/png'}[path.extname(file)]||'application/octet-stream');res.end(data);
 }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const profile=await mkdtemp(path.join(tmpdir(),'security-browser-'));
const edge=process.env.EDGE_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
let browser,socket;
try{
 browser=spawn(edge,['--headless=new','--disable-gpu','--in-process-gpu','--disable-background-timer-throttling','--disable-renderer-backgrounding','--no-sandbox','--no-first-run','--no-default-browser-check',...(process.env.ENABLE_MOTION?[]:['--force-prefers-reduced-motion']),'--remote-debugging-port=0','--window-size=1500,1000','--user-data-dir='+profile,'http://127.0.0.1:'+server.address().port+'/__test.html'],{windowsHide:true,stdio:'ignore'});
 let port;for(let i=0;i<100;i++){try{port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break}catch{await new Promise(r=>setTimeout(r,100))}}
 assert.ok(port,'DevTools startup');
 const targets=await(await fetch('http://127.0.0.1:'+port+'/json',{signal:AbortSignal.timeout(5000)})).json();
 socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('WebSocket timeout')),8000);socket.onopen=()=>{clearTimeout(timeout);resolve()};socket.onerror=reject});
 let id=0;const pending=new Map();
 socket.onmessage=({data})=>{const msg=JSON.parse(data);if(msg.id){const entry=pending.get(msg.id);if(entry){pending.delete(msg.id);msg.error?entry.reject(new Error(JSON.stringify(msg.error))):entry.resolve(msg.result)}}};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const seq=++id,timeout=setTimeout(()=>reject(new Error('CDP timeout '+method)),8000);pending.set(seq,{resolve:v=>{clearTimeout(timeout);resolve(v)},reject:e=>{clearTimeout(timeout);reject(e)}});socket.send(JSON.stringify({id:seq,method,params}))});
 await call('Runtime.enable');
 let report='';
 for(let i=0;i<400;i++){
  const result=await call('Runtime.evaluate',{expression:"document.querySelector('#report')?.textContent || ''",returnByValue:true});
  report=result.result.value||'';if(report.startsWith('PASS:')||report.startsWith('FAIL:'))break;await new Promise(r=>setTimeout(r,100));
 }
 assert.ok(report.startsWith('PASS:'),report||'No browser report');console.log(report);
}finally{socket?.close();browser?.kill();server.closeAllConnections();server.close()}
