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
  const waitFor=async expression=>{for(let i=0;i<600;i++){if(await evaluate(expression))return;await delay(50);}throw new Error(`Timeout: ${expression}; ${JSON.stringify(await evaluate("({url:location.href,drill:document.querySelector('#drillSelect')?.value,dialog:document.querySelector('#storyDialog')?.open,progress:localStorage.getItem('design-block-drill.story.v1')})"))}; ${errors.join(" | ")}`);};
  const storage=()=>evaluate('JSON.parse(localStorage.getItem("design-block-drill.story.v1"))');
  const showsClear=()=>evaluate("import('./story-data.mjs').then(({scenes})=>document.querySelector('#storyDialog').open&&document.querySelector('#storyText').getAttribute('aria-label')===scenes['01-04.clear'][0].text.replace(/<br\\s*\\/?\\s*>/gi,'\\n').replaceAll('**',''))");
  await call('Page.navigate',{url});await waitFor('Boolean(document.querySelector("#newStory"))&&!document.documentElement.classList.contains("booting")');
  await evaluate("Promise.all([import('./data.mjs'),import('./drills.mjs')]).then(([{initialGraph},{drills}])=>{const drill=drills.find(d=>d.id==='order-system'),graph=structuredClone(initialGraph);graph.nodes=graph.nodes.filter(n=>drill.initialGraph.nodes.some(b=>b.id===n.id));graph.nodes.find(n=>n.id==='failed').success='END';localStorage.setItem('design-block-drill.v2.order-system',JSON.stringify(graph));localStorage.setItem('design-block-drill.story.v1',JSON.stringify({completedStages:['01-01','01-02','01-03'],seenEvents:[],currentStage:'01-04',pendingClear:null,started:true}));})");
  await call('Page.navigate',{url:url+'?mode=story&drill=order-system'});await waitFor('document.querySelector("#storyDialog")?.open');
  await evaluate('document.querySelector("#storySkip").click();const speed=document.querySelector("#speed button:last-child");speed.dataset.speed="1";speed.click();document.querySelector("#batch").click()');
  await waitFor('document.querySelector("#batchResult").open');
  assert.equal(await evaluate('document.querySelector("#batchGrade").textContent'),'Excellent');
  assert.equal((await storage()).pendingClear,'01-04','first chapter clear remains pending after all cases pass');
  await evaluate('document.querySelector("#batchResult").close()');await waitFor('document.querySelector("#storyDialog").open');
  assert.equal(await showsClear(),true,'first chapter clear dialogue plays after successful batch');
  await call('Page.reload');await waitFor('document.querySelector("#storyDialog")?.open');
  assert.equal(await showsClear(),true,'reload resumes the pending clear instead of replaying the intro');
  await evaluate('document.querySelector("#storySkip").click()');
  await waitFor('new URL(location.href).searchParams.get("drill")==="approval-basics"&&document.querySelector("#storyDialog")?.open');
  assert.equal((await storage()).pendingClear,null);
  assert.ok((await storage()).seenEvents.some(id=>id.startsWith('01-04.clear.v')));
  assert.deepEqual(errors,[]);
  console.log('PASS: first chapter all-case success, clear dialogue, reload resume, and transition to chapter two');
}finally{if(socket)socket.close();browser.kill();server.close();}