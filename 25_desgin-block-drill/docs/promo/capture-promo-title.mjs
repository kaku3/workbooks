import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const promo = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(promo, '../../src');
const runtime = path.resolve(promo, '../../../26_report-drill/docs/promo/promo-capture/.runtime');
const clips = path.join(promo, 'promo-capture', 'clips');
const viewport = { width: 1920, height: 1080 };
const types = { '.html': 'text/html', '.css': 'text/css', '.mjs': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' };
process.env.PLAYWRIGHT_BROWSERS_PATH ||= runtime;
const playwright = process.env.PLAYWRIGHT_MODULE || path.join(process.env.LOCALAPPDATA, 'ms-playwright-go/1.50.1/package/index.mjs');
const { chromium } = await import(pathToFileURL(playwright).href);

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(source, '.' + pathname);
    if (!file.startsWith(source + path.sep) || !(await stat(file)).isFile()) return response.writeHead(404).end();
    response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    createReadStream(file).on('error', () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve, reject) => server.once('error', reject).listen(0, '127.0.0.1', resolve));
let browser;
try {
  await mkdir(clips, { recursive: true });
  const raw = path.join(promo, 'promo-capture', '.raw');
  await mkdir(raw, { recursive: true });
  browser = await chromium.launch({ executablePath: process.env.CAPTURE_BROWSER || path.join(runtime, 'chromium_headless_shell-1155/chrome-win/headless_shell.exe') });
  const context = await browser.newContext({ viewport, locale: 'ja-JP', reducedMotion: 'no-preference', recordVideo: { dir: raw, size: viewport } });
  const origin = performance.now();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.locator('#titleScreen h1').waitFor({ state: 'visible' });
  await page.waitForFunction(() => !document.documentElement.classList.contains('booting') && Boolean(document.querySelector('#tokens').children.length));
  await page.evaluate(() => document.fonts.ready);
  // Leave room for the initial screencast frames and record through multiple demo states.
  const start = Math.ceil((performance.now() - origin + 3300) / 40) * .04;
  await page.waitForTimeout(12000);
  if (errors.length) throw new Error(errors.join('\n'));
  const video = page.video();
  await context.close();
  await video.saveAs(path.join(clips, '01-title-motion.webm'));
  await writeFile(path.join(clips, '01-title-motion.json'), JSON.stringify({ start_seconds: Number(start.toFixed(2)), viewport, source: 'src/index.html' }, null, 2) + '\n');
  console.log(`Recorded title animation. Edit start: ${start.toFixed(2)} seconds.`);
} finally {
  await browser?.close();
  server.close();
}
