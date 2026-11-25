// Render an HTML scene frame by frame in Chrome and save the images.
// The page must define: window.READY (Promise), window.TOTAL_FRAMES (number), window.renderFrame(f) (async), optionally window.CUES.
// Usage (from the episode folder): node tools/render.mjs scenes/<page>.html --out out/ep/<piece> [--scale 1] [--frames all | 0-299 | 0,40,80]
//        [--fmt jpg|png] [--q 92] [--query "words=../voice/<piece>/words.json"]
// Needs: npm install puppeteer-core (in this folder or above) and Chrome. Set CHROME to its path if it is not the default one.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');   // the episode folder
const CHROME = process.env.CHROME || ({
  win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
}[process.platform] || '/usr/bin/google-chrome');
const pagePath = args[0];
const out = path.resolve(ROOT, opt('--out', 'out/frames'));
const W = 1920, H = 1080, SCALE = Number(opt('--scale', 1));
const fmt = opt('--fmt', 'jpg'), quality = Number(opt('--q', 92)), query = opt('--query', '');
fs.mkdirSync(out, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = http.createServer((rq, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(rq.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true,
  args: ['--force-color-profile=srgb', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--font-render-hinting=none'],
  defaultViewport: { width: W, height: H, deviceScaleFactor: SCALE } });
let code = 0;
try {
  const page = await browser.newPage();
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warn') console.log('[page]', m.text()); });
  page.on('pageerror', e => { console.log('[pageerror]', e.message); code = 1; });
  await page.goto(`http://127.0.0.1:${server.address().port}/${pagePath}${query ? '?' + query : ''}`, { waitUntil: 'load' });
  await page.evaluate(() => window.READY);
  const total = await page.evaluate(() => window.TOTAL_FRAMES);
  const cues = await page.evaluate(() => window.CUES || null);
  if (cues) fs.writeFileSync(path.join(out, 'cues.json'), JSON.stringify({ ...cues, frames: total }, null, 1));
  const spec = opt('--frames', 'all');
  let frames;
  if (spec === 'all') frames = [...Array(total).keys()];
  else if (spec.includes('-')) { const [a, b] = spec.split('-').map(Number); frames = []; for (let f = a; f <= b; f++) frames.push(f); }
  else frames = spec.split(',').map(Number);
  const t0 = Date.now();
  for (const f of frames) {
    await page.evaluate(async fr => { await window.renderFrame(fr); }, f);
    await page.screenshot({ path: path.join(out, `${String(f).padStart(5, '0')}.${fmt}`), type: fmt === 'png' ? 'png' : 'jpeg', ...(fmt === 'png' ? {} : { quality }), clip: { x: 0, y: 0, width: W, height: H } });
    if (frames.length > 20 && f % 300 === 0) console.log(`frame ${f}/${total} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  console.log(`done ${frames.length} frames -> ${out} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
} catch (e) { console.error(e); code = 1; }
await browser.close();
server.close();
process.exit(code);
