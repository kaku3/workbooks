// 外部パッケージ不要。Windows上のEdgeをheadlessで使用します。
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdtemp, writeFile } from 'node:fs/promises';
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
  const runBatch = async (grade = 'Excellent') => {
    await evaluate('document.querySelector("#speed").value="220"; document.querySelector("#speed").dispatchEvent(new Event("change")); document.querySelector("#batch").click()');
    assert.equal(await evaluate('document.querySelector("main").classList.contains("cases-expanded")'), false);
    assert.equal(await evaluate('document.querySelector("#testDrawer").inert'), false);
    for (let i=0;i<600;i++) { if (await evaluate('document.querySelector("#batchResult").open')) break; await delay(100); }
    assert.equal(await evaluate('document.querySelector("#batchResult").open'), true);
    assert.equal(await evaluate('document.querySelector("#batchGrade").textContent'), grade);
    if (grade === 'Bad') { await delay(3200); assert.equal(await evaluate('document.querySelector("#batchResult").open'), false); } else await evaluate('document.querySelector("#batchResult").close()');
  };


  await call('Page.navigate', {url: `${url}?drill=approval-system`});
  for(let i=0;i<50;i++){if(await evaluate('document.querySelectorAll(".case").length === 13')) break;await delay(100);}
  assert.equal(await evaluate('document.querySelector(".tests").getBoundingClientRect().bottom <= document.querySelector(".canvas-stage").getBoundingClientRect().top'),true);
  assert.equal(await evaluate('document.querySelector("#cases").scrollWidth > document.querySelector("#cases").clientWidth'),true);
  assert.equal(await evaluate('new Set([...document.querySelectorAll(".case")].map(c=>Math.round(c.getBoundingClientRect().top))).size'),1);
  assert.equal(await evaluate('document.querySelector("#assignmentDialog").open'), true);
  await evaluate('document.querySelector("#closeAssignment").click(); document.querySelector("#showAssignment").click()');
  assert.equal(await evaluate('document.querySelector("#assignmentDialog").open'), true);
  await evaluate('document.querySelector("#closeAssignment").click()');
  assert.equal(await evaluate('document.querySelector("#toggleCaseList")'), null);
  assert.equal(await evaluate('document.querySelector(".case").getAttribute("aria-pressed")'), 'true');
  assert.equal(await evaluate('document.querySelector("#closeTestDrawer").textContent'), '\u00d7');
  await evaluate('document.querySelectorAll(".case")[0].click(); document.querySelector("#closeTestDrawer").click()'); await delay(300);
  assert.equal(await evaluate('document.querySelector("#warehouse").hidden'), true);
  assert.equal(await evaluate('document.querySelector("#blockPalette").getBoundingClientRect().top >= document.querySelector(".canvas-viewport").getBoundingClientRect().bottom'), true);
  await evaluate('document.querySelector("[data-node=decision] button").click(); document.querySelector("[data-node=decision]").scrollIntoView({block:"center"})'); await delay(150);
  const drag = await evaluate('(() => {const n=document.querySelector("[data-node=decision]"),r=n.getBoundingClientRect(),c=document.querySelector(".canvas-viewport").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,target:c.right-130};})()');
  await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:drag.x,y:drag.y});
  await call('Input.dispatchMouseEvent', {type:'mousePressed',x:drag.x,y:drag.y,button:'left',buttons:1,clickCount:1});
  await call('Input.dispatchMouseEvent', {type:'mouseMoved',x:drag.target,y:drag.y,buttons:1});
  await call('Input.dispatchMouseEvent', {type:'mouseReleased',x:drag.target,y:drag.y,button:'left',buttons:0,clickCount:1});
  assert.ok(await evaluate('parseFloat(document.querySelector("[data-node=decision]").style.left)>690'), JSON.stringify({drag, left:await evaluate('document.querySelector("[data-node=decision]").style.left')}));
  const shot=await call('Page.captureScreenshot',{format:'png'});
  const screenshotPath=path.join(tmpdir(),'design-block-hud.png');await writeFile(screenshotPath,Buffer.from(shot.data,'base64'));console.log(screenshotPath);
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await delay(150);
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'),true);
  assert.equal(await evaluate('new Set([...document.querySelectorAll(".case")].map(c=>Math.round(c.getBoundingClientRect().top))).size'),1);
  assert.deepEqual(errors,[]);console.log('PASS: horizontal 13-case overflow, top placement, grid background and mobile page bounds');
} finally {
  if (socket) socket.close(); browser.kill(); server.close();
  // OS一時ディレクトリのプロファイルはブラウザ終了後の診断用に保持。
}
