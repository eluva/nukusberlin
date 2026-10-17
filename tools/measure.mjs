/* Measure type sizes, whitespace and fit across viewport widths. */
import { spawn } from 'node:child_process';

const CHROME = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const PORT = 9350;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu',
  '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + process.env.TEMP + '\\berlin-measure', 'about:blank'], { stdio: 'ignore' });

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

const WIDTHS = [
  // the headline is longest in Russian, but check every language at the
  // widest viewport — that is where the art column squeezes it hardest
  { w: 1920, h: 1080, lang: 'kaa' },
  { w: 1920, h: 1080, lang: 'uz' },
  { w: 1920, h: 1080, lang: 'ru' },
  { w: 1600, h: 900,  lang: 'ru' },
  { w: 1440, h: 900,  lang: 'ru' },
  { w: 1280, h: 800,  lang: 'ru' },
  { w: 1024, h: 768,  lang: 'ru' },
  { w: 820,  h: 1180, lang: 'ru' },
  { w: 390,  h: 844,  lang: 'ru' }
];

console.log('\nw/lang     hero  h2   body  mono  art   h1col h1max wrap  gap   heroH  fold   longest-line');
console.log('─'.repeat(96));

for (const v of WIDTHS) {
  await S('Emulation.setDeviceMetricsOverride', { width: v.w, height: v.h, deviceScaleFactor: 1, mobile: v.w < 700 });
  await S('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.setItem('berlin.lang','${v.lang}')}catch(e){}` });
  await S('Page.navigate', { url: 'http://127.0.0.1:8899/index.html' });
  await sleep(2200);
  await S('Runtime.evaluate', { expression: `document.querySelectorAll('[data-rev]').forEach(e=>e.classList.add('is-in'))` });
  await sleep(400);

  const r = await S('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const px = (el, prop='fontSize') => el ? Math.round(parseFloat(getComputedStyle(el)[prop])*10)/10 : null;
      const h1 = document.querySelector('.hero__h1');
      const h2 = document.querySelector('#programs .shead__h');
      const body = document.querySelector('.hero__text');
      const mono = document.querySelector('.shead__kick');
      const hero = document.querySelector('.hero');
      const sect = document.querySelector('#why');
      const shead = document.querySelector('#programs .shead');
      const kick = document.querySelector('#programs .shead__kick');
      const h2box = h2 ? h2.getBoundingClientRect() : null;
      const sheadBox = shead ? shead.getBoundingClientRect() : null;

      // Exact characters on the first rendered line, via Range rects.
      function charsOnFirstLine(el) {
        const node = [...el.childNodes].find(n => n.nodeType === 3 && n.textContent.trim().length > 20);
        if (!node) return 0;
        const text = node.textContent;
        const r = document.createRange();
        r.setStart(node, 0); r.setEnd(node, 1);
        const top = r.getBoundingClientRect().top;
        for (let i = 2; i <= text.length; i++) {
          r.setStart(node, i - 1); r.setEnd(node, i);
          if (r.getBoundingClientRect().top > top + 2) return i - 1;
        }
        return text.length;   // single line
      }

      let longest = 0, longestSel = '';
      for (const p of document.querySelectorAll('.shead__p, .hero__text, .prin__i p, .way p, .ac__b p, .tq blockquote, .idx__name span')) {
        const chars = charsOnFirstLine(p);
        if (chars > longest) {
          longest = chars;
          const own = String(p.className).split(' ')[0];
          longestSel = own ? '.' + own : (p.parentElement ? '.' + String(p.parentElement.className).split(' ')[0] + '>' + p.tagName.toLowerCase() : p.tagName);
        }
      }

      // Does any H1 line overflow its column, or wrap to more lines than authored?
      const lines = [...document.querySelectorAll('.hero__h1 .line')];
      const colW = h1 ? h1.getBoundingClientRect().width : 0;
      const widest = Math.max(...lines.map(l => {
        const r = document.createRange(); r.selectNodeContents(l);
        return Math.max(...[...r.getClientRects()].map(c => c.width), 0);
      }));
      const wrapped = lines.filter(l => {
        const r = document.createRange(); r.selectNodeContents(l);
        return r.getClientRects().length > 1;
      }).length;
      const art = document.querySelector('.hero__art img');

      return {
        hero: px(h1), h2: px(h2), body: px(body), mono: px(mono),
        h1Col: Math.round(colW), h1Widest: Math.round(widest), h1Wrapped: wrapped,
        // gap between the sticky header and the first thing in the hero
        headGap: h1 ? Math.round(h1.getBoundingClientRect().top
                 - document.querySelector('.hdr').getBoundingClientRect().bottom) : null,
        artW: art && art.offsetParent !== null ? Math.round(art.getBoundingClientRect().width) : 0,
        gutter: Math.round(parseFloat(getComputedStyle(document.querySelector('.wrap')).paddingLeft)),
        heroH: Math.round(hero.getBoundingClientRect().height),
        secPad: Math.round(parseFloat(getComputedStyle(sect).paddingTop)),
        headVoid: h2box && sheadBox ? Math.round(h2box.left - sheadBox.left) : null,
        overflow: document.body.scrollWidth > window.innerWidth + 1,
        ctaBottom: Math.round(document.querySelector('.hero__cta').getBoundingClientRect().bottom),
        longest, longestSel
      };
    })()`
  });
  const m = r.result.value;
  console.log(
    (v.w + '/' + v.lang).padEnd(11) +
    String(m.hero).padEnd(6) + String(m.h2).padEnd(5) + String(m.body).padEnd(6) +
    String(m.mono).padEnd(6) + String(m.artW || '—').padEnd(6) +
    String(m.h1Col).padEnd(6) + String(m.h1Widest).padEnd(6) +
    String(m.h1Wrapped).padEnd(6) +
    String(m.headGap).padEnd(6) +
    String(m.heroH).padEnd(7) +
    (m.ctaBottom <= v.h ? 'ok' : 'BELOW').padEnd(7) +
    `${m.longest}ch` +
    (m.h1Wrapped ? '  ← H1 WRAPS' : '') +
    (m.h1Widest > m.h1Col + 1 ? '  ← H1 OVERFLOWS' : '') +
    (m.overflow ? '  ← H-OVERFLOW' : '')
  );
}

ws.close(); chrome.kill(); process.exit(0);
