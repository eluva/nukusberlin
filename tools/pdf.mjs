/* Render docs/scope.html to PDF with headless Chromium.
   Also asserts the line items really add up to the stated total. */
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';

const CHROME = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const OUT = new URL('../docs/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const PORT = 9370;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const EDITIONS = [
  { lang: 'ru',  src: 'scope.html',     pdf: 'BERLIN-funkcional-i-stoimost.pdf' },
  { lang: 'kaa', src: 'scope-kaa.html', pdf: 'BERLIN-funkcional-hám-bahası.pdf' },
];

/* ── Arithmetic check before we render anything ──
   Both editions must list the same prices and the same total: a quote that
   says $325 in Russian and something else in Karakalpak is worse than none. */
const totals = {};
for (const ed of EDITIONS) {
  const html = readFileSync(new URL(ed.src, OUT), 'utf8');
  const rows = [...html.matchAll(/<td class="price">\$(\d+)<\/td>/g)].map(m => +m[1]);
  const items = rows.slice(0, -1);
  const stated = rows[rows.length - 1];
  const sum = items.reduce((a, b) => a + b, 0);
  console.log(`${ed.lang.padEnd(4)} ${items.length} items, sum $${sum}, stated $${stated}`);
  if (sum !== stated) {
    console.error(`\n✗ ${ed.src}: items add up to $${sum} but the total says $${stated}`);
    process.exit(1);
  }
  totals[ed.lang] = { items, stated };
}
const [a, b] = Object.values(totals);
if (a.stated !== b.stated || a.items.join() !== b.items.join()) {
  console.error('\n✗ The two editions disagree on prices:');
  console.error('   ru : ' + a.items.join(' ') + '  = $' + a.stated);
  console.error('   kaa: ' + b.items.join(' ') + '  = $' + b.stated);
  process.exit(1);
}
console.log('✓ both editions add up and agree with each other\n');

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu',
  '--no-first-run', '--user-data-dir=' + process.env.TEMP + '\\berlin-pdf', 'about:blank'], { stdio: 'ignore' });

let ws, id = 0; const pending = new Map();
const send = (m, p = {}, s) => new Promise((res, rej) => { const n = ++id; pending.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method: m, params: p, sessionId: s })); });
let url;
for (let i = 0; i < 40; i++) { try { url = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; break; } catch { await sleep(250); } }
ws = new WebSocket(url);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
});
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable'); await S('Runtime.enable');
await S('Network.enable'); await S('Network.setCacheDisabled', { cacheDisabled: true });

for (const ed of EDITIONS) {
await S('Page.navigate', { url: 'http://127.0.0.1:8899/docs/' + ed.src });
await sleep(2500);

// document.fonts.ready alone is not enough: Chrome outlines glyphs as Type3
// (unselectable, bloated) for any face that is not fully resolved at print
// time. Load every weight actually used, then confirm each one.
const fontState = await S('Runtime.evaluate', {
  returnByValue: true, awaitPromise: true,
  expression: `(async () => {
    // Google Fonts splits families into unicode-range subsets, so the sample has
    // to come from this page's own text — probing with Cyrillic on a Latin page
    // reports "not loaded" for a font that is perfectly fine.
    const sample = [...new Set(document.body.innerText.replace(/\\s/g, ''))].join('').slice(0, 60);
    const faces = [];
    for (const w of [400, 500, 600, 700]) faces.push(w + ' 10pt "IBM Plex Sans"');
    for (const w of [400, 500, 600])      faces.push(w + ' 10pt "IBM Plex Mono"');
    await Promise.all(faces.map(f => document.fonts.load(f, sample)));
    await document.fonts.ready;
    return faces.map(f => f + ' → ' + document.fonts.check(f, sample));
  })()`
});
const notReady = fontState.result.value.filter(l => l.endsWith('false'));
if (notReady.length) {
  console.error('✗ fonts not ready: ' + notReady.join(', '));
  ws.close(); chrome.kill(); process.exit(1);
}
await sleep(600);

const { data } = await S('Page.printToPDF', {
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: false
});

const buf = Buffer.from(data, 'base64');
try {
  writeFileSync(new URL(ed.pdf, OUT), buf);
  console.log(`Saved docs/${ed.pdf}  (${(buf.length / 1024).toFixed(1)} KB)`);
} catch (err) {
  if (err.code === 'EBUSY' || err.code === 'EPERM') {
    // Windows keeps an exclusive lock while the PDF is open in a viewer.
    // Fail loudly rather than leaving a stale file that looks freshly built.
    console.error(`\n✗ Cannot write docs/${ed.pdf} — the file is open in another program.`);
    console.error('  Close it (PDF viewer / browser tab) and run this again.');
    ws.close(); chrome.kill();
    process.exit(1);
  }
  throw err;
}
}

ws.close(); chrome.kill(); process.exit(0);
