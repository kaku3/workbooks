// npm install --no-save puppeteer が利用できる環境で node tests/browser-smoke.cjs
// 必要に応じて CHROME_PATH で Chrome / Edge の実行ファイルを指定する。
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer');
const root = process.env.DRILL_ROOT ? path.resolve(process.env.DRILL_ROOT) : path.resolve(__dirname, '../src');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/problems.json'), 'utf8'));
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, body) => {
    if (error) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' })[path.extname(file)] || 'application/octet-stream');
    res.end(body);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const base = `http://127.0.0.1:${server.address().port}/index.html`;
    const open = async id => {
      await page.goto(`${base}?drill=${id}`);
      await page.waitForSelector('.prompt-document-note');
    };
    await page.setViewport({ width: 1440, height: 1000 });
    for (const problem of data.problems) {
      await open(problem.id);
      assert.equal(await page.$eval('#promptInstruction', el => el.textContent), problem.prompt.requirements.replace('今回の図の対象：', '今回の図の対象'));
      assert.equal((await page.$$('.prompt-document-note')).length, 3);
      assert.equal((await page.$$('.prompt-document-title')).length, 0);
      assert.equal((await page.$$('[class*="prompt-document-scope"]')).length, 0);
    }
    await open('access-request');
    const snapshot = () => page.evaluate(() => ({
      right: document.querySelectorAll('.diagram-node').length,
      edges: document.querySelector('#connectionLayer').innerHTML,
      reveal: document.querySelector('.prompt-reveal-cost').textContent,
      notes: [...document.querySelectorAll('.prompt-document-note')].map(el => ({ id: el.dataset.documentId, left: el.style.left, top: el.style.top }))
    }));
    const before = await snapshot();
    assert.equal(await page.$eval('#promptInstruction', el => Math.abs(el.getBoundingClientRect().width - el.parentElement.getBoundingClientRect().width) < 2), true);
    assert.equal(await page.$eval('.prompt-scope-badge', el => el.textContent), '今回の図の対象');
    assert.equal(await page.$eval('.prompt-scope', el => el.getBoundingClientRect().top >= document.querySelector('.prompt-requirements').getBoundingClientRect().bottom), true);
    assert.equal(await page.$eval('#clearLinks', el => el.getBoundingClientRect().left > document.querySelector('#trashToggle').getBoundingClientRect().right), true);
    assert.equal(await page.$eval('.prompt-reveal-note', el => {
      const card = el.getBoundingClientRect(), trash = document.querySelector('#promptTrashToggle').getBoundingClientRect();
      return Math.abs((card.top + card.bottom) / 2 - (trash.top + trash.bottom) / 2) < 2;
    }), true);
    assert.equal(await page.$eval('#promptTrashToggle', el => el.querySelector('svg').outerHTML === document.querySelector('#trashToggle svg').outerHTML), true);
    assert.equal(await page.$eval('#promptTrashCount', el => el.hidden), true);
    assert.equal(await page.$eval('.prompt-reveal-label', el => el.textContent), '（他のメモも見る）');
    // Move a note, then remove/restore it through actual keyboard activation.
    const note = await page.$('.prompt-document-note');
    await page.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }), note);
    const rect = await note.boundingBox();
    await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2);
    await page.mouse.down();
    await page.mouse.move(rect.x + rect.width / 2, rect.y + rect.height / 2 + 420, { steps: 5 });
    await page.mouse.up();
    const moved = await snapshot();
    assert.notEqual(moved.notes[0].top, before.notes[0].top);
    await page.focus('.prompt-note-remove');
    await page.keyboard.press('Enter');
    assert.equal((await page.$$('.prompt-document-note')).length, 2);
    assert.equal(await page.$eval('#promptTrashCount', el => !el.hidden && el.textContent === '1'), true);
    await page.click('#promptTrashToggle');
    assert.equal((await page.$$('#promptTrashPanel .trash-restore')).length, 1);
    await page.focus('#promptTrashPanel .trash-restore');
    await page.keyboard.press('Enter');
    const restored = await snapshot();
    assert.deepEqual(restored.notes.find(n => n.id === moved.notes[0].id), moved.notes[0]);
    assert.equal(restored.right, before.right);
    assert.equal(restored.edges, before.edges);
    assert.equal(restored.reveal, before.reveal);
    // Focus restoration scrolls the taller board into view; let that motion finish.
    await new Promise(resolve => setTimeout(resolve, 600));
    // Revealed notes retain their penalty after remove/restore; existing notes stay put.
    await page.click('.prompt-reveal-note');
    const revealed = await snapshot();
    for (const n of restored.notes) assert.deepEqual(revealed.notes.find(x => x.id === n.id), n);
    await page.evaluate(() => document.querySelector('.prompt-document-note:last-child .prompt-note-remove').click());
    await page.evaluate(() => document.querySelector('#promptTrashPanel .trash-restore').click());
    assert.equal((await snapshot()).reveal, revealed.reveal);
    // A newly opened note can occupy the deleted note's place; restoring must avoid it.
    await open('ci-deploy');
    await page.evaluate(() => document.querySelector('.prompt-note-remove').click());
    await page.click('.prompt-reveal-note');
    await page.evaluate(() => document.querySelector('#promptTrashPanel .trash-restore').click());
    const overlaps = await page.evaluate(() => {
      const notes = [...document.querySelectorAll('.prompt-document-note')];
      return notes.some((a, i) => notes.slice(i + 1).some(b => a.offsetLeft < b.offsetLeft + b.offsetWidth && a.offsetLeft + a.offsetWidth > b.offsetLeft && a.offsetTop < b.offsetTop + b.offsetHeight && a.offsetTop + a.offsetHeight > b.offsetTop));
    });
    assert.equal(overlaps, false);
    await page.click('#submitButton');
    assert.equal(await page.$eval('#promptText', el => [...el.querySelectorAll('button')].every(b => b.disabled)), true);
    await open('access-request');
    assert.equal((await page.$$('.prompt-document-note')).length, 3);
    assert.equal(await page.$eval('#promptTrashCount', el => el.hidden && el.textContent === '0'), true);
    await page.click('.prompt-reveal-note');
    assert.equal(await page.$eval('.prompt-reveal-cost', el => el.textContent), '1枚ごとに1点減点（1/2枚）');
    await page.click('.prompt-reveal-note');
    assert.equal(await page.$eval('.prompt-reveal-label', el => el.textContent), 'すべてのメモを確認しました');
    assert.equal(await page.$eval('.prompt-reveal-cost', el => el.textContent), '（-2点）');
    for (const width of [900, 1100]) {
      await page.setViewport({ width, height: 900 });
      await open('access-request');
      await page.click('.prompt-note-remove');
      await page.click('#promptTrashToggle');
      await page.click('#promptTrashPanel .trash-restore');
      assert.equal((await page.$$('.prompt-document-note')).length, 3);
    }
    await page.setViewport({ width: 390, height: 900 });
    assert.equal(await page.$eval('.mobile-notice', el => getComputedStyle(el).display !== 'none'), true);
    await page.setViewport({ width: 1440, height: 1000 });
    await open('access-request');
    if (process.env.DRILL_SCREENSHOT_PATH) await page.screenshot({ path: process.env.DRILL_SCREENSHOT_PATH, fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: all 50 prompts, keyboard delete/restore, drag, reveal penalties, collision recovery, answer lock, reset, supported desktop widths, mobile notice');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
