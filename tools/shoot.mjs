/* Headless-Chromium QA: screenshots at several viewports/languages
   + console-error capture. Drives CDP directly (no npm deps). */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const URL_BASE = 'http://127.0.0.1:8899/';
const OUT = new URL('../.qa/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const PORT = 9333;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--user-data-dir=' + process.env.TEMP + '\\berlin-qa-profile',
  'about:blank'
], { stdio: 'ignore' });

let ws, id = 0;
const pending = new Map();
const events = [];

function send(method, params = {}, sessionId) {
  const msgId = ++id;
  return new Promise((resolve, reject) => {
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
  });
}

async function connect() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const v = await r.json();
      return v.webSocketDebuggerUrl;
    } catch { await sleep(250); }
  }
  throw new Error('Chromium did not expose CDP in time');
}

const wsUrl = await connect();
ws = new WebSocket(wsUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));

ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.method + ': ' + msg.error.message)) : resolve(msg.result);
  } else if (msg.method) {
    events.push(msg);
  }
});

// Attach to a fresh tab
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(m, p, sessionId);

await S('Page.enable');
await S('Runtime.enable');
await S('Log.enable');
await S('Network.enable');
// The profile dir persists between runs — never test against stale CSS/JS
await S('Network.setCacheDisabled', { cacheDisabled: true });

const SHOTS = [
  { name: '01-desktop-kaa', w: 1440, h: 900, dsf: 1, mobile: false, lang: 'kaa', full: true },
  { name: '02-desktop-ru',  w: 1440, h: 900, dsf: 1, mobile: false, lang: 'ru',  full: false, scroll: 0 },
  { name: '03-desktop-uz',  w: 1440, h: 900, dsf: 1, mobile: false, lang: 'uz',  full: false, scroll: 0 },
  { name: '04-tablet-kaa',  w: 834,  h: 1112, dsf: 1, mobile: false, lang: 'kaa', full: false, scroll: 0 },
  { name: '05-mobile-ru',   w: 390,  h: 844, dsf: 2, mobile: true,  lang: 'ru',  full: true },
];

const problems = [];

for (const shot of SHOTS) {
  events.length = 0;

  await S('Emulation.setDeviceMetricsOverride', {
    width: shot.w, height: shot.h, deviceScaleFactor: shot.dsf, mobile: shot.mobile
  });

  // Each language is its own pre-rendered page
  await S('Page.navigate', { url: URL_BASE + (shot.lang === 'kaa' ? '' : shot.lang + '/') });
  await sleep(2600);

  if (shot.scroll !== undefined) {
    await S('Runtime.evaluate', { expression: `window.scrollTo(0, ${shot.scroll})` });
    await sleep(500);
  }

  // Reveal everything so full-page shots aren't half-empty
  if (shot.full) {
    await S('Runtime.evaluate', {
      expression: `document.querySelectorAll('[data-rev]').forEach(e=>e.classList.add('is-in'));
                   document.querySelectorAll('.bx').forEach(e=>e.classList.add('is-in'));
                   document.querySelector('.hcard')?.classList.add('is-lit');`
    });
    await sleep(900);
  }

  const { data } = await S('Page.captureScreenshot', {
    format: 'jpeg', quality: 82, captureBeyondViewport: !!shot.full
  });
  writeFileSync(new URL(shot.name + '.jpg', OUT), Buffer.from(data, 'base64'));

  // Collect console errors + failed requests for this pass
  for (const e of events) {
    if (e.method === 'Runtime.exceptionThrown') {
      problems.push(`[${shot.name}] JS exception: ${e.params.exceptionDetails.text} ${e.params.exceptionDetails.exception?.description || ''}`);
    }
    if (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') {
      problems.push(`[${shot.name}] console.error: ${e.params.args.map(a => a.value || a.description).join(' ')}`);
    }
    if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') {
      problems.push(`[${shot.name}] log: ${e.params.entry.text} ${e.params.entry.url || ''}`);
    }
    if (e.method === 'Network.loadingFailed' && !/favicon/.test(e.params.type)) {
      problems.push(`[${shot.name}] request failed: ${e.params.errorText} (${e.params.type})`);
    }
  }

  // Sanity probes
  const probe = await S('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const d = document.documentElement;
      const untranslated = [...document.querySelectorAll('[data-i18n]')]
        .filter(e => e.textContent.trim() === e.getAttribute('data-i18n')).length;
      return {
        lang: d.lang,
        htmlOverflow: document.body.scrollWidth > window.innerWidth + 1
          ? document.body.scrollWidth + ' vs ' + window.innerWidth : false,
        untranslated,
        title: document.title,
        heroH1: document.querySelector('.hero__h1')?.innerText.replace(/\\n/g,' '),
        scenes: document.querySelectorAll('.sc').length,
        activeScene: document.querySelector('.sc.is-on')?.dataset.scene ?? null,
        ctaBottom: Math.round(document.querySelector('.hero__cta')?.getBoundingClientRect().bottom ?? -1),
        fold: window.innerHeight
      };
    })()`
  });
  const v = probe.result.value;
  const foldOk = v.ctaBottom > 0 && v.ctaBottom <= v.fold;
  console.log(`${shot.name.padEnd(18)} lang=${v.lang.padEnd(4)} scene=${v.activeScene} untranslated=${v.untranslated} h-overflow=${v.htmlOverflow || 'none'} cta=${v.ctaBottom}/${v.fold} ${foldOk ? '(above fold ✓)' : '(BELOW FOLD)'}`);
  console.log(`   h1: ${v.heroH1}`);
  if (v.htmlOverflow) problems.push(`[${shot.name}] horizontal overflow: ${v.htmlOverflow}`);
  if (v.untranslated) problems.push(`[${shot.name}] ${v.untranslated} untranslated node(s)`);
  if (!foldOk && !shot.mobile) problems.push(`[${shot.name}] hero CTA below the fold (${v.ctaBottom} > ${v.fold})`);

}

console.log('\n' + (problems.length ? 'PROBLEMS:\n' + problems.map(p => '  ✗ ' + p).join('\n') : '✓ no console errors, failed requests or overflow'));

ws.close();
chrome.kill();
process.exit(0);
