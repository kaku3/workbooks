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
  for(const [width,height] of [[280,568],[320,568],[375,667],[390,844],[667,375],[812,375]]){
    await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    for(const drill of ['order-basics','approval-system','security-system']){
      await call('Page.navigate',{url:url+'?drill='+drill});
      await waitFor('Boolean(document.querySelector("#assignmentDialog"))&&!document.documentElement.classList.contains("booting")');
      await evaluate('if(!document.querySelector("#assignmentDialog").open)document.querySelector("#showAssignment").click()');
      for(const phase of ['typing','full']){
        if(phase==='full')await evaluate('document.querySelector(".assignment").click()');
        const layout=await evaluate('(()=>{const d=document.querySelector("#assignmentDialog"),r=d.getBoundingClientRect(),body=d.querySelector(".assignment");return {viewport:document.documentElement.clientWidth,page:document.documentElement.scrollWidth,left:r.left,right:r.right,top:r.top,bottom:r.bottom,contentWidth:d.clientWidth,scroll:d.scrollWidth,bodyWidth:body.clientWidth,bodyScroll:body.scrollWidth};})()');
        assert.equal(layout.viewport,width,'background content must not widen the viewport');
        assert.ok(layout.page<=width+1,`page overflow: ${drill}, ${width}px, ${phase}`);
        assert.ok(layout.left>=0&&layout.right<=width&&layout.top>=0&&layout.bottom<=height,'overview stays inside the screen');
        assert.ok(layout.scroll<=layout.contentWidth+1&&layout.bodyScroll<=layout.bodyWidth+1,`overview never scrolls horizontally: ${drill}, ${width}px, ${phase}`);
      }
      assert.ok(await evaluate('(()=>{const body=document.querySelector("#assignmentDialog .assignment");body.scrollTop=body.scrollHeight;const button=document.querySelector("#closeAssignment").getBoundingClientRect(),frame=body.getBoundingClientRect();return button.top>=frame.top&&button.bottom<=frame.bottom+1;})()'),'the close button is reachable by vertical scrolling');
      await evaluate('document.querySelector("#closeAssignment").click();document.querySelector("#showAssignment").click()');
      assert.equal(await evaluate('document.querySelector("#assignmentDialog .assignment").scrollTop'),0,'reopening starts at the top');
      if(width===390&&drill==='security-system'){
        await evaluate('document.querySelector(".assignment").click()');
        const shot=await call('Page.captureScreenshot',{format:'png'});
        await (await import('node:fs/promises')).writeFile(path.join(tmpdir(),'design-block-assignment.png'),Buffer.from(shot.data,'base64'));
      }
    }
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: overview width, typing/full text, vertical scrolling and reachable close button across 6 sizes and 3 chapters');
}finally{if(socket)socket.close();browser.kill();server.close();}
