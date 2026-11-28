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
  socket.onmessage = ({ data }) => { const msg = JSON.parse(data); if (msg.id) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result); } else if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text); };
  const call = (method, params = {}) => new Promise((resolve, reject) => { const seq = ++id; pending.set(seq, { resolve, reject }); socket.send(JSON.stringify({ id: seq, method, params })); });
  const evaluate = async expression => { const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails)); return result.result.value; };
  await call('Runtime.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: 1500, height: 1000, deviceScaleFactor: 1, mobile: false });
  const url = `http://127.0.0.1:${server.address().port}/`;
  const waitFor=async expression=>{for(let i=0;i<600;i++){if(await evaluate(expression))return;await delay(50);}throw new Error(`Timeout: ${expression}; ${errors.join(' | ')}`);};
  const ready=()=>evaluate('document.querySelector("#batch").classList.contains("batch-ready")');
  const batch=async()=>{
    await evaluate('document.querySelector("#batch").click()');
    assert.equal(await ready(),false,'batch start clears the reminder');
    await waitFor('document.querySelector("#batchResult").open');
    const grade=await evaluate('document.querySelector("#batchGrade").textContent');
    assert.equal(await ready(),false,'completed batch never prompts another batch without an individual run');
    await evaluate('document.querySelector("#batchResult").close()');return grade;
  };
  const route=async target=>{
    await evaluate(`document.querySelector('[data-node=stock] button').click();document.querySelector('[data-route=success] .route-current button').click();document.querySelector('[data-route=success] [data-target=${target}]').click();document.querySelector('#closeBlockDrawer').click()`);
  };
  const playFail=async id=>{
    await evaluate(`(()=>{const card=[...document.querySelectorAll('#cases>.case')].find(b=>b.querySelector('small').firstChild.textContent===${JSON.stringify(id)});if(card.hidden||card.dataset.result!=='fail')throw new Error('Expected a visible failing case');card.click();document.querySelector('#play').click();})()`);
    await waitFor(`(()=>{const card=[...document.querySelectorAll('#cases>.case')].find(b=>b.querySelector('small').firstChild.textContent===${JSON.stringify(id)});return card.dataset.result==='pass';})()`);
  };
  await call('Page.navigate',{url});await waitFor('Boolean(document.querySelector("#newStory"))&&!document.documentElement.classList.contains("booting")');
  await evaluate("import('./data.mjs').then(({initialGraph})=>{const graph=structuredClone(initialGraph);graph.nodes.find(n=>n.id==='failed').success='END';graph.nodes.find(n=>n.id==='stock').success='shipping';localStorage.setItem('design-block-drill.v2.order-system',JSON.stringify(graph));})");
  await call('Page.navigate',{url:url+'?drill=order-system'});await waitFor('!document.documentElement.classList.contains("booting")&&Boolean(document.querySelector(".node"))');
  await evaluate('if(document.querySelector("#assignmentDialog").open){document.querySelector(".assignment").click();document.querySelector("#closeAssignment").click()}const speed=document.querySelector("#speed button:last-child");speed.dataset.speed="1";speed.click()');
  for(let cycle=0;cycle<2;cycle++){
    if(cycle)await route('shipping');
    assert.equal(await batch(),'Try Again');
    await evaluate('document.querySelector("#caseFilters [data-filter=fail]").click()');
    assert.equal(await evaluate('[...document.querySelectorAll("#cases>.case")].filter(b=>!b.hidden).length'),2,'mixed batch has only two failing cases');
    await route('payment');
    await playFail('TC-01');assert.equal(await ready(),false,'one remaining Fail keeps the reminder off');
    await playFail('TC-06');assert.equal(await ready(),true,'last Fail fixed with Play lights the batch button, including after an earlier glow');
    assert.equal(await evaluate('document.querySelector("#caseFilters [data-filter=fail]").getAttribute("aria-pressed")'),'true');
    assert.equal(await evaluate('[...document.querySelectorAll("#cases>.case")].filter(b=>!b.hidden).length'),0,'Fail filter is empty when all results are Pass');
    assert.equal(await batch(),'Excellent');
    await evaluate('document.querySelector("#pause").click()');assert.equal(await ready(),false,'rerendering the completed result does not relight the reminder');
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: mixed batch results, Fail filtering, final fix with Play, reminder reset, and repeat activation');
}finally{if(socket)socket.close();browser.kill();server.close();}