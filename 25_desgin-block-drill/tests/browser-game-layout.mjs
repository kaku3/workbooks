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
  const visit=async()=>{
    await call('Page.navigate',{url:url+'?drill=order-system'});
    await waitFor('!document.documentElement.classList.contains("booting")&&Boolean(document.querySelector(".node"))');
    await evaluate('if(document.querySelector("#assignmentDialog").open){document.querySelector(".assignment").click();document.querySelector("#closeAssignment").click()}');
    await delay(300);
  };
  const fits=selector=>evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),r=e.getBoundingClientRect();return r.left>=0&&r.right<=document.documentElement.clientWidth+1&&r.top>=0&&r.bottom<=innerHeight+1;})()`);
  const screenshot=async name=>{const shot=await call('Page.captureScreenshot',{format:'png'});await (await import('node:fs/promises')).writeFile(path.join(tmpdir(),name+'.png'),Buffer.from(shot.data,'base64'));};
  for(const [width,height] of [[320,568],[390,844],[667,375],[1024,600],[1440,900]]){
    await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<=800});await visit();
    if(width<=800)assert.ok(await evaluate('document.querySelector("#testDrawer").classList.contains("minimized")'),'mobile starts with the test panel minimized');
    if(width===390)await screenshot('design-block-game-mobile');
    for(const size of ['fit','max','min']){
      await evaluate(`document.querySelector('#drawerSizes [data-size=${size}]').click()`);await delay(50);
      assert.ok(await fits('#testDrawer'),`right panel fits: ${width}x${height}, ${size}`);
      if(width<=800)assert.ok(await evaluate('Math.abs(document.querySelector("#testDrawer").getBoundingClientRect().bottom-(innerHeight-12))<1'),'mobile panels stay docked inside the bottom edge');
      if(width===390&&size==='fit')await screenshot('design-block-test-panel-mobile');
    }
    const beforeEditor=await evaluate('(()=>{const c=document.querySelector(".canvas-viewport").getBoundingClientRect(),t=document.querySelector(".toolbar").getBoundingClientRect();return {left:c.left,width:c.width,controls:t.left};})()');
    await evaluate('document.querySelector(".node-action").click()');await delay(300);
    await waitFor('(()=>{const r=document.querySelector("#blockDrawer").getBoundingClientRect();return r.left>=0&&r.right<=document.documentElement.clientWidth+1&&r.top>=0&&r.bottom<=innerHeight+1;})()');
    const afterEditor=await evaluate('(()=>{const c=document.querySelector(".canvas-viewport").getBoundingClientRect(),t=document.querySelector(".toolbar").getBoundingClientRect();return {left:c.left,width:c.width,controls:t.left};})()');
    assert.deepEqual(afterEditor,beforeEditor,'opening a panel never shifts or shrinks the canvas or left controls');
    assert.ok(await evaluate('document.querySelector("#testDrawer").parentElement.classList.contains("game-overlays")&&document.querySelector("#blockDrawer").parentElement.classList.contains("game-overlays")'),'panels use an independent overlay layer');
    if(width<=800){
      assert.ok(await fits('#blockDrawer'),'block editor fits the viewport');
      assert.equal(await evaluate('document.querySelector("#testDrawer").classList.contains("open")'),false,'mobile panels do not overlap');
      assert.ok(await evaluate('(()=>{const d=document.querySelector("#blockDrawer"),r=d.getBoundingClientRect();return Boolean(document.elementFromPoint(r.left+r.width/2,r.top+20)?.closest("#blockDrawer"));})()'),'block editor is visible rather than clipped by the canvas');
      if(width===390)await screenshot('design-block-editor-mobile');
    }
    await evaluate('document.querySelector("#closeBlockDrawer").click()');
    await evaluate('document.querySelector(".canvas-navigation [aria-label=キャンバスを拡大]").click()');
    assert.ok(await evaluate('Number(document.querySelector(".canvas-viewport").dataset.canvasZoom)>1'),'zoom button works');
    await evaluate('document.querySelector(".canvas-navigation [aria-label=キャンバスを全体表示]").click()');
    assert.equal(await evaluate('Number(document.querySelector(".canvas-viewport").dataset.canvasZoom)'),1);
  }
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await visit();
  await evaluate('document.querySelector("#closeTestDrawer").click();const v=document.querySelector(".canvas-viewport");window.scrollTo(0,window.scrollY+v.getBoundingClientRect().top-180)');
  for(const [name,expected] of [['キャンバスを拡大',true],['キャンバスを全体表示',false]]){
    const button=await evaluate(`(()=>{const r=document.querySelector('.canvas-navigation [aria-label="${name}"]').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,id:20};})()`);
    await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[button]});await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    assert.equal(await evaluate('Number(document.querySelector(".canvas-viewport").dataset.canvasZoom)>1'),expected,'zoom buttons respond to physical taps');
  }
  const point=await evaluate('(()=>{const r=document.querySelector(".canvas-viewport").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+280,id:11};})()');
  const beforeTouch=await evaluate('scrollY');
  await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
  for(const dy of [20,40,80])await call('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...point,y:point.y-dy}]});
  await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.ok(await evaluate('scrollY')>beforeTouch+20,'vertical swipe on the fitted canvas scrolls the page');
  await evaluate(`window.scrollTo(0,${beforeTouch})`);
  await call('Input.dispatchMouseEvent',{type:'mouseWheel',x:point.x,y:point.y,deltaX:0,deltaY:150});await delay(100);
  assert.ok(await evaluate('scrollY')>beforeTouch+20,'ordinary mouse wheel scrolls the page');
  await evaluate(`window.scrollTo(0,${beforeTouch})`);
  await call('Input.dispatchMouseEvent',{type:'mouseWheel',x:point.x,y:point.y,deltaX:0,deltaY:-100,modifiers:2});await delay(50);
  assert.ok(await evaluate('Number(document.querySelector(".canvas-viewport").dataset.canvasZoom)>1'),'Ctrl+wheel zooms the canvas');
  const dragPoint=await evaluate('(()=>{const r=document.querySelector(".canvas-viewport").getBoundingClientRect();for(let y=r.bottom-60;y>r.top+50;y-=35)for(let x=r.left+70;x<r.right-50;x+=35){const e=document.elementFromPoint(x,y);if(e?.closest(".canvas-viewport")&&!e.closest(".node,.token,.canvas-navigation,button"))return {x,y};}throw new Error("No empty canvas point");})()');
  const beforePan=await evaluate('new DOMMatrix(getComputedStyle(document.querySelector("#canvas")).transform).e');
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',...dragPoint});
  await call('Input.dispatchMouseEvent',{type:'mousePressed',...dragPoint,button:'left',clickCount:1});
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:dragPoint.x-25,y:dragPoint.y,buttons:1});
  await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:dragPoint.x-25,y:dragPoint.y,button:'left',clickCount:1});
  assert.ok(await evaluate('new DOMMatrix(getComputedStyle(document.querySelector("#canvas")).transform).e')<beforePan-10,'mouse drag pans the canvas');
  if(await evaluate('Boolean(document.querySelector("#plicyGameRoot"))')){
    await evaluate('document.querySelector("#backToTitle").click()');
    await waitFor('!document.documentElement.classList.contains("booting")&&!document.querySelector("#titleScreen").hidden');
    await evaluate('document.querySelector("#newStory").click()');
    await waitFor('document.querySelector("#storyDialog")?.open');
    assert.ok(await evaluate('document.querySelectorAll(".game-overlays").length===1&&document.querySelectorAll("#testDrawer").length===1&&document.querySelectorAll("#blockDrawer").length===1&&document.querySelector("#plicyGameRoot").contains(document.querySelector(".game-overlays"))'),'overlay panels stay scoped to the game through distribution navigation');
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: panel fit at five sizes, visible mobile editor, zoom buttons, touch page scroll, wheel page scroll, Ctrl+wheel zoom, mouse pan');
}finally{if(socket)socket.close();browser.kill();server.close();}
