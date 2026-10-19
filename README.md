# BERLIN — Nemis tili orayı · Nókis

Trilingual landing page for the German-language centre **@berlin_nukus**
(Nukus, Karakalpakstan). Static site — no build step, no dependencies, no framework.
Open `index.html` or drop the folder on any host.

```
index.html          all markup + inline SVG icon sprite (kaa; also the template)
uz/ ru/             generated language pages — node tools/build.mjs
sitemap.xml         generated, with hreflang; robots.txt likewise
assets/             avatar.jpg (logo/favicon/OG), brandenburg.png, sprechen.svg
css/tokens.css      palette, type scale, buttons, section headers
css/layout.css      header, hero, state-programme band, footer
css/sections.css    principles list, course index, routes, pricing, FAQ, form
css/motion.css      scroll reveal + the inverted reel panel and its scenes
js/i18n.js          three dictionaries (219 keys each) + switcher engine
js/motion.js        scroll reveal, scrollspy, sticky header
js/reel.js          the 30-second scene player (timeline, scrubbing, chapters)
js/app.js           CONFIG, nav, course index, slider, apply form
docs/               CLUOR quote: scope.html + cluor mark → *.pdf
tools/              QA + asset scripts (see "Checks") — not needed in production
```

---

## The quote (docs/)

`docs/scope.html` is the source of the client-facing quote — issued by **CLUOR**
to BERLIN, carrying CLUOR's mark and brand blue `#00669C` (sampled from
`cluor-mark-blue-1024.png`), not the site's violet. The document speaks in the
first person plural throughout; `pdf-check.py` fails the build if a singular
"я / устраняю / исправляю" creeps back in.

There are two editions sharing one stylesheet (`docs/scope.css`), so a styling
change never lands in only one of them:

| Source | PDF |
|---|---|
| `docs/scope.html` | `BERLIN-funkcional-i-stoimost.pdf` (русский) |
| `docs/scope-kaa.html` | `BERLIN-funkcional-hám-bahası.pdf` (qaraqalpaqsha) |

The PDFs are generated from the HTML, never edited by hand:

```bash
node tools/pdf.mjs        # renders both editions → docs/*.pdf
python tools/pdf-check.py # verifies both and rasterises the pages to .qa/
```

18 line items totalling **$325**, deployment included, plus two months of free
troubleshooting; changes after that are billed at the listed price of the
matching line item.

`tools/pdf.mjs` refuses to render if the items stop adding up to the stated
total **or if the two editions disagree with each other** — a quote saying $325
in Russian and something else in Karakalpak would be worse than no quote at all.
`pdf-check.py` re-verifies both from the finished PDFs.

Two notes if you regenerate it:

- The date is written into `scope.html` (`14 августа 2026`) — update it there.
- Chrome embeds the body text as Type3 glyph outlines rather than a named font.
  That looks identical on every machine and the text stays selectable and
  searchable (verified: 5 425 extractable characters), it just makes the file
  ~267 KB instead of ~60 KB. Not worth fixing.

---

## Design direction

Swiss-editorial on paper: white ground, near-black ink, **one** brand colour,
hairline rules, and hard contrast between huge headlines and small mono labels.
No gradients, no glassmorphism, no glow, no card grids — the things that make a
page read as generic.

Type scales fluidly all the way to 1920px rather than freezing at 1280 — a large
screen gets a proportionally larger page, not a small layout adrift in margins.
Running text is capped at ~75 rendered characters per line. Note that CSS `ch`
under-constrains real text badly (it measures the digit zero), and Latin packs
~13% more characters per line than Cyrillic, so every `max-width` here is tuned
against measured output in the widest language, not against the nominal unit.

**The colour is sampled from the brand's own Instagram avatar**, not invented:

| Token | Value | Where it came from |
|---|---|---|
| `--violet` | `#5B2AB2` | averaged saturated core of the avatar's Brandenburg Gate |
| `--violet-deep` | `#3A1A86` | its darkest violet, used for hover |
| `--violet-tint` | `#E4D8FC` | the light violet already present in the avatar |
| `--night` | `#120B26` | the inverted video panel |

Contrast of `--violet` on white is **8.7:1** — it works for body text, links and
buttons alike. Re-derive it any time with `node tools/palette.mjs`.

**Type** — IBM Plex Sans + IBM Plex Mono, with Noto Sans as fallback. Both Plex
faces carry full Cyrillic *and* Latin Extended, which Karakalpak needs for
`á ǵ ń ó ú ı` and Uzbek for `oʻ gʻ`. The sans/mono pairing is the design's
signature: mono carries every label, number, nav item and button.

