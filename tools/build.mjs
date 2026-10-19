/* Pre-renders one static page per language so search engines index all three:
     index.html (kaa) · uz/index.html · ru/index.html
   plus sitemap.xml and robots.txt.

   index.html is both the template and the kaa output — the build is idempotent.
   Every [data-i18n] text and [data-i18n-attr] attribute is filled from the
   dictionaries in js/i18n.js, and the block between <!-- seo:start --> and
   <!-- seo:end --> (title, description, canonical, hreflang, Open Graph,
   JSON-LD) is regenerated. Run after any copy change:

     node tools/build.mjs
*/
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

/* The production address. Change this one line if the site moves to its own domain. */
const SITE = 'https://www.berlinnukus.com';

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const write = (p, s) => { mkdirSync(new URL('.', new URL(p, root)), { recursive: true }); writeFileSync(new URL(p, root), s); };

/* ── Dictionaries (same extraction as check.mjs) ── */
const i18nSrc = read('js/i18n.js');
const dicts = {};
for (const name of ['kaa', 'uz', 'ru']) {
  const start = i18nSrc.indexOf(`var ${name} = {`);
  let i = i18nSrc.indexOf('{', start), depth = 0, end = -1;
  for (let j = i; j < i18nSrc.length; j++) {
    if (i18nSrc[j] === '{') depth++;
    else if (i18nSrc[j] === '}') { depth--; if (depth === 0) { end = j + 1; break; } }
  }
  dicts[name] = new Function(`return ${i18nSrc.slice(i, end)}`)();
}

const PAGES = {
  kaa: { dir: '',    path: '/',    locale: 'kaa_UZ', hreflang: 'kaa' },
  uz:  { dir: 'uz/', path: '/uz/', locale: 'uz_UZ',  hreflang: 'uz'  },
  ru:  { dir: 'ru/', path: '/ru/', locale: 'ru_RU',  hreflang: 'ru'  }
};
const ORDER = ['kaa', 'uz', 'ru'];

const ADDRESS = {
  kaa: { street: '23-mikrorayon, 6',    city: 'Nókis', region: 'Qaraqalpaqstan' },
  uz:  { street: '23-mikrorayon, 6',    city: 'Nukus', region: 'Qoraqalpog‘iston' },
  ru:  { street: '23-й микрорайон, 6', city: 'Нукус', region: 'Каракалпакстан' }
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');

/* Relative link from one language page to another — works on Vercel (/) and
   on GitHub Pages (/nukusberlin/) alike. */
function rel(from, to) {
  const up = PAGES[from].dir ? '../' : '';
  return (up + PAGES[to].dir) || './';
}

function jsonLd(lang) {
  const d = dicts[lang], url = SITE + PAGES[lang].path, a = ADDRESS[lang];
  const faq = [];
  for (let n = 1; d['faq.q' + n]; n++) {
    faq.push({ '@type': 'Question', name: d['faq.q' + n],
               acceptedAnswer: { '@type': 'Answer', text: d['faq.a' + n] } });
  }
  const graph = [
    {
      '@type': ['EducationalOrganization', 'LocalBusiness'],
      '@id': SITE + '/#org',
      name: 'BERLIN',
      alternateName: ['Berlin Nukus', 'BERLIN — Nemis tili orayı', 'BERLIN — Nemis tili markazi', 'BERLIN — центр немецкого языка'],
      description: d['meta.desc'],
      url,
      logo: SITE + '/assets/avatar.jpg',
      image: SITE + '/assets/og.png',
      telephone: '+998937121496',
      priceRange: '400 000 UZS',
      currenciesAccepted: 'UZS',
      address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.city,
                 addressRegion: a.region, addressCountry: 'UZ' },
      areaServed: { '@type': 'City', name: a.city },
      knowsLanguage: ['de', 'kaa', 'uz', 'ru'],
      sameAs: ['https://www.instagram.com/berlin_nukus/', 'https://t.me/TabisxanovNurasil']
    },
    {
      '@type': 'WebSite',
      '@id': SITE + '/#site',
      url: SITE + '/',
      name: 'BERLIN',
      inLanguage: ORDER.map(l => PAGES[l].hreflang),
      publisher: { '@id': SITE + '/#org' }
    },
    {
      '@type': 'WebPage',
      '@id': url + '#page',
      url,
      name: d['meta.title'],
      description: d['meta.desc'],
      inLanguage: PAGES[lang].hreflang,
      isPartOf: { '@id': SITE + '/#site' },
      about: { '@id': SITE + '/#org' }
    }
  ];
  if (faq.length) graph.push({ '@type': 'FAQPage', '@id': url + '#faq', inLanguage: PAGES[lang].hreflang, mainEntity: faq });
  // "</" must not appear inside a <script> block
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/<\//g, '<\\/');
}

