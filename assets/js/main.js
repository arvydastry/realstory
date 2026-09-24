/* Real Story – maketo interaktyvumas.
   Atkartoja Salient elgseną: antraštės būsena slenkant, pilno ekrano mobilus meniu,
   įėjimo animacijos, skirtukai, objektų filtras, atsiliepimų slinkiklis,
   „lite“ YouTube, formos patikra, lipni CTA juosta. */
(() => {
  const doc = document;
  const $ = (s, r = doc) => r.querySelector(s);
  const $$ = (s, r = doc) => [...r.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Antraštė: šešėlis paslinkus ---------- */
  const header = $('#header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobilus meniu ---------- */
  const menu = $('#mobile-menu');
  const openBtn = $('[data-menu-open]');
  let lastFocus = null;
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    openBtn && openBtn.setAttribute('aria-expanded', String(open));
    doc.body.style.overflow = open ? 'hidden' : '';
    if (open) { lastFocus = doc.activeElement; ($('[data-menu-close]', menu) || menu).focus(); }
    else if (lastFocus) lastFocus.focus();
  };
  openBtn && openBtn.addEventListener('click', () => setMenu(true));
  $$('[data-menu-close]').forEach((b) => b.addEventListener('click', () => setMenu(false)));
  doc.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) setMenu(false); });

  /* ---------- Įėjimo animacijos ---------- */
  const targets = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.04 });
    targets.forEach((el) => io.observe(el));
  } else targets.forEach((el) => el.classList.add('is-in'));
  // Atsarginis variantas: viskas, kas jau yra ekrane (pvz. po šuolio per #inkarą), parodoma iš karto
  const revealVisible = () => targets.forEach((el) => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in'); });
  revealVisible();
  window.addEventListener('hashchange', () => setTimeout(revealVisible, 50));
  let ticking = false;
  window.addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { revealVisible(); ticking = false; }); }, { passive: true });

  /* ---------- Skirtukai (pradžios puslapio pasiūlymai) ---------- */
  $$('[data-tabs]').forEach((tabs) => {
    const buttons = $$('[role="tab"]', tabs);
    const panels = buttons.map((b) => doc.getElementById(b.getAttribute('aria-controls')));
    const activate = (i) => {
      buttons.forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
      panels.forEach((p, j) => { if (p) p.hidden = i !== j; });
      panels[i] && $$('[data-reveal]', panels[i]).forEach((el) => el.classList.add('is-in'));
    };
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => activate(i));
      b.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
          activate(n); buttons[n].focus();
        }
      });
    });
    activate(0);
  });

  /* ---------- Objektų filtras (pasiūlymų puslapis) ---------- */
  const filterForm = $('[data-filters]');
  if (filterForm) {
    const cards = $$('[data-card]');
    const count = $('[data-count]');
    const empty = $('[data-empty]');
    const typeBtns = $$('[data-type]', filterForm);
    const params = new URLSearchParams(location.search);
    let type = params.get('tipas') || 'visi';
    const region = $('[name="regionas"]', filterForm);
    const price = $('[name="kaina"]', filterForm);
    const beds = $('[name="miegamieji"]', filterForm);
    if (params.get('regionas') && region) region.value = params.get('regionas');

    const apply = () => {
      typeBtns.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.type === type)));
      let n = 0;
      cards.forEach((c) => {
        const d = c.dataset;
        const p = Number(d.kaina);
        const [min, max] = (price.value || '0-999999999').split('-').map(Number);
        const ok = (type === 'visi' || d.tipas === type)
          && (!region.value || d.regionas === region.value)
          && (p >= min && p <= max)
          && (!beds.value || (beds.value === '4' ? Number(d.miegamieji) >= 4 : d.miegamieji === beds.value));
        c.hidden = !ok; if (ok) n += 1;
      });
      if (count) count.textContent = n === 1 ? 'Rastas 1 objektas' : `Rasta objektų: ${n}`;
      empty && empty.classList.toggle('is-visible', n === 0);
    };
    typeBtns.forEach((b) => b.addEventListener('click', () => { type = b.dataset.type; apply(); }));
    [region, price, beds].forEach((s) => s && s.addEventListener('change', apply));
    const reset = $('[data-reset]', filterForm);
    reset && reset.addEventListener('click', () => { type = 'visi'; region.value = ''; price.value = ''; beds.value = ''; apply(); });
    apply();
  }

  /* ---------- Atsiliepimų slinkiklis ---------- */
  $$('[data-slider]').forEach((slider) => {
    const track = $('.slider__track', slider);
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 16 : 300);
    $$('[data-prev]', slider).forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduced ? 'auto' : 'smooth' })));
    $$('[data-next]', slider).forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduced ? 'auto' : 'smooth' })));
  });

  /* ---------- Lite YouTube: iframe įkeliamas tik paspaudus ---------- */
  $$('[data-video]').forEach((box) => {
    const btn = $('.video__play', box);
    btn && btn.addEventListener('click', () => {
      const id = box.dataset.video;
      const iframe = doc.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      box.replaceChildren(iframe);
    });
  });

  /* ---------- Formos: patikra ir demonstracinis „išsiuntimas“ ---------- */
  $$('[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      $$('[required]', form).forEach((input) => {
        const field = input.closest('.field');
        let ok = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';
        if (ok && input.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        if (ok && input.type === 'tel') ok = input.value.replace(/\D/g, '').length >= 8;
        field && field.classList.toggle('is-invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) { const first = $('.is-invalid input, .is-invalid select', form); first && first.focus(); return; }
      const success = $('.form-success', form);
      $$('.field:not(.form-success)', form).forEach((f) => { f.style.display = 'none'; });
      if (success) success.classList.add('is-visible');
      else form.replaceChildren(Object.assign(doc.createElement('p'), { className: 'form-success is-visible', textContent: 'Ačiū! Užklausą gavome – susisieksime per 1 darbo dieną.' }));
    });
    $$('[required]', form).forEach((input) => input.addEventListener('input', () => { const f = input.closest('.field'); f && f.classList.remove('is-invalid'); }));
  });

  /* ---------- Lipni CTA juosta: slepiama, kai matoma kontaktų forma ar poraštė ---------- */
  const sticky = $('[data-sticky]');
  const hideWhen = $$('#kontaktai, .site-footer, .quick-form');
  if (sticky && hideWhen.length && 'IntersectionObserver' in window) {
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { en.isIntersecting ? seen.add(en.target) : seen.delete(en.target); });
      sticky.classList.toggle('is-hidden', seen.size > 0);
    }, { threshold: 0.15 });
    hideWhen.forEach((el) => io.observe(el));
  }

  /* ---------- Galerija: paspaudus miniatiūrą keičiamas pagrindinis vaizdas ---------- */
  const galleryMain = $('[data-gallery-main]');
  if (galleryMain) {
    $$('[data-gallery-thumb]').forEach((t) => t.addEventListener('click', (e) => {
      e.preventDefault();
      const img = $('img', t); const main = $('img', galleryMain);
      if (img && main) { const src = main.src; main.src = img.src; img.src = src; }
    }));
  }
})();