**Imagery** — the hero uses `assets/brandenburg.png`, a cut-out photo of the
Brandenburg Gate, recoloured in the browser by the `#duotone` SVG filter defined
at the top of `index.html`: the photo is reduced to luminance, then that
luminance is mapped onto a violet ramp passing through the brand colour. Nothing
is baked into the file, so retinting the whole site means editing three
`tableValues` lines. `assets/sprechen.svg` (apply block) is hand-built SVG in the
same violet; preview it with `tools/svg-preview.html`.

The image is hidden below 760px — on a phone it is decorative and only pushes the
first real section a full screen further down.

Two things to know about the photo:

- **The source is only 360×360, and the hero now renders it at ~660px.** That is
  a ~1.8× upscale on a standard display and ~3.7× on a 2× screen, so it is
  visibly soft up close. The duotone hides this better than a full-colour photo
  would, but a larger source is the real fix: drop one in as
  `assets/brandenburg.png` and nothing else needs to change. Aim for ≥1400px wide.
- **It came from a stock library** (the original filename was a pngtree export).
  Check the licence covers commercial use before launch; that is not something I
  can verify.

The hero column split is the constraint on how large the image can get. See the
comment on `.hero__in` — `tools/measure.mjs` prints `h1col` / `h1max` / `wrap`
per language and flags the moment the headline starts wrapping.

**An Uzbek typography trap.** Uzbek `oʻ` / `gʻ` are normally written with U+02BB
MODIFIER LETTER TURNED COMMA. IBM Plex Sans *contains* that glyph, so a font
check reports no problem — but it is drawn as a free-standing modifier letter
with wide side bearings, which visually splits words: `to ʻldiring` instead of
`toʻldiring`. The Uzbek dictionary therefore uses U+2018 (and U+2019 for the
glottal stop), which sets tightly in this family. Keep using those when editing
Uzbek copy.

**No chapter numbers.** Section headers are a mono label + heading, nothing more.

**The course list is an index table, not a card grid.** Rows expand in place to
reveal the syllabus and a CTA, one at a time. On screens under 860px the table
reflows into stacked blocks rather than scrolling sideways.

---

## Confirmed data (supplied by the centre)

| What | Value |
|---|---|
| Phone | +998 93 712 14 96 |
| Telegram | https://t.me/TabisxanovNurasil |
| Address | Nukus, 23rd microdistrict, 6 |
| Price | 400 000 soʻm / month, offline only |
| **State programme «2+6»** | 8-month course; the student pays 2 months, the state covers 6 |
| Schedule | 4 lessons a week, 120 minutes each |
| Group size | 10–12 students |
| Level length | 3 months |
| Zero → B1 | 8 months |

**There is no online tuition.** The online course, the online price tier, the
format column in the course index and the format field in the form were all
removed; `tools/interact.mjs` now scans the rendered page in all three languages
and fails if the words *online / onlayn / онлайн / Zoom* reappear anywhere.

⚠️ **One arithmetic conflict to confirm:** three levels × 3 months = 9 months, but
zero → B1 is stated as 8. I kept both numbers as given — the course index shows
3 months per module, and the FAQ says "on average 8 months", explaining that the
pace is fast because lessons run 4×120 min and that the «2+6» programme is built
around exactly that 8-month span. If the real level length is shorter, correct
`prog.p1.dur`–`prog.p5.dur` in `js/i18n.js`.

## ⚠️ Still placeholders — replace before going live

| What | Where | Current value |
|---|---|---|
| Opening hours | `i18n.js` key `ftr.hours` (×3) | Mon–Fri 09–20, Sat 09–15 — **not supplied** |
| Teacher names & bios | `index.html` → `.team` | 3 invented profiles |
| Testimonials | `i18n.js` keys `res.q1`–`res.q4` | 4 invented quotes |
| "First lesson free" claim | `i18n.js` key `ap.l1` | my assumption — confirm it's true |

Teacher portraits are initial-blocks (`.tm__av`); swap each `div` for an `<img>`
when you have real photos.

**About the avatar:** Instagram only serves it at 150×150 through its signed CDN
URLs, so `assets/avatar.jpg` is 150px. That is crisp at the sizes used here
(38px header, 52px footer, 72px in the video title card). If you want it larger
anywhere, drop a higher-resolution original in over the same filename.

---

## Configuration

