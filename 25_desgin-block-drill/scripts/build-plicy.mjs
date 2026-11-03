import { build } from 'esbuild';
import { zipSync } from 'fflate';
import { readFile, writeFile, readdir, mkdir, cp, rm, lstat, realpath } from 'node:fs/promises';
import { resolve, relative, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeRoute } from './plicy-navigation.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
export const outputDirectory = resolve(project, 'dist/plicy');
export const archivePath = resolve(project, 'dist/design-block-drill-plicy.zip');

export async function buildPlicy() {
  const source = resolve(project, 'src'), dist = resolve(project, 'dist');
  await mkdir(dist, { recursive: true });
  // Never recursively replace a directory outside this project's dist folder.
  if (relative(project, await realpath(dist)) !== 'dist') throw new Error('dist must be a real project directory');
  const existing = await lstat(outputDirectory).catch(error => { if (error.code !== 'ENOENT') throw error; return null; });
  if (existing) {
    if (existing.isSymbolicLink() || relative(dist, await realpath(outputDirectory)) !== 'plicy') throw new Error('Unexpected output directory');
    await rm(outputDirectory, { recursive: true });
  }
  await mkdir(outputDirectory);
  const result = await build({
    absWorkingDir: project,
    entryPoints: ['scripts/plicy-entry.mjs'],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2022',
    charset: 'utf8',
    minify: true,
    legalComments: 'none',
    define: { 'import.meta.url': 'document.baseURI', 'window.addEventListener': '__plicyAddWindowListener', 'document.addEventListener': '__plicyAddDocumentListener' },
    inject: [resolve(project, 'scripts/plicy-navigation.mjs')],
    plugins: [{ name: 'in-page-entry', setup(api) {
      api.onLoad({ filter: /[\\/]src[\\/](app|story-ui)\.mjs$/ }, async args => {
        let contents = await readFile(args.path, 'utf8');
        if (args.path === resolve(project, 'src/app.mjs')) {
          const imports = [...contents.matchAll(/^import .+;\r?$/gm)].map(match => match[0]);
          contents = `${imports.join('\n')}\nexport function mountApp() {\n${contents.replace(/^import .+;\r?\n/gm, '')}\n}`;
        } else {
          if (!contents.includes('clearTimeout(loadingTimeout);')) throw new Error('Dialogue guard insertion point changed');
          contents = contents.replace('async function dialogue(key, force = false, done = showNext, extraLines) {', 'async function dialogue(key, force = false, done = showNext, extraLines) { const plicyMount = __plicyMountToken();');
          contents = contents.replace('clearTimeout(loadingTimeout);', 'clearTimeout(loadingTimeout); if (!__plicyIsMountCurrent(plicyMount)) return;');
        }
        return { contents, loader: 'js' };
      });
    } }],
    write: false,
    metafile: true,
  });
  if (result.metafile.outputs && Object.values(result.metafile.outputs).some(output => output.imports.length)) throw new Error('Bundle still has runtime imports');
  const javascript = result.outputFiles[0].text;
  const [original, style, hud] = await Promise.all(['index.html', 'style.css', 'hud.css'].map(name => readFile(join(source, name), 'utf8')));
  const entry = /<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']app\.mjs["'][^>]*>\s*<\/script>/gi;
  if ((original.match(entry) || []).length !== 1) throw new Error('Expected exactly one app.mjs entry script');
  let html = original.replace(entry, '').replaceAll('new URLSearchParams(location.search)', 'new URLSearchParams(window.__designBlockPlicyRouteSearch)');
  html = html.replace('<script>', `<script data-bundle="route-bootstrap">(${initializeRoute.toString()})(window);</script><script>`);
  for (const [name, css] of [['style.css', style], ['hud.css', hud]]) {
    const link = new RegExp(`<link\\b[^>]*\\bhref=["']${name.replace('.', '\\.')}["'][^>]*>`, 'i');
    if (!link.test(html)) throw new Error(`Missing stylesheet: ${name}`);
    html = html.replace(link, () => `<style data-bundle="${name}">\n${css.replace(/<\/style/gi, '<\\/style')}\n</style>`);
  }
  html = html.replace(/<body\b[^>]*>/i, '$&<div id="plicyGameRoot" style="display:contents">').replace(/<\/body>/i, '</div></body>');
  // Inline the classic script after all dialogs exist. No JS MIME lookup occurs.
  html = html.replace(/<\/body>/i, () => `<script data-bundle="app.js">\n${javascript.replace(/<\/script/gi, '<\\/script')}\n</script></body>`);
  if (/<script\b[^>]*\btype=["']module["']/i.test(html)) throw new Error('Module script remains in distribution');
  await Promise.all([
    writeFile(join(outputDirectory, 'index.html'), html),
    writeFile(join(outputDirectory, 'app.js'), javascript),
    writeFile(join(outputDirectory, 'style.css'), style),
    writeFile(join(outputDirectory, 'hud.css'), hud),
    cp(join(source, 'assets'), join(outputDirectory, 'assets'), { recursive: true }),
  ]);
  const files = {};
  async function collect(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = prefix + entry.name, path = join(directory, entry.name);
      if (entry.isDirectory()) await collect(path, `${name}/`);
      else if (entry.isFile()) files[name] = [new Uint8Array(await readFile(path)), { level: ['.png', '.ico'].includes(extname(name)) ? 0 : 6 }];
    }
  }
  await collect(outputDirectory);
  await writeFile(archivePath, zipSync(files));
  console.log(`Built: ${outputDirectory}\nZIP: ${archivePath}\n${Object.keys(files).length} files; inline classic JS/CSS; source unchanged`);
  return { outputDirectory, archivePath };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildPlicy();
