# Karakalpak spelling corrections supplied by the client.
# Scoped per file: "Ariza" is also correct Uzbek, so the uz dictionary
# must never be touched.
import io, re, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# (pattern, replacement, human label)
FIXES = [
    (r'penen',                       'menen',  'penen → menen'),
    (r'qáles[aı]ńiz',                'qáleseńiz', 'qálesańız → qáleseńiz'),
    (r'Ariza',                       'Arza',   'Ariza → Arza'),
    (r'ariza',                       'arza',   'ariza → arza'),
    (r'tegin',                       'biypul', 'tegin → biypul'),
    (r'Tegin',                       'Biypul', 'Tegin → Biypul'),
    (r'noqat',                       'noǵat',  'noqat → noǵat'),
    # "only one" — the noun has to agree with what is being counted
    (r'tek(\s+)bireni(\s+)ashıq turadı',      r'tek\1bir kurs\2ashıq turadı',      'tek bireni → tek bir kurs'),
    (r'tek(\s+)bireni(\s+)ashıq bolıp qaladı', r'tek\1bir soraw\2ashıq bolıp qaladı', 'tek bireni → tek bir soraw'),
]

def apply(text, label):
    total = 0
    for pat, rep, name in FIXES:
        text, n = re.subn(pat, rep, text)
        if n:
            print('  %-34s ×%d' % (name, n))
            total += n
    if not total:
        print('  (nothing to change)')
    return text, total

def whole_file(path):
    print('\n%s' % path)
    s = io.open(path, encoding='utf-8').read()
    s, n = apply(s, path)
    io.open(path, 'w', encoding='utf-8').write(s)
    return n

def kaa_block_only(path, start_marker, end_marker):
    """Only rewrite the Karakalpak slice of a multi-language file."""
    print('\n%s  [Karakalpak section only]' % path)
    s = io.open(path, encoding='utf-8').read()
    i = s.index(start_marker)
    j = s.index(end_marker, i)
    head, blk, tail = s[:i], s[i:j], s[j:]
    blk, n = apply(blk, path)
    io.open(path, 'w', encoding='utf-8').write(head + blk + tail)
    return n

total = 0
total += whole_file('docs/scope-kaa.html')
total += whole_file('index.html')                       # HTML fallbacks are Karakalpak
total += kaa_block_only('js/i18n.js', 'var kaa = {', '\n  };')
total += kaa_block_only('docs/cover-letter.md', '## Qaraqalpaqsha', '## Русский')

print('\n%d replacement(s) total' % total)

# Guard: Uzbek "Ariza" must have survived untouched
s = io.open('js/i18n.js', encoding='utf-8').read()
i = s.index('var uz = {'); j = s.index('\n  };', i)
uz_ariza = len(re.findall(r'[Aa]riza', s[i:j]))
i = s.index('var kaa = {'); j = s.index('\n  };', i)
kaa_ariza = len(re.findall(r'[Aa]riza(?!.)', s[i:j]))
print('uz dictionary still has Ariza ×%d  (must stay 7)' % uz_ariza)
print('kaa dictionary Ariza leftovers ×%d  (must be 0)' % len(re.findall(r'[Aa]riza', s[i:j])))
