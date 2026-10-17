/* Section-level screenshots for visual review. */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const OUT = new URL('../.qa/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const PORT = 9334;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--hide-scrollbars',
  '--no-first-run', '--no-default-browser-check',
  '--user-data-dir=' + process.env.TEMP + '\\berlin-qa2', 'about:blank'
], { stdio: 'ignore' });

let ws, id = 0; const pending = new Map();
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const n = ++id; pending.set(n, { res, rej });
  ws.send(JSON.stringify({ id: n, method, params, sessionId }));
});

let url;
for (let i = 0; i < 40; i++) {
  try { url = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; break; }
  catch { await sleep(250); }
}
ws = new WebSocket(url);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id); pending.delete(m.id);
    m.error ? rej(new Error(m.error.message)) : res(m.result);
  }
});

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);
await S('Page.enable'); await S('Runtime.enable');
await S('Network.enable'); await S('Network.setCacheDisabled', { cacheDisabled: true });

async function shot(name, { w = 1440, h = 900, dsf = 1, mobile = false, lang = 'kaa', sel, wait = 2400, before = '', seekReel = null }) {
  await S('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dsf, mobile });
  await S('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.setItem('berlin.lang','${lang}')}catch(e){}` });
  await S('Page.navigate', { url: 'http://127.0.0.1:8899/index.html' });
  await sleep(wait);
  // addScriptToEvaluateOnNewDocument can lose the race with navigate, which
  // silently yields a screenshot in the wrong language. Force and settle.
  await S('Runtime.evaluate', {
    expression: `if (document.documentElement.lang !== '${lang}') window.I18N.apply('${lang}')`
  });
  await sleep(500);
  await S('Runtime.evaluate', {
    expression: `document.querySelectorAll('[data-rev]').forEach(e=>e.classList.add('is-in'));
                 document.querySelectorAll('.bx').forEach(e=>e.classList.add('is-in'));
                 document.querySelector('.hcard')?.classList.add('is-lit');`
  });
  if (sel) {
    await S('Runtime.evaluate', {
      expression: `document.documentElement.style.scrollBehavior='auto';
                   window.scrollTo(0, document.querySelector('${sel}').getBoundingClientRect().top + window.scrollY - 80);`
    });
    await sleep(1300);
  }
  if (before) { await S('Runtime.evaluate', { expression: before }); await sleep(1500); }
  const { data } = await S('Page.captureScreenshot', { format: 'jpeg', quality: 84 });
  writeFileSync(new URL(name + '.jpg', OUT), Buffer.from(data, 'base64'));
  console.log('  saved', name);
}

console.log('Capturing sections…');
await shot('s00-hero-mobile', { w: 390, h: 844, dsf: 2, mobile: true, lang: 'ru' });
await shot('s0-gov-ru', { sel: '.gov', lang: 'ru' });
await shot('s0b-gov-mobile', { w: 390, h: 844, dsf: 2, mobile: true, lang: 'ru', sel: '.gov' });
await shot('s1-programs-ru', { sel: '#programs', lang: 'ru' });
await shot('s1b-programs-open', { sel: '#programs', lang: 'ru', before: `document.querySelectorAll('.idx__tg')[0].click()` });
// pointerdown only: leaves the player scrubbing, freezing the scene for a clean frame
const seekTo = (r) => `(()=>{const t=document.getElementById('track');const b=t.getBoundingClientRect();
   t.dispatchEvent(new PointerEvent('pointerdown',{clientX:b.left+b.width*${r},clientY:b.top+10,bubbles:true,pointerId:1}));})()`;
await shot('s2-reel-scene2', { sel: '#reel', lang: 'kaa', before: seekTo(0.22) });
await shot('s2b-reel-scene5', { sel: '#reel', lang: 'ru', before: seekTo(0.72) });
await shot('s3-apply-uz', { sel: '#apply', lang: 'uz' });
await shot('s4-mobile-menu', { w: 390, h: 844, dsf: 2, mobile: true, lang: 'ru', before: `document.getElementById('burger').click()` });
await shot('s5-mobile-programs', { w: 390, h: 844, dsf: 2, mobile: true, lang: 'kaa', sel: '#programs' });
await shot('s6-mobile-apply', { w: 390, h: 844, dsf: 2, mobile: true, lang: 'ru', sel: '#apply' });
await shot('s7-price-ru', { sel: '#price', lang: 'ru' });
await shot('s8-results-uz', { sel: '#results', lang: 'uz' });

ws.close(); chrome.kill(); process.exit(0);
