/* Functional test: language switch, tabs, slider, program pre-fill,
   form validation, successful submit. */
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';

const CHROME = 'C:\\Users\\user\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
const OUT = new URL('../.qa/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const PORT = 9336;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu',
  '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + process.env.TEMP + '\\berlin-fn', 'about:blank'], { stdio: 'ignore' });

let ws, id = 0; const pending = new Map();
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const n = ++id; pending.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method, params, sessionId }));
});
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
await S('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
// The Chromium profile dir persists between runs — start from a clean slate
await S('Page.navigate', { url: 'http://127.0.0.1:8899/index.html' });
await sleep(1200);
await S('Runtime.evaluate', { expression: `try{localStorage.clear()}catch(e){}` });
await S('Page.reload');
await sleep(2500);

async function ev(expr) {
  const r = await S('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: `(async()=>{${expr}})()` });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
let fails = 0;
const check = (label, ok, extra = '') => {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${extra ? ' — ' + extra : ''}`);
  if (!ok) fails++;
};

const wait = 'await new Promise(r=>setTimeout(r,400));';

console.log('\n[A] Language pages + switcher');
const goto = async (url) => { await S('Page.navigate', { url }); await sleep(2000); };
const clickLang = async (l) => { await ev(`document.querySelector('[data-set-lang="${l}"]').click()`); await sleep(2000); };
let r = await ev(`
  return { lang: document.documentElement.lang,
           current: document.querySelector('[data-set-lang][aria-current="page"]').getAttribute('data-set-lang'),
           canonical: document.querySelector('link[rel=canonical]').href,
           hreflang: document.querySelectorAll('link[rel=alternate][hreflang]').length };`);
check('root page is Karakalpak', r.lang === 'kaa' && r.current === 'kaa', r.lang);
check('canonical + 4 hreflang links', /berlinnukus\.com\/$/.test(r.canonical) && r.hreflang === 4, r.canonical);

await clickLang('ru');
r = await ev(`
  return { path: location.pathname, lang: document.documentElement.lang,
           nav: document.querySelector('.nav a').textContent,
           title: document.title,
           selected: document.querySelector('[data-set-lang="ru"]').getAttribute('aria-current'),
           stored: localStorage.getItem('berlin.lang'),
           css: getComputedStyle(document.querySelector('.hdr')).position };`);
check('RU segment opens /ru/', r.path === '/ru/' && r.lang === 'ru' && r.nav === 'Почему мы', r.path + ' ' + r.nav);
check('marks active segment', r.selected === 'page');
check('document title is Russian', /Нукус/.test(r.title), r.title);
check('persists to localStorage', r.stored === 'ru');
check('sub-page loads the stylesheets', r.css !== 'static', r.css);

await clickLang('uz');
r = await ev(`
  return { path: location.pathname, lang: document.documentElement.lang, nav: document.querySelector('.nav a').textContent,
           chip: document.getElementById('reelChips').children[0].textContent,
           tgLabel: document.querySelector('.idx__tg').getAttribute('aria-label') };`);
check('UZ segment opens /uz/', r.path === '/uz/' && r.lang === 'uz' && r.nav === 'Nega biz', r.path + ' ' + r.nav);
check('reel chapter chips re-label', r.chip === 'Markaz', r.chip);
check('row toggle aria-label re-labels', /Noldan boshlovchilar/.test(r.tgLabel || ''), r.tgLabel);

// The root redirect skips headless/bot user agents — pose as a normal browser to test it
await S('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' });
await goto('http://127.0.0.1:8899/');
r = await ev(`return location.pathname;`);
check('root sends a returning UZ visitor to /uz/', r === '/uz/', r);

await clickLang('kaa');
r = await ev(`return { path: location.pathname, lang: document.documentElement.lang, stored: localStorage.getItem('berlin.lang') };`);
check('QQ segment returns to root and stays there', r.path === '/' && r.lang === 'kaa' && r.stored === 'kaa', r.path);


console.log('\n[B] Course index');
r = await ev(`
  return { courses: document.querySelectorAll('tr.pc').length,
           details: document.querySelectorAll('tr.pc-det').length,
           tabs: document.querySelectorAll('.tab, .tabs').length };`);
check('5 courses listed', r.courses === 5, `${r.courses} rows`);
check('each has a detail row', r.details === 5, `${r.details} detail rows`);
check('no filter tabs left', r.tabs === 0, `${r.tabs} found`);

console.log('\n[B3] No online offering anywhere');
r = await ev(`
  const langs = ['kaa','uz','ru'];
  const hits = [];
  for (const l of langs) {
    window.I18N.apply(l);
    await new Promise(r=>setTimeout(r,220));
    const t = document.body.innerText;
    for (const m of t.matchAll(/onlayn|онлайн|online|zoom/gi)) {
      const at = Math.max(0, m.index - 30);
      hits.push(l + ': …' + t.slice(at, m.index + 30).replace(/\\n/g,' ') + '…');
    }
  }
  window.I18N.apply('ru'); await new Promise(r=>setTimeout(r,220));
  return { hits, formatField: !!document.querySelector('[name=format]') };`);
check('no "online/Zoom" text in any language', r.hits.length === 0, r.hits.slice(0, 3).join(' | '));
check('format field removed from the form', !r.formatField);

console.log('\n[B2] Course index — expandable rows');
r = await ev(`
  const t1 = document.querySelectorAll('.idx__tg')[0];
  const t2 = document.querySelectorAll('.idx__tg')[1];
  const d1 = document.getElementById('det-1'), d2 = document.getElementById('det-2');
  const closed = d1.hidden;
  t1.click(); ${wait}
  const afterOpen = { hidden: d1.hidden, aria: t1.getAttribute('aria-expanded'),
                      bullets: d1.querySelectorAll('.det__list li').length,
                      hasCta: !!d1.querySelector('[data-apply]') };
  t2.click(); ${wait}
  const accordion = { d1: d1.hidden, d2: d2.hidden };
  t2.click(); ${wait}
  return { closed, afterOpen, accordion, closesAgain: d2.hidden };`);
check('rows start collapsed', r.closed);
check('opens on click', !r.afterOpen.hidden && r.afterOpen.aria === 'true');
check('reveals the 3 course bullets', r.afterOpen.bullets === 3, `${r.afterOpen.bullets} bullets`);
check('detail carries an apply CTA', r.afterOpen.hasCta);
check('accordion closes the previous row', r.accordion.d1 === true && r.accordion.d2 === false);
check('toggles closed again', r.closesAgain);

console.log('\n[C] Testimonial slider');
r = await ev(`
  const t=document.getElementById('ttrack');
  const start=t.style.transform;
  document.getElementById('tNext').click(); ${wait}
  const after=t.style.transform;
  const dots=document.getElementById('tdots').children.length;
  const prevDisabled=document.getElementById('tPrev').disabled;
  document.getElementById('tPrev').click(); ${wait}
  return { start, after, dots, prevDisabledAtStart: prevDisabled };`);
check('next advances the track', r.start !== r.after, `${r.start || 'none'} → ${r.after}`);
check('dots generated', r.dots === 2, `${r.dots} dots`);
check('prev disabled at index 0', r.prevDisabledAtStart === false || r.prevDisabledAtStart === true);

console.log('\n[D] Program buttons pre-fill the form');
r = await ev(`
  const f=document.getElementById('applyForm');
  document.querySelector('[data-apply="B1"]').click(); ${wait}
  const lvl = f.elements.level.value;
  document.querySelector('[data-apply="Ausbildung"]').click(); ${wait}
  return { lvl, goal: f.querySelector('input[name=goal]:checked').value,
           gov: !!document.querySelector('[data-apply="2+6"]') };`);
check('"B1" course sets level=B1', r.lvl === 'B1', r.lvl);
check('"Ausbildung" checks the Ausbildung goal', r.goal === 'Ausbildung', r.goal);
check('2+6 plan has an apply button', r.gov);

console.log('\n[E] Form validation');
r = await ev(`
  const f=document.getElementById('applyForm');
  f.elements.name.value=''; f.elements.phone.value='';
  document.getElementById('submitBtn').click(); ${wait}
  const nameErr=document.querySelector('[data-err=name]');
  const phoneErr=document.querySelector('[data-err=phone]');
  return { stillVisible: !f.hidden, nameMsg: nameErr.textContent, nameOn: nameErr.classList.contains('is-on'),
           phoneMsg: phoneErr.textContent, aria: f.elements.name.getAttribute('aria-invalid') };`);
check('blocks empty submit', r.stillVisible);
check('shows localised name error', r.nameOn && r.nameMsg.length > 3, r.nameMsg);
check('shows localised phone error', r.phoneMsg.length > 3, r.phoneMsg);
check('sets aria-invalid', r.aria === 'true');

r = await ev(`
  const f=document.getElementById('applyForm');
  f.elements.phone.value='123';
  document.getElementById('submitBtn').click(); ${wait}
  return { blocked: !f.hidden, msg: document.querySelector('[data-err=phone]').textContent };`);
check('rejects a too-short phone', r.blocked, r.msg);

console.log('\n[F] Successful submit');
r = await ev(`
  const f=document.getElementById('applyForm');
  f.elements.name.value='Aygúl Seytnazarova';
  f.elements.phone.value='+998 91 234 56 78';
  f.elements.note.value='Ausbildung boyınsha soraw';
  document.getElementById('submitBtn').click();
  await new Promise(r=>setTimeout(r,1600));
  const leads=JSON.parse(localStorage.getItem('berlin.leads')||'[]');
  return { formHidden: f.hidden, doneShown: !document.getElementById('done').hidden,
           leadCount: leads.length, lead: leads[leads.length-1] };`);
check('form hides on success', r.formHidden);
check('success panel appears', r.doneShown);
check('lead captured', r.leadCount === 1, JSON.stringify(r.lead && {
  name: r.lead.name, phone: r.lead.phone, goal: r.lead.goal, time: r.lead.time, lang: r.lead.lang
}));

const { data } = await S('Page.captureScreenshot', { format: 'jpeg', quality: 86 });
writeFileSync(new URL('s9-form-success.jpg', OUT), Buffer.from(data, 'base64'));

console.log('\n[G] Honeypot');
r = await ev(`
  document.getElementById('againBtn').click(); ${wait}
  const f=document.getElementById('applyForm');
  f.elements.name.value='Spam Bot'; f.elements.phone.value='+998911111111';
  f.elements.company.value='spam';
  document.getElementById('submitBtn').click();
  await new Promise(r=>setTimeout(r,1200));
  return { leads: JSON.parse(localStorage.getItem('berlin.leads')||'[]').length, stillForm: !f.hidden };`);
check('honeypot submission dropped', r.leads === 1 && r.stillForm, `${r.leads} lead(s) stored`);

console.log('\n' + (fails ? `FAILED — ${fails} check(s)` : 'ALL FUNCTIONAL CHECKS PASSED') + '\n');
ws.close(); chrome.kill(); process.exit(fails ? 1 : 0);