function seoBlock(lang) {
  const d = dicts[lang], url = SITE + PAGES[lang].path;
  const L = [];
  L.push(`<title>${esc(d['meta.title'])}</title>`);
  L.push(`<meta name="description" content="${escAttr(d['meta.desc'])}">`);
  L.push(`<meta name="robots" content="index, follow, max-image-preview:large">`);
  L.push(`<link rel="canonical" href="${url}">`);
  for (const l of ORDER) L.push(`<link rel="alternate" hreflang="${PAGES[l].hreflang}" href="${SITE + PAGES[l].path}">`);
  L.push(`<link rel="alternate" hreflang="x-default" href="${SITE}/">`);
  L.push(`<meta property="og:type" content="website">`);
  L.push(`<meta property="og:site_name" content="BERLIN">`);
  L.push(`<meta property="og:url" content="${url}">`);
  L.push(`<meta property="og:title" content="${escAttr(d['meta.title'])}">`);
  L.push(`<meta property="og:description" content="${escAttr(d['meta.desc'])}">`);
  L.push(`<meta property="og:image" content="${SITE}/assets/og.png">`);
  L.push(`<meta property="og:image:width" content="1200">`);
  L.push(`<meta property="og:image:height" content="630">`);
  L.push(`<meta property="og:locale" content="${PAGES[lang].locale}">`);
  for (const l of ORDER) if (l !== lang) L.push(`<meta property="og:locale:alternate" content="${PAGES[l].locale}">`);
  L.push(`<meta name="twitter:card" content="summary_large_image">`);
  if (lang === 'kaa') {
    // Root page only: send a returning visitor (saved choice) or a ru/uz browser
    // to their language. Crawlers are left alone so each URL keeps its own language.
    L.push(`<script>(function(){try{if(/bot|crawl|spider|slurp|google|yandex|bing|headless|lighthouse/i.test(navigator.userAgent))return;` +
      `var s=localStorage.getItem('berlin.lang'),n=(navigator.language||'').toLowerCase().slice(0,2),l=s||n;` +
      `if(l==='uz'||l==='ru')location.replace(l+'/'+location.hash);}catch(e){}})();</script>`);
  }
  L.push(`<script type="application/ld+json">\n${jsonLd(lang)}\n</script>`);
  return '<!-- seo:start — generated by tools/build.mjs, do not edit by hand -->\n' + L.join('\n') + '\n<!-- seo:end -->';
}

function render(template, lang) {
  const d = dicts[lang];
  let html = template;
  let filled = 0;

  html = html.replace(/<html\b[^>]*>/, `<html lang="${PAGES[lang].hreflang}" data-lang="${lang}">`);
  html = html.replace(/<!-- seo:start[\s\S]*?<!-- seo:end -->/, () => seoBlock(lang));

  // Text: only elements whose content is plain text (that is all i18n.js touches via textContent)
  html = html.replace(/<([a-z][a-z0-9]*)\b([^>]*?\sdata-i18n="([^"]+)"[^>]*)>([^<]*)<\/\1>/g, (m, tag, attrs, key) => {
    if (!(key in d)) throw new Error(`${lang}: missing key ${key}`);
    filled++;
    return `<${tag}${attrs}>${esc(d[key])}</${tag}>`;
  });

  // Attributes: data-i18n-attr="placeholder:key,aria-label:key2"
  html = html.replace(/<[a-z][^>]*\sdata-i18n-attr="([^"]+)"[^>]*>/g, (tagSrc, spec) => {
    for (const pair of spec.split(',')) {
      const [attr, key] = pair.split(':').map(s => s.trim());
      const v = escAttr(d[key]);
      const re = new RegExp(`(\\s${attr}=")[^"]*(")`);
      tagSrc = re.test(tagSrc) ? tagSrc.replace(re, (_, a, b) => a + v + b)
                               : tagSrc.replace(/\s*\/?>$/, (end) => ` ${attr}="${v}"${end}`);
    }
    return tagSrc;
  });

  // Language switcher: relative links, current page marked
  html = html.replace(/<a href="[^"]*" hreflang="([a-z]+)" lang="\1" data-set-lang="([a-z]+)"[^>]*>/g, (m, hl, l) =>
    `<a href="${rel(lang, l)}" hreflang="${PAGES[l].hreflang}" lang="${PAGES[l].hreflang}" data-set-lang="${l}"${l === lang ? ' aria-current="page"' : ''}>`);

  // Sub-pages live one directory down
  if (PAGES[lang].dir) html = html.replace(/(\s(?:src|href)=")(?=(?:css|js|assets|docs)\/)/g, '$1../');

  const total = (template.match(/\sdata-i18n="/g) || []).length;
  if (filled !== total) throw new Error(`${lang}: filled ${filled} of ${total} [data-i18n] elements — one has nested markup`);
  return html;
}

const template = read('index.html');
if (!template.includes('<!-- seo:start')) throw new Error('index.html has no <!-- seo:start --> … <!-- seo:end --> block');

for (const lang of ORDER) {
  const out = PAGES[lang].dir + 'index.html';
  write(out, render(template, lang));
  console.log(`  ✓ ${out}`);
}

const today = new Date().toISOString().slice(0, 10);
const alts = ORDER.map(l => `    <xhtml:link rel="alternate" hreflang="${PAGES[l].hreflang}" href="${SITE + PAGES[l].path}"/>`).join('\n')
  + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${ORDER.map(l => `  <url>
    <loc>${SITE + PAGES[l].path}</loc>
    <lastmod>${today}</lastmod>
${alts}
  </url>`).join('\n')}
</urlset>
`);
console.log('  ✓ sitemap.xml');

write('robots.txt', `User-agent: *
Allow: /
Disallow: /tools/
Disallow: /.qa/
Disallow: /docs/

Sitemap: ${SITE}/sitemap.xml
`);
console.log('  ✓ robots.txt');
