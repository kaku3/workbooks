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
  for(const width of [320,375,390,801,1440]){
    await call('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:width<=800});
    await call('Page.navigate',{url:url+'?drill=order-system'});
    await waitFor('!document.documentElement.classList.contains("booting")&&Boolean(document.querySelector(".case"))');
    await evaluate('if(document.querySelector("#assignmentDialog").open){document.querySelector(".assignment").click();document.querySelector("#closeAssignment").click()}');
    await evaluate('for(let i=0;i<100&&document.querySelector("#caseFilters").hidden;i++)document.querySelector("#step").click()');
    assert.equal(await evaluate('document.querySelector("#caseFilters").hidden'),false,'filters appear after a real result');
    const layout=await evaluate('(()=>{const batch=document.querySelector("#batch").getBoundingClientRect(),cases=document.querySelector("#cases"),r=cases.getBoundingClientRect(),filters=[...document.querySelectorAll("#caseFilters button")].map(e=>e.getBoundingClientRect());return {batchRight:batch.right,casesLeft:r.left,overlapY:Math.min(batch.bottom,r.bottom)-Math.max(batch.top,r.top),filterTops:filters.map(r=>r.top),height:document.querySelector(".tests.panel").getBoundingClientRect().height,page:document.documentElement.scrollWidth,client:document.documentElement.clientWidth};})()');
    assert.ok(layout.batchRight<=layout.casesLeft&&layout.overlapY>0,'batch button sits alongside the case track');
    assert.ok(layout.filterTops.every(y=>Math.abs(y-layout.filterTops[0])<1),'filters stay on one horizontal line');
    assert.ok(layout.page<=layout.client+1,'test strip does not widen the page');
    assert.ok(layout.height<100,'test strip remains compact');
    await evaluate('document.querySelector("#cases").scrollLeft=100');await delay(60);
    assert.ok(await evaluate('document.querySelector("#cases").classList.contains("is-scrolling")'),'scrolling reveals the scrollbar');
    assert.ok(await evaluate('(()=>{const s=document.querySelector("#cases"),r=s.getBoundingClientRect();return [...s.querySelectorAll(".case:not([hidden])")].every(c=>c.getBoundingClientRect().bottom<=r.top+s.clientTop+s.clientHeight-2);})()'),'scrollbar never covers the bottom of a case');
    assert.equal(await evaluate('document.querySelector(".tests.panel").getBoundingClientRect().height'),layout.height,'showing the scrollbar does not change strip height');
    await delay(700);
    assert.equal(await evaluate('document.querySelector("#cases").classList.contains("is-scrolling")'),false,'scrollbar hides after scrolling stops');
    if(width===390){const shot=await call('Page.captureScreenshot',{format:'png'});await (await import('node:fs/promises')).writeFile(path.join(tmpdir(),'design-block-test-strip.png'),Buffer.from(shot.data,'base64'));}
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: five widths, horizontal batch/cases and filters, case bottoms visible, scrollbar shows only while scrolling, stable compact height');
}finally{if(socket)socket.close();browser.kill();server.close();}
