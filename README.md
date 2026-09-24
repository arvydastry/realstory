# Real Story (realstory.lt) – naujo dizaino maketas

Naujo [realstory.lt](https://realstory.lt) dizaino maketas: šiuolaikiškas, lengvai skaitomas, pardaviminis
NT Ispanijoje tinklapis su akcentu į mobiliąją versiją ir greitą susisiekimą. Svetainė bus daroma su
WordPress ir **Salient** tema, todėl vizualinė kalba (įtrauktas suapvalintas hero, kortelės, pilnai
suapvalinti mygtukai, „Plus Jakarta Sans“ tipografija) perimta iš [Salient](https://themenectar.com/salient/),
o kiekviena sekcija turi atitikmenį Salient / WPBakery elementuose (žr. `salient-gidas.html`).

## Dvi versijos

| Versija | Kur | Charakteris |
|---|---|---|
| **V1** | `index.html` ir kiti šakniniai failai | Šviesi, rami, „Salient“ klasika: įtrauktas hero, baltas fonas, smėlio sekcijos |
| **V2** | `v2/index.html` ir kiti `v2/` failai | Tamsi, kontrastinga, daugiau judesio: pilno ekrano hero su parallax, pakaitomis juodos ir šviesios sekcijos, itališkas serifas akcentams, split-text antraštės, marquee juostos, skaičių animacijos, „spotlight“ kortelės, scroll-driven video, kontūrinis logotipas poraštėje |

Abi versijos naudoja tą patį turinį, duomenis ir puslapių struktūrą – skiriasi tik `assets/css/v2.css`,
`assets/js/v2-effects.js` ir V2 pradžios puslapio turinys `_body_v2/index.html`. Viršutinėje maketo juostoje yra
nuoroda persijungti tarp V1 ir V2. V2 efektų atitikmenys Salient temoje – gido 13 skyriuje.

## Peržiūra

```bash
cd realstory && python3 -m http.server 8791
```

Atidarykite `http://localhost:8791/index.html`. Failus galima atidaryti ir tiesiogiai.

| Failas | Turinys | WordPress atitikmuo |
|---|---|---|
| `index.html` | Pradžia: hero su forma, kodėl Real Story, pasiūlymai (skirtukai), regionai, 7 žingsniai, video, atsiliepimai, komanda, straipsniai, DUK, CTA, kontaktai | Front page (Salient / WPBakery) |
| `pasiulymai.html` | Visi 69 objektai su filtrais (tipas, regionas, kaina, miegamieji) | Portfolio archive (slug `istorija`) |
| `objektas.html` | Objekto puslapis: galerija, faktai, aprašymas, lipni CTA kortelė, panašūs objektai | Portfolio single |
| `komanda.html` | Real Story istorija, Kristijonas, Daiva | Page |
| `straipsniai.html` | 6 esami straipsniai | Blog archive (`/kategorija/straipsniai/`) |
| `kontaktai.html` | Kontaktų kortelės, žemėlapis, forma | Page |
| `salient-gidas.html` | Kaip maketą perkelti į WordPress su Salient: nustatymai, sekcijos, katalogas, forma, CSS | – |

Puslapiai surenkami iš `_parts/` (antraštė, poraštė; `*-v2.html` – V2 variantai) ir `_body/` (turinys;
`_body_v2/` – V2 pradžios puslapis), objektų kortelės – iš `_data/objektai.json`. Redaguodami keiskite
šaltinius ir paleiskite `python3 build.py` – surenkamos abi versijos.

## Dizaino sistema (trumpai)

- **Spalvos:** juoda `#111114`, raudona `#E2231A` (tik veiksmams – iš logotipo taško), šiltas smėlis `#F6F3EE`
  antrinėms sekcijoms, linijos `#E4DFD7`, mėlyna `#0F5C8A` informaciniams blokams.
- **Šriftai:** Plus Jakarta Sans 700 antraštėms, Inter 400/500/600 tekstui (abu Google Fonts, yra Salient).
- **Formos:** kampai 20 px kortelėms, 28 px hero ir CTA blokams, 999 px mygtukams, 14 px laukeliams.
- **Pardavimo elementai:** trumpa forma hero bloke, pilna forma kiekvieno puslapio apačioje (`#kontaktai`),
  lipni „Skambinti / Gauti pasiūlymą“ juosta mobiliesiems, WhatsApp ir telefonas visose kontaktų vietose,
  CTA kortelė objekto puslapyje, tamsios CTA juostos tarp sekcijų.
- **Mobile:** viskas 1 stulpeliu, ≥ 44 px paspaudžiami plotai, pilno ekrano meniu su CTA, filtrai slenka
  horizontaliai, hero forma lieka hero bloke.

## Ką verta žinoti peržiūrint

- Viršuje esanti tamsi juosta skirta tik maketui, į WordPress ji nekeliama.
- Formos duomenų nesiunčia – parodo patikrą ir padėkos žinutę.
- Nuotraukos: objektų, komandos ir straipsnių – iš esamos svetainės (`assets/img`, `assets/img/nt`);
  regionų – iš Pexels (`assets/img/pexels/ATTRIBUTION.md`). Komandos nuotraukos esamoje svetainėje yra
  tik 252×202 px, todėl makete atrodo neryškios – reikės naujų.
- Google Maps ir YouTube kraunami iš išorės, todėl peržiūrai reikia interneto.

## Laukiantys patikslinimai

Surašyti gido skyriuje „Patikslinti su klientu“: komandos nuotraukos, hero medžiaga, skaičiai (200+, 17 m.),
darbo laikas ir WhatsApp, DUK formuluotės, objektų duomenų švara prieš importą, straipsnio „Rekordinis
turistų skaičius“ pavadinimas, adresas žemėlapiui.
