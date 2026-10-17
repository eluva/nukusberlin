# Verify the generated quotes (ru + kaa) and rasterise their pages for review.
# Run after tools/pdf.mjs.  Needs PyMuPDF (import name: fitz).
import io, os, re, sys
import fitz

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, 'docs')
QA = os.path.join(ROOT, '.qa')
os.makedirs(QA, exist_ok=True)

EDITIONS = [
    dict(lang='ru', src='scope.html', pdf='BERLIN-funkcional-i-stoimost.pdf',
         must=['CLUOR', 'Исполнитель работ', 'Заказчик', 'BERLIN — Nemis tili orayı',
               'Функционал сайта и стоимость работ', 'Итого', '$325',
               'Поддержка', 'двух месяцев', 'бесплатно устраняем', 'команда CLUOR',
               'Изменения и доработки', 'Что не входит в сумму'],
         # first-person singular must never come back
         singular=r'(?<![А-Яа-яЁё])(я|мною|мой|моя|моё|мои)(?![А-Яа-яЁё])'
                  r'|устраняю|исправляю|делал я'),
    dict(lang='kaa', src='scope-kaa.html', pdf='BERLIN-funkcional-hám-bahası.pdf',
         must=['CLUOR', 'Jumıstı orınlawshı', 'Buyırtpashı', 'BERLIN — Nemis tili orayı',
               'Sayt funkcionalı hám jumıs bahası', 'Jámi', '$325',
               'Qollaw', 'eki ay dawamında', 'tegin dúzetemiz', 'CLUOR komandası',
               'Ózgerisler hám qosımsha jumıslar', 'Summaǵa kirmeytuǵın nárseler'],
         singular=r'\bmen\b|dúzetemen|jiberemen',
         # spellings corrected by the client — must not creep back
         banned=[('penen', 'menen'), ('ariza', 'arza'), ('tegin', 'biypul'),
                 ('noqat', 'noǵat'), ('tek bireni', 'tek bir <noun>'),
                 ('qálesańiz', 'qáleseńiz'), ('qálesıńiz', 'qáleseńiz')]),
]

fail = 0
def check(label, ok, extra=''):
    global fail
    print(('  ok   ' if ok else '  FAIL ') + label + (' — ' + extra if extra else ''))
    if not ok:
        fail += 1

# Karakalpak dotless ı uppercases to plain I, so casefolding an uppercased
# heading yields "i" while the source still has "ı". Fold them together, or the
# comparison reports a mismatch on text that is in fact rendered correctly.
DOTLESS = str.maketrans({'ı': 'i', 'İ': 'i', 'I': 'i'})
norm = lambda s: re.sub(r'\s+', ' ', s).casefold().translate(DOTLESS)
all_prices = {}

for ed in EDITIONS:
    pdf = os.path.join(DOCS, ed['pdf'])
    print('\n══ %s — %s' % (ed['lang'].upper(), ed['pdf']))

    doc = fitz.open(pdf)
    text = '\n'.join(p.get_text() for p in doc)
    flat = norm(text)
    has = lambda s: norm(s) in flat

    print('[1] Document')
    check('opens and has pages', doc.page_count > 0, '%d pages' % doc.page_count)
    check('text layer is extractable', len(text) > 3000, '%d chars' % len(text))
    check('file size is sane', 50_000 < os.path.getsize(pdf) < 3_000_000,
          '%.0f KB' % (os.path.getsize(pdf) / 1024))

    print('[2] Prices')
    html = io.open(os.path.join(DOCS, ed['src']), encoding='utf-8').read()
    prices = [int(m) for m in re.findall(r'<td class="price">\$(\d+)</td>', html)]
    items, stated = prices[:-1], prices[-1]
    all_prices[ed['lang']] = (items, stated)
    check('%d line items sum to the total' % len(items), sum(items) == stated,
          '$%d vs $%d' % (sum(items), stated))
    check('total is $325', stated == 325, '$%d' % stated)
    check('every item price appears in the PDF', all(has('$%d' % p) for p in set(items)))

    print('[3] Required content')
    for s in ed['must']:
        check('contains "%s"' % s, has(s))

    print('[4] Spelling')
    if not ed.get('banned'):
        print('  (n/a)')
    for wrong, right in ed.get('banned', []):
        check('no "%s" (use "%s")' % (wrong, right), norm(wrong) not in flat)

    print('[5] Speaks as "we"')
    hits = re.findall(ed['singular'], text, re.IGNORECASE)
    flat_hits = sorted({h if isinstance(h, str) else h[0] for h in hits} - {''})
    check('no first-person singular', not flat_hits, 'found: %s' % flat_hits if flat_hits else '')

    print('[6] Page images')
    for i, page in enumerate(doc):
        page.get_pixmap(dpi=110).save(os.path.join(QA, 'pdf-%s-p%d.png' % (ed['lang'], i + 1)))
    print('  rendered %d page image(s) → .qa/pdf-%s-p*.png' % (doc.page_count, ed['lang']))
    doc.close()

print('\n══ Cross-edition')
(ri, rt), (ki, kt) = all_prices['ru'], all_prices['kaa']
check('both editions list identical prices', ri == ki,
      '' if ri == ki else '%s vs %s' % (ri, ki))
check('both editions state the same total', rt == kt, '$%d vs $%d' % (rt, kt))

print('\n' + ('FAILED — %d check(s)' % fail if fail else 'ALL PDFs OK') + '\n')
sys.exit(1 if fail else 0)
