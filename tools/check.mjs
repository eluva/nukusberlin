/* Static QA: i18n key coverage + icon sprite references. */
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

const html = read('index.html');
const i18nSrc = read('js/i18n.js');

let fail = 0;
const bad = (msg) => { console.log('  ✗ ' + msg); fail++; };

/* ── Extract dictionaries by evaluating i18n.js in a stub window ── */
const sandbox = { window: {}, navigator: { language: 'kaa' }, localStorage: null, document: null };
const dicts = {};
{
  // Pull each `var xx = { ... };` block for kaa / uz / ru
  for (const name of ['kaa', 'uz', 'ru']) {
    const start = i18nSrc.indexOf(`var ${name} = {`);
    if (start === -1) { bad(`dictionary "${name}" not found`); continue; }
    let i = i18nSrc.indexOf('{', start), depth = 0, end = -1;
    for (let j = i; j < i18nSrc.length; j++) {
      if (i18nSrc[j] === '{') depth++;
      else if (i18nSrc[j] === '}') { depth--; if (depth === 0) { end = j + 1; break; } }
    }
    dicts[name] = new Function(`return ${i18nSrc.slice(i, end)}`)();
  }
}

const langs = Object.keys(dicts);
console.log(`\nDictionaries: ${langs.map(l => `${l}=${Object.keys(dicts[l]).length}`).join(', ')}`);

/* ── 1. Key parity across languages ── */
console.log('\n[1] Key parity across languages');
const base = new Set(Object.keys(dicts.kaa));
for (const l of langs) {
  if (l === 'kaa') continue;
  const keys = new Set(Object.keys(dicts[l]));
  for (const k of base) if (!keys.has(k)) bad(`${l} missing key: ${k}`);
  for (const k of keys) if (!base.has(k)) bad(`${l} has extra key not in kaa: ${k}`);
}
if (!fail) console.log('  ✓ all three dictionaries have identical key sets');

/* ── 2. HTML data-i18n keys resolve ── */
console.log('\n[2] HTML data-i18n keys');
const before = fail;
const htmlKeys = new Set();
for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) htmlKeys.add(m[1]);
for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
  for (const pair of m[1].split(',')) {
    const [, key] = pair.split(':').map(s => s.trim());
    if (key) htmlKeys.add(key);
  }
}
// units resolved at runtime rather than through data-i18n
for (const m of html.matchAll(/data-suffix-key="([^"]+)"/g)) htmlKeys.add(m[1]);
for (const k of htmlKeys) {
  for (const l of langs) if (!(k in dicts[l])) bad(`${l} missing HTML key: ${k}`);
}
console.log(`  ${fail === before ? '✓' : ' '} ${htmlKeys.size} distinct keys used in markup`);

/* ── 3. Keys referenced from JS ── */
console.log('\n[3] JS-referenced keys');
const before3 = fail;
const jsKeys = new Set(['meta.title', 'meta.desc', 'a11y.play', 'a11y.pause', 'err.name', 'err.phone']);
for (let i = 1; i <= 6; i++) jsKeys.add('reel.ch' + i);
for (const k of jsKeys) {
  for (const l of langs) if (!(k in dicts[l])) bad(`${l} missing JS key: ${k}`);
}
if (fail === before3) console.log(`  ✓ ${jsKeys.size} runtime keys present in all languages`);

/* ── 4. Unused dictionary keys (informational) ── */
const used = new Set([...htmlKeys, ...jsKeys]);
const unused = [...base].filter(k => !used.has(k));
if (unused.length) console.log(`\n[4] Unused dictionary keys (${unused.length}): ${unused.join(', ')}`);
else console.log('\n[4] ✓ no unused dictionary keys');

/* ── 5. Icon sprite references ── */
console.log('\n[5] Icon sprite references');
const before5 = fail;
const symbols = new Set([...html.matchAll(/<symbol id="([^"]+)"/g)].map(m => m[1]));
const refs = new Set([...html.matchAll(/<use href="#(i-[^"]+)"/g)].map(m => m[1]));
for (const r of refs) if (!symbols.has(r)) bad(`markup references missing symbol #${r}`);
// icons swapped in at runtime
for (const r of ['i-close', 'i-menu', 'i-play', 'i-pause', 'i-replay']) {
  if (!symbols.has(r)) bad(`JS swaps to missing symbol #${r}`);
}
if (fail === before5) console.log(`  ✓ ${refs.size} referenced icons, all ${symbols.size} symbols defined`);

/* ── 6. Section ids referenced by nav ── */
console.log('\n[6] In-page anchors');
const before6 = fail;
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
for (const m of html.matchAll(/href="#([^"]+)"/g)) {
  if (m[1] && !ids.has(m[1])) bad(`anchor #${m[1]} has no matching element`);
}
if (fail === before6) console.log('  ✓ every in-page anchor resolves');

/* ── 7. Karakalpak spellings corrected by the client ── */
console.log('\n[7] Karakalpak spelling');
const before7 = fail;
// "Ariza"/"tegin" are correct Uzbek, so only the kaa dictionary and the
// Karakalpak HTML fallbacks are scanned.
const BANNED = [
  [/\bpenen\b/g,   'penen → menen'],
  [/[Aa]riza/g,    'Ariza → Arza'],
  [/[Tt]egin/g,    'tegin → biypul'],
  [/\bnoqat/g,     'noqat → noǵat'],
  [/tek\s+bireni/g,'tek bireni → tek bir <noun>'],
  [/qáles[aı]ńiz/g,'qálesańız → qáleseńiz'],
];
const kaaBlock = (() => {
  const i = i18nSrc.indexOf('var kaa = {');
  return i18nSrc.slice(i, i18nSrc.indexOf('\n  };', i));
})();
for (const [re, label] of BANNED) {
  const inDict = (kaaBlock.match(re) || []).length;
  const inHtml = (html.match(re) || []).length;
  if (inDict) bad(`kaa dictionary still uses ${label} (×${inDict})`);
  if (inHtml) bad(`index.html still uses ${label} (×${inHtml})`);
}
// and the Uzbek dictionary must keep its own, correct, "Ariza"
const uzBlock = (() => {
  const i = i18nSrc.indexOf('var uz = {');
  return i18nSrc.slice(i, i18nSrc.indexOf('\n  };', i));
})();
if (!/[Aa]riza/.test(uzBlock)) bad('uz dictionary lost "Ariza" — that word is correct Uzbek');
if (fail === before7) console.log('  ✓ corrected spellings held, Uzbek "Ariza" untouched');

console.log('\n' + (fail ? `FAILED — ${fail} problem(s)` : 'PASSED — no problems found') + '\n');
process.exit(fail ? 1 : 0);
