// 外部パッケージ不要。Windows上のEdgeをheadlessで使用します。
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root = path.resolve(process.env.DRILL_ROOT || fileURLToPath(new URL('../src/', import.meta.url))) + path.sep;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const server = createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, `.${requested === '/' ? '/index.html' : requested}`);
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.setHeader('Content-Type', { '.html': 'text/html', '.css': 'text/css', '.mjs': 'application/javascript' }[path.extname(file)] || 'application/octet-stream'); res.end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const profile = await mkdtemp(path.join(tmpdir(), 'design-block-browser-'));
const edge = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = spawn(edge, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await delay(100); }
  }
  assert.ok(port, 'Edge remote debugging starts');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0; const pending = new Map(), errors = [];
  socket.onmessage = ({ data }) => { const msg = JSON.parse(data); if (msg.id) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result); } else if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text); };
  const call = (method, params = {}) => new Promise((resolve, reject) => { const seq = ++id; pending.set(seq, { resolve, reject }); socket.send(JSON.stringify({ id: seq, method, params })); });
  const evaluate = async expression => { const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails)); return result.result.value; };
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1000, deviceScaleFactor: 1, mobile: false });
  const url = `http://127.0.0.1:${server.address().port}/`;
  const waitFor = async expression => { for(let i=0;i<100;i++){ if(await evaluate(expression)) return; await delay(100); } throw new Error(`Timeout: ${expression}`); };
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  const touch=(type,points)=>call('Input.dispatchTouchEvent',{type,touchPoints:points});
  const visit=async drill=>{
    await call('Page.navigate',{url:url+'?drill='+drill});
    await waitFor('!document.documentElement.classList.contains("booting")&&Boolean(document.querySelector(".node"))');
    assert.ok(await evaluate('(()=>{const d=document.querySelector("#assignmentDialog");if(!d.open)return true;const r=d.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&d.scrollWidth<=d.clientWidth+1;})()'),'assignment overview fits the phone viewport');
    await evaluate('if(document.querySelector("#assignmentDialog").open){document.querySelector(".assignment").click();document.querySelector("#closeAssignment").click();}document.querySelector(".canvas-viewport").scrollIntoView({block:"center"})');
    await evaluate('document.querySelector("#closeTestDrawer").click();document.querySelector(".canvas-viewport").scrollIntoView({block:"center"})');
    await delay(300);
    assert.ok(await evaluate('document.documentElement.scrollWidth<=document.documentElement.clientWidth+1'),'game page stays within the phone width');
  };
  await visit('approval-basics');
  const positions=()=>evaluate('[...document.querySelectorAll(".node")].map(n=>({id:n.dataset.node,x:n.style.left,y:n.style.top}))');
  const beforeNodes=await positions();
  const geometry=await evaluate('(()=>{const v=document.querySelector(".canvas-viewport").getBoundingClientRect();for(const node of document.querySelectorAll(".node")){const n=node.getBoundingClientRect(),x=n.left+n.width/2,y=n.top+n.height/2;if(x>v.left&&x<v.right-80&&y>v.top&&y<v.bottom&&document.elementFromPoint(x,y)?.closest(".node")===node)return {x,y,right:v.right};}throw new Error("No unobscured block");})()');
  let first={x:geometry.x,y:geometry.y,id:1};
  const second={x:Math.min(geometry.right-10,geometry.x+65),y:geometry.y,id:2};
  await touch('touchStart',[first]);
  first={...first,x:first.x+5};
  await touch('touchMove',[first]);
  await touch('touchStart',[first,second]);
  const cx=(first.x+second.x)/2,cy=first.y;
  const anchor=()=>evaluate(`(()=>{const r=document.querySelector('#canvas').getBoundingClientRect(),m=new DOMMatrix(getComputedStyle(document.querySelector('#canvas')).transform);return {x:(${cx}-r.left)/m.a,y:(${cy}-r.top)/m.a};})()`);
  const beforeAnchor=await anchor();
  for(let step=1;step<=5;step++)await touch('touchMove',[{...first,x:first.x-step*5},{...second,x:second.x+step*5}]);
  const afterAnchor=await anchor();
  assert.ok(await evaluate('Number(document.querySelector(".canvas-viewport").dataset.canvasZoom)>1.5'),'pinch enlarges the canvas');
  assert.ok(Math.abs(beforeAnchor.x-afterAnchor.x)<2,'pinch keeps the horizontal midpoint anchored');
  await touch('touchEnd',[]);await delay(40);
  assert.deepEqual(await positions(),beforeNodes,'pinch starting on a block never moves the block');
  assert.equal(await evaluate('document.querySelector("#blockDrawer").classList.contains("open")'),false,'pinch never opens the editor');
  const beforePan=await evaluate('new DOMMatrix(getComputedStyle(document.querySelector("#canvas")).transform).e');
  const pan=await evaluate('(()=>{const r=document.querySelector(".canvas-viewport").getBoundingClientRect();return {x:r.left+r.width/2,y:r.bottom-45,id:3};})()');
  await touch('touchStart',[pan]);
  await touch('touchMove',[{...pan,x:pan.x-25,y:pan.y-15}]);await touch('touchEnd',[]);
  assert.ok(await evaluate('new DOMMatrix(getComputedStyle(document.querySelector("#canvas")).transform).e')<beforePan-10,'one finger pans the zoomed canvas');
  assert.deepEqual(await positions(),beforeNodes,'panning never changes saved block positions');
  await visit('order-basics');
  const target=await evaluate('(()=>{for(const node of document.querySelectorAll(".node")){const r=node.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;if(document.elementFromPoint(x,y)?.closest(".node")===node)return {x,y,id:8};}throw new Error("No unobscured block");})()');
  await touch('touchStart',[target]);await touch('touchEnd',[]);await delay(50);
  assert.equal(await evaluate('document.querySelector("#blockDrawer").classList.contains("open")'),true,'tapping a fixed block still opens its editor');
  assert.deepEqual(errors,[]);
  console.log('PASS: real touch pinch, anchored zoom, block-drag cancellation, one-finger pan, unchanged graph, fixed-block tap');
}finally{if(socket)socket.close();browser.kill();server.close();}

