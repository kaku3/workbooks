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
  const runBatch = async (grade = 'Excellent') => {
    await evaluate('document.querySelector("#speed").value="220"; document.querySelector("#speed").dispatchEvent(new Event("change")); document.querySelector("#batch").click()');
    assert.equal(await evaluate('document.querySelector("main").classList.contains("cases-expanded")'), false);
    assert.equal(await evaluate('document.querySelector("#testDrawer").inert'), false);
    for (let i=0;i<600;i++) { if (await evaluate('document.querySelector("#batchResult").open')) break; await delay(100); }
    assert.equal(await evaluate('document.querySelector("#batchResult").open'), true);
    assert.equal(await evaluate('document.querySelector("#batchGrade").textContent'), grade);
    if (grade === 'Bad') { await delay(3200); assert.equal(await evaluate('document.querySelector("#batchResult").open'), false); } else await evaluate('document.querySelector("#batchResult").close()');
  };


  const waitFor = async expression => { for(let i=0;i<100;i++){ if(await evaluate(expression)) return; await delay(100); } throw new Error(`Timeout: ${expression}`); };
  const visit = async query => { await call('Page.navigate', { url: `${url}${query}` }); await waitFor('document.querySelector("#drillSelect")?.options.length > 0'); };
  const storage = () => evaluate('JSON.parse(localStorage.getItem("design-block-drill.story.v1"))');
  await visit('');
  assert.equal(await evaluate('document.querySelector("#titleScreen").hidden'), false);
  assert.equal(await evaluate('document.querySelector("main").hidden'), true);
  assert.equal(await evaluate('document.querySelectorAll(".chapter-card")[1].querySelectorAll("a").length'), 0);
  await evaluate('document.querySelector("#newStory").click()');
  await waitFor('document.querySelector("#storyDialog")?.open');
  assert.match(await evaluate('location.search'), /mode=story/);
  assert.equal(await evaluate('document.querySelector("#storyText").classList.contains("is-typing")'), true);
  await evaluate('document.querySelector("#storyAdvance").click()');
  assert.equal(await evaluate('document.querySelector("#storyText").classList.contains("is-typing")'), false);
  assert.equal(await evaluate('document.querySelector("#storyPage").textContent'), '1 / 5');

  assert.equal(await evaluate('document.querySelector("#drillSelect").value'), 'order-basics');
  assert.equal(await evaluate('document.body.classList.contains("fixed-blocks")'), true);
  await evaluate('document.querySelector("#storySkip").click()');
  assert.ok((await storage()).seenEvents.includes('01-01.intro.v1'));
  const route = async (id, target) => {
    await evaluate(`document.querySelector('[data-node=${id}] button').click(); document.querySelector('[data-route=success] .route-current button').click(); document.querySelector('[data-route=success] [data-target=${target}]').click()`);
  };
  await route('stock', 'payment');
  await evaluate('document.querySelector("[data-route=failure] .route-current button").click(); document.querySelector("[data-route=failure] [data-target=shortage]").click()');
  await runBatch();
  await waitFor('document.querySelector("#drillSelect")?.value === "cancel-consistency" && document.querySelector("#storyDialog").open');
  await evaluate('document.querySelector("#storySkip").click()');
  await visit('');
  assert.equal(await evaluate('document.querySelector("#continueStory").hidden'), false);
  await evaluate('document.querySelector("#continueStory").click()');
  await waitFor('document.querySelector("#drillSelect")?.value === "cancel-consistency" && document.querySelector("#storyDialog").open');
  await evaluate('document.querySelector("#storySkip").click()');
  await visit('');

  await evaluate('document.querySelector("#newStory").click()');
  await waitFor('document.querySelector("#drillSelect")?.value === "order-basics" && document.querySelector("#storyDialog").open');
  assert.ok((await storage()).completedStages.includes('01-01'));
  await evaluate('document.querySelector("#storySkip").click()');
  const beforePractice = (await storage()).completedStages;
  await visit('?drill=approval-basics');
  assert.equal(await evaluate('document.body.classList.contains("fixed-blocks")'), false);
  assert.equal(await evaluate('document.querySelectorAll("#nodes .node").length'), 4);
  await evaluate('document.querySelector(".palette-block").click()');
  assert.equal(await evaluate('document.querySelectorAll("#nodes .node").length'), 5);
  await route('decision', 'approved'); await route('approved', 'receipt');
  await evaluate('document.querySelector("[data-node=receipt] button").click(); document.querySelector("#openAddOperation").click(); document.querySelector("[data-operation=verifyReceipt]").click()');
  await runBatch();
  assert.deepEqual((await storage()).completedStages, beforePractice);
  assert.equal(await evaluate('document.querySelectorAll("#state table").length'), 1);
  await call('Page.reload'); await waitFor('document.querySelectorAll("#nodes .node").length === 5');
  await evaluate('document.querySelector("[data-node=approved] button").click(); document.querySelector(".return-block").click()');
  assert.equal(await evaluate('document.querySelectorAll("#nodes .node").length'), 4);
  assert.equal(await evaluate('document.querySelectorAll(".palette-block").length'), 1);
  await route('decision', 'END');
  await visit('?mode=story&drill=approval-system');
  assert.equal(await evaluate('document.querySelector("#drillSelect").value'), 'order-basics');
  await evaluate('document.querySelector("#storySkip").click()');
  await evaluate('const p = JSON.parse(localStorage.getItem("design-block-drill.story.v1")); p.completedStages = ["01-01","01-02","01-03","01-04"]; p.currentStage="02-01"; p.pendingClear=null; localStorage.setItem("design-block-drill.story.v1",JSON.stringify(p))');
  await visit('?mode=story&drill=approval-basics');
  await waitFor('document.querySelector("#storyDialog").open');
  await evaluate('document.querySelector("#storySkip").click()');
  await waitFor('document.querySelector("#storyDialog").open');
  await evaluate('document.querySelector("#storySkip").click()');
  assert.ok((await storage()).seenEvents.includes('palette.v1'));
  assert.equal(await evaluate('document.querySelector("#blockPalette").hidden'), false);
  await call('Page.reload'); await delay(400);
  assert.equal(await evaluate('document.querySelector("#storyDialog").open'), true);
  await evaluate('document.querySelector("#storySkip").click()');
  await evaluate('const end = JSON.parse(localStorage.getItem("design-block-drill.story.v1")); end.completedStages = ["01-01","01-02","01-03","01-04","02-01","02-02","02-03","02-04"]; end.currentStage="02-04"; end.pendingClear="02-04"; localStorage.setItem("design-block-drill.story.v1",JSON.stringify(end))');
  await visit('?mode=story&drill=approval-system');
  await waitFor('document.querySelector("#storyDialog").open');
  assert.equal(await evaluate('document.querySelector("#storyPage").textContent'), '1 / 3');
  await evaluate('document.querySelector("#storySkip").click()');
  await waitFor('document.querySelector("#titleScreen")?.hidden === false');
  assert.equal((await storage()).pendingClear, null);
  await call('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:true});
  await visit(''); await delay(100);
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
  assert.deepEqual(errors, []);
  console.log('PASS: title, chapter locks, intro/skip, complete/next, restart preserves progress, approval palette/repair, persistence, return-to-palette, practice isolation, locked story URL and mobile title');
} finally {
  if (socket) socket.close(); browser.kill(); server.close();
  // OS一時ディレクトリのプロファイルはブラウザ終了後の診断用に保持。
}