Top of `js/app.js`:

```js
var CONFIG = {
  telegram:     'https://t.me/TabisxanovNurasil',
  instagram:    'https://www.instagram.com/berlin_nukus/',
  phoneDisplay: '+998 93 712 14 96',
  phoneDial:    '+998937121496',
  formEndpoint: ''          // ← see below
};
```

### Where applications go

`formEndpoint` is empty by default, so the site works with **no backend**: a valid
submission is stored in `localStorage` (last 50), the success panel appears, and a
formatted lead summary is copied to the clipboard for pasting into Telegram.

Set it to a URL accepting a JSON `POST` to receive applications properly:

```json
{ "name": "...", "phone": "...", "level": "zero|A1|A2|B1|B2|unknown",
  "goal": "Ausbildung|Studium|Arbeit|Sprache",
  "time": "morning|day|evening", "note": "...", "program": "B1|2+6|Ausbildung|…",
  "lang": "kaa|uz|ru", "page": "...", "at": "ISO-8601" }
```

A Telegram bot `sendMessage`, Google Apps Script, or Formspree all fit. If the
request fails the lead is still stored locally and the Telegram hand-off still
happens, so nothing is silently lost. A hidden `company` honeypot drops bots.

---

## Languages

Qaraqalpaqsha (`kaa`, default) · Oʻzbekcha (`uz`) · Русский (`ru`).

Karakalpak is default because it is the centre's own Instagram bio language.

**Each language is its own page** so search engines index all three:
`/` (kaa) · `/uz/` · `/ru/`. The switcher segments are real links; clicking one
remembers the choice in `localStorage` (`berlin.lang`). Only the root page
redirects: a returning visitor with a saved choice, or a first-time visitor whose
browser is set to Russian/Uzbek, is sent to that language (crawlers are skipped).

Edit copy in the three dictionaries in `js/i18n.js`, then **rebuild**:

```bash
node tools/build.mjs   # → index.html, uz/index.html, ru/index.html, sitemap.xml, robots.txt
```

The build fills every `data-i18n` element from the dictionaries (so crawlers
see the real text, not a stale fallback) and regenerates the block between
`<!-- seo:start -->` and `<!-- seo:end -->` in each `<head>`: title, description,
canonical, hreflang, Open Graph and JSON-LD (`EducationalOrganization` +
`LocalBusiness`, `WebSite`, `WebPage`, `FAQPage` built from the FAQ keys).
Never edit `uz/` or `ru/` by hand. Search titles/descriptions are the
`meta.title` / `meta.desc` keys. The production URL is the `SITE` constant at
the top of `tools/build.mjs` (`https://www.berlinnukus.com`; the apex domain and
`nukusberlin.vercel.app` are duplicates that point their canonical here).

`assets/og.png` (1200×630 link preview for Telegram/Instagram/Google) is
rendered from `tools/og.html`; the command is in that file's header comment.
`vercel.json` turns on trailing slashes so `/ru` always becomes `/ru/` and the
relative paths resolve.

`tools/check.mjs` fails if the dictionaries ever drift apart or a key goes missing.

---

## The "video"

The 30-second reel is not a video file — it's six DOM scenes with a real transport
(play/pause, draggable scrubber, keyboard seeking, chapter chips, timeline ticks).
Zero bandwidth, crisp at any resolution, and it re-translates itself on language
change. Timings live in `DUR` at the top of `js/reel.js`.

It autoplays once when scrolled into view, pauses when scrolled away or the tab is
hidden, and never autoplays under `prefers-reduced-motion`. Swapping in a real MP4
later is a drop-in replacement for `.player__stage`.

---

## Checks

Serve the folder first (`python -m http.server 8899`), then:

```bash
node tools/check.mjs      # i18n key parity, icon sprite refs, anchor targets
node tools/shoot.mjs      # 5 viewport/language renders; asserts no console errors,
                          # no horizontal overflow, hero CTA above the fold
node tools/interact.mjs   # 30 checks: language switch, tabs, expandable rows,
                          # slider, validation, submit, honeypot
node tools/sections.mjs   # section screenshots into .qa/
node tools/measure.mjs    # type sizes, gutters and exact chars-per-line
                          # across 1920 → 390, flags any line over 80 chars
node tools/palette.mjs    # re-extract the brand palette from assets/avatar.jpg
```

`tools/` and `.qa/` are development aids; the site never references them.

Last run: all green. Verified in headless Chromium at 1440×900, 834×1112 and
390×844 in all three languages.
