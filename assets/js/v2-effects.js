/* V2 efektai (papildo main.js): split-text antraštės, marquee, skaičių animacija,
   parallax, „spotlight“ kortelės, magnetiniai mygtukai. Visi gerbia prefers-reduced-motion. */
(() => {
  const doc = document;
  const $$ = (s, r = doc) => [...r.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Split-text: žodžiai į <span class="w"><span>…</span></span> (Salient: Split Line Heading) */
  $$('[data-split]').forEach((h) => {
    const nodes = [...h.childNodes];
    h.textContent = '';
    let i = 0;
    const wrapWords = (text, parent) => {
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { parent.append(' '); return; }
        const w = doc.createElement('span'); w.className = 'w';
        const inner = doc.createElement('span'); inner.textContent = part; inner.style.setProperty('--i', i++);
        w.append(inner); parent.append(w);
      });
    };
    nodes.forEach((n) => {
      if (n.nodeType === 3) wrapWords(n.textContent, h);
      else { const clone = n.cloneNode(false); wrapWords(n.textContent, clone); h.append(clone); }
    });
    h.querySelectorAll('.w > span').forEach((s) => { const p = s.closest('.accent'); if (p) s.style.setProperty('--i', s.style.getPropertyValue('--i')); });
    if (reduced || !('IntersectionObserver' in window)) { h.classList.add('is-in'); return; }
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { h.classList.add('is-in'); io.disconnect(); } }), { threshold: 0.1 });
    io.observe(h);
  });
  /* Atsarginis variantas split antraštėms: kas jau ekrane – rodoma iš karto ir slenkant */
  const splits = $$('[data-split]');
  const showSplits = () => splits.forEach((h) => { if (!h.classList.contains('is-in') && h.getBoundingClientRect().top < window.innerHeight * 0.95) h.classList.add('is-in'); });
  showSplits(); setTimeout(showSplits, 400);
  window.addEventListener('scroll', showSplits, { passive: true });
  window.addEventListener('load', showSplits);

  /* Marquee: turinys dubliuojamas, kad kilpa būtų be tarpo */
  $$('.marquee__track, .tmarquee__track').forEach((t) => { t.innerHTML += t.innerHTML; });

  /* Skaičių animacija (Salient: Milestone) */
  const counters = $$('[data-counter]');
  if (counters.length) {
    const run = (el) => {
      const end = parseFloat(el.dataset.counter); const suffix = el.dataset.suffix || ''; const dur = 1400; const t0 = performance.now();
      const step = (t) => { const p = Math.min(1, (t - t0) / dur); const e = 1 - Math.pow(1 - p, 3); el.firstChild.textContent = Math.round(end * e) + suffix; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if (reduced || !('IntersectionObserver' in window)) counters.forEach((c) => { c.firstChild.textContent = c.dataset.counter + (c.dataset.suffix || ''); });
    else { const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.5 }); counters.forEach((c) => io.observe(c)); }
  }

  /* Parallax: hero fonas ir regionų nuotraukos (Salient: Parallax background) */
  const px = $$('[data-parallax]');
  if (px.length && !reduced) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      px.forEach((el) => {
        const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return;
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        // hero fonas: poslinkis nuo puslapio viršaus (scrollY), kad įkėlus nebūtų šuolio; kiti – nuo ekrano centro
        const offset = el.dataset.parallaxFrom === 'top' ? -window.scrollY * speed : (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* Spotlight: pelės pozicija kortelėje */
  if (fine) {
    $$('.spot').forEach((el) => el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
    /* Magnetiniai mygtukai */
    if (!reduced) $$('.btn--red, .btn--white, .btn--ink').forEach((b) => {
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); const x = (e.clientX - r.left - r.width / 2) * 0.18; const y = (e.clientY - r.top - r.height / 2) * 0.3; b.style.transform = `translate(${x}px, ${y}px) scale(1.03)`; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }
})();
