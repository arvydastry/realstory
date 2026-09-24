#!/usr/bin/env python3
"""Surenka puslapius iš _parts/ (antraštė, poraštė) ir _body/ (turinys).
Objektų kortelės generuojamos iš _data/objektai.json.
Paleisti: python3 build.py"""
import json, re, pathlib, html

ROOT = pathlib.Path(__file__).parent
parts = {p.stem: (ROOT / '_parts' / p.name).read_text(encoding='utf-8') for p in (ROOT / '_parts').iterdir() if p.suffix == '.html'}
objektai = json.loads((ROOT / '_data' / 'objektai.json').read_text(encoding='utf-8'))

PAGES = {
    'index': ('Nekilnojamasis turtas Ispanijoje lietuviams', 'Real Story – NT Marbelos ir Alikantės regionuose: karšti pasiūlymai, nauji kompleksai ir pilnas įsigijimo paketas. Nemokama konsultacija.'),
    'pasiulymai': ('NT pasiūlymai Ispanijoje', 'Karšti NT pasiūlymai ir nauji kompleksai Costa del Sol ir Costa Blanca regionuose. Filtruokite pagal regioną, kainą ir miegamųjų skaičių.'),
    'objektas': ('Išskirtinis 5 miegamųjų penthauzas su jūros vaizdais Benalmadenoje', 'Penthauzas su privačiu paplūdimiu Benalmadenoje – 290 m², 5 miegamieji, 949 000 €.'),
    'komanda': ('Komanda', 'Kristijonas ir Daiva – Real Story komanda Marbelos ir Alikantės regionuose.'),
    'straipsniai': ('Straipsniai apie NT Ispanijoje', 'Mokesčiai, NIE numeris, brokeris ar partneris – naudingi straipsniai perkantiems būstą Ispanijoje.'),
    'kontaktai': ('Kontaktai', 'Susisiekite su Real Story: telefonas, WhatsApp, el. paštas, Marbella – Puerto Banús.'),
}

def fmt_price(n):
    return f"{n:,}".replace(',', ' ') + ' €' if n else 'Kaina paklausus'

def card(o, delay=0):
    badge = '<span class="badge badge--red"><i class="ph ph-fire" aria-hidden="true"></i>Karštas pasiūlymas</span>' if o['tipas'] == 'karstas' else '<span class="badge badge--ink"><i class="ph ph-buildings" aria-hidden="true"></i>Naujas kompleksas</span>'
    facts = [f'<span><i class="ph ph-ruler" aria-hidden="true"></i>{o["plotas"]} m²</span>'] if o['plotas'] else []
    if o.get('miegamieji'): facts.append(f'<span><i class="ph ph-bed" aria-hidden="true"></i>{o["miegamieji"]} mieg.</span>')
    if o.get('vonios'): facts.append(f'<span><i class="ph ph-bathtub" aria-hidden="true"></i>{o["vonios"]} von.</span>')
    reg_key = 'alikante' if 'Alik' in o['regionas'] else 'marbela'
    return f'''<a class="card" href="objektas.html" data-card data-tipas="{o['tipas']}" data-regionas="{reg_key}" data-kaina="{o['kaina']}" data-miegamieji="{o.get('miegamieji') or ''}" data-reveal style="--d:{delay}">
  <div class="card__media"><img src="{o['img']}" alt="" loading="lazy" width="1200" height="800"><div class="badges">{badge}</div></div>
  <div class="card__body">
    <span class="card__region"><i class="ph ph-map-pin" aria-hidden="true"></i>{o['regionas']}</span>
    <h3>{html.escape(o['pav'])}</h3>
    <div class="card__facts">{''.join(facts)}</div>
    <div class="card__foot"><span class="card__price">{fmt_price(o['kaina'])}</span><span class="card__go"><i class="ph ph-arrow-up-right" aria-hidden="true"></i></span></div>
  </div>
</a>'''

def cards(filter_fn, limit=None, start=0):
    items = [o for o in objektai if filter_fn(o)]
    if limit: items = items[start:start + limit]
    return '\n'.join(card(o, i % 3) for i, o in enumerate(items))

def render(page, v2=False):
    title, desc = PAGES[page]
    src = ROOT / '_body_v2' / f'{page}.html'
    if not (v2 and src.exists()): src = ROOT / '_body' / f'{page}.html'
    body = src.read_text(encoding='utf-8')
    body = body.replace('{{CARDS:karstas}}', cards(lambda o: o['tipas'] == 'karstas', 6))
    body = body.replace('{{CARDS:naujas}}', cards(lambda o: o['tipas'] == 'naujas', 6))
    body = body.replace('{{CARDS:visi}}', cards(lambda o: True))
    body = body.replace('{{CARDS:kiti}}', cards(lambda o: o['tipas'] == 'karstas' and o['id'] != 12, 3, 8))
    sfx = '-v2' if v2 else ''
    out = parts['head' + sfx] + parts['header' + sfx] + body + parts['footer' + sfx]
    out = out.replace('{{TITLE}}', title).replace('{{DESC}}', desc)
    out = re.sub(r'\{\{CUR:(\w+)\}\}', lambda m: 'aria-current="page"' if m.group(1) == page else '', out)
    if v2:
        out = out.replace('"assets/', '"../assets/').replace('href="salient-gidas.html"', 'href="../salient-gidas.html#v2"')
        dest = ROOT / 'v2' / f'{page}.html'
    else:
        dest = ROOT / f'{page}.html'
    dest.write_text(out, encoding='utf-8')
    print('✓', dest.relative_to(ROOT))

for p in PAGES: render(p)
for p in PAGES: render(p, v2=True)
