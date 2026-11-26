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
  await call('Page.navigate',{url});
  await waitFor('Boolean(document.querySelector("#newStory"))&&!document.documentElement.classList.contains("booting")');
  await evaluate('document.querySelector("#newStory").click()');
  await waitFor('document.querySelector("#storyDialog")?.open');
  assert.ok(await evaluate('Boolean(document.querySelector("#storyAdvance svg path"))'));
  assert.equal(await evaluate('document.querySelector("#storyAdvance").textContent.trim()'),'');
  await evaluate('document.querySelector(".story-window").click()');
  assert.equal(await evaluate('document.querySelector("#storyText").classList.contains("is-typing")'),false,'window tap completes typing');
  assert.equal(await evaluate('document.querySelector("#storyPage").textContent'),'1 / 5');
  await evaluate('document.querySelector(".story-message").click()');
  assert.equal(await evaluate('document.querySelector("#storyPage").textContent'),'2 / 5','window tap advances the conversation');
  assert.ok(await evaluate('document.querySelector("#storyPortrait").getAnimations().some(a=>a.effect.getKeyframes().some(frame=>Number(frame.opacity)===0))'),'a newly appearing speaker fades in');
  await evaluate('document.querySelector("#storyAdvance").click()');
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate('document.querySelector("#storyAdvance").click()');
  assert.ok(await evaluate('[...document.querySelectorAll(".story-portrait")].some(p=>p.getAnimations().some(a=>a.effect.getKeyframes().some(frame=>frame.transform)))'),'speaker changes animate the cast across the stage');
  await delay(500);
  await evaluate('if(document.querySelector("#storyText").classList.contains("is-typing"))document.querySelector("#storyAdvance").click()');
  for(const [width,height] of [[320,568],[375,667],[390,844],[667,375]]){
    await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});
    assert.equal(await evaluate('getComputedStyle(document.querySelector("#storyText")).fontSize'),'14px');
    assert.equal(await evaluate('getComputedStyle(document.querySelector("#storyAdvance")).animationName'),'story-next-blink');
    assert.equal(await evaluate('getComputedStyle(document.querySelector("#storyAdvance")).borderRadius'),'50%','next button is circular');
    let lastHeight=0,castTop;
    for(const lines of [1,2,3]){
      const layout=await evaluate(`(()=>{const text=document.querySelector('#storyText');text.textContent=Array(${lines}).fill('位置確認').join('\\n');text.style.height='auto';const r=document.querySelector('.story-window').getBoundingClientRect(),image=document.querySelector('#storyPortrait').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,height:r.height,castTop:image.top,baseline:document.querySelector('#storyCast').getBoundingClientRect().bottom};})()`);
      assert.equal(layout.left,0);assert.equal(layout.right,width);assert.equal(layout.bottom,height);
      assert.ok(layout.height>lastHeight,'window grows upward with the line count');
      if(lines===1){castTop=layout.castTop;assert.ok(Math.abs(layout.top-layout.baseline)<1,'cast rests above a one-line message');}
      assert.ok(Math.abs(castTop-layout.castTop)<1,'cast remains at the same height');lastHeight=layout.height;
    }
    await evaluate('(()=>{const cast=document.querySelector("#storyCast");while(cast.children.length<5){const clone=cast.firstElementChild.cloneNode(true);clone.removeAttribute("id");clone.classList.remove("speaking");clone.dataset.testClone="1";cast.append(clone);}})()');
    assert.ok(await evaluate('(()=>{const cast=document.querySelector("#storyCast"),bounds=cast.getBoundingClientRect(),speaker=cast.querySelector(".speaking").getBoundingClientRect();return getComputedStyle(cast).overflowX==="hidden"&&Math.abs(speaker.left+speaker.width/2-bounds.left-bounds.width/2)<1&&speaker.left>=0&&speaker.right<=innerWidth&&[...cast.querySelectorAll(":not(.speaking)")].every(img=>img.getBoundingClientRect().width<speaker.width);})()'),'speaker is large and centered, with supporting portraits clipped to the stage');
    assert.ok(await evaluate('document.querySelector("#storyDialog").scrollWidth<=document.querySelector("#storyDialog").clientWidth'));
    await evaluate('document.querySelectorAll("[data-test-clone]").forEach(el=>el.remove())');
  }
  await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  assert.equal(await evaluate('getComputedStyle(document.querySelector("#storyAdvance")).animationName'),'none');
  await evaluate('document.querySelector("#storySkip").click()');
  assert.equal(await evaluate('document.querySelector("#storyDialog").open'),false,'skip closes the conversation');
  await call('Emulation.setDeviceMetricsOverride',{width:1500,height:1000,deviceScaleFactor:1,mobile:false});
  await evaluate('document.querySelector("#readStory").click()');
  await waitFor('document.querySelector("#storyDialog")?.open');
  assert.equal(await evaluate('getComputedStyle(document.querySelector("#storyText")).fontSize'),'22px');
  assert.equal(await evaluate('[...document.querySelectorAll(".story-portrait")].some(p=>p.getAnimations().some(a=>a.effect.getKeyframes().some(frame=>frame.opacity!==undefined)))'),false,'reduced motion skips entrance fades');
  assert.deepEqual(errors,[]);
  console.log('PASS: tap to finish/advance, circular blinking arrow, centered larger speaker, stage animation, variable message height, full-width mobile at four sizes, five participants, reduced motion, replay');
}finally{if(socket)socket.close();browser.kill();server.close();}
