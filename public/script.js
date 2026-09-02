/* ============================================================
   CERO25 — interacciones de portada
   Se ejecuta vía initRingerUI() DESPUÉS de que render.js construya el DOM.
   ============================================================ */
window.initRingerUI = function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- sticky header shadow ---------- */
  var hdr = $('#hdr');
  var onScroll = function () { hdr.classList.toggle('is-stuck', window.scrollY > 4); };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- search placeholder ---------- */
  var input = $('#search-input');
  input.addEventListener('input', function () {
    input.closest('.search').classList.toggle('has-val', input.value.length > 0);
  });

  /* ---------- drag-to-scroll (pills + hero + rails) ---------- */
  /* Arrastre con ratón. Clave: NO capturar el puntero hasta que haya arrastre
     real — con captura inmediata el navegador entrega el click al rail y los
     enlaces de las tarjetas dejan de navegar. */
  function dragScroll(el) {
    var down = false, captured = false, startX = 0, startLeft = 0, moved = 0, pid = null;

    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;      // el scroll táctil nativo es mejor
      down = true; captured = false; moved = 0; pid = e.pointerId;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    });

    el.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      if (moved > 4 && !captured) {
        captured = true;
        el.classList.add('is-drag');
        try { el.setPointerCapture(pid); } catch (_) {}
      }
      if (captured) el.scrollLeft = startLeft - dx;
    });

    var end = function () {
      if (!down) return;
      down = false;
      el.classList.remove('is-drag');
      if (captured) { try { el.releasePointerCapture(pid); } catch (_) {} }
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);

    el.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }

  /* ---------- category pills ---------- */
  var pills = $('#pills');
  dragScroll(pills);
  $$('.pill', pills).forEach(function (p) {
    p.addEventListener('click', function (e) {
      e.preventDefault();
      $$('.pill', pills).forEach(function (o) { o.classList.remove('is-on'); });
      p.classList.add('is-on');
      p.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });

  /* ---------- hero carousel ---------- */
  var track  = $('#heroTrack');
  var slides = $$('.slide', track);
  var dotsEl = $('#heroDots');
  var prev   = $('#heroPrev');
  var next   = $('#heroNext');
  var index  = 1;                    // arranca en la slide destacada, como el sitio
  var AUTOPLAY_MS = 7000;
  var timer = null;

  // tint del contenedor por slide
  slides.forEach(function (s) {
    if (s.dataset.bg) s.style.background = s.dataset.bg;
  });

  // dots
  slides.forEach(function (_, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Destacado ' + (i + 1) + ' de ' + slides.length);
    b.addEventListener('click', function () { go(i); restart(); });
    dotsEl.appendChild(b);
  });
  var dots = $$('button', dotsEl);

  /* Blindaje: con 0 o 1 destacados no hay carrusel que animar.
     Sin esto, posOf(1) reventaba y se caía TODO el JS de la portada
     (buscador, menú, rails y boletín incluidos). */
  if (slides.length < 2) {
    if (prev) prev.style.display = 'none';
    if (next) next.style.display = 'none';
    if (dotsEl) dotsEl.style.display = 'none';
    index = 0;
  }

  // scrollLeft que deja la slide i centrada (scroll-snap-align: center)
  function posOf(i) {
    var s = slides[i];
    if (!s) return 0;
    return (s.offsetLeft - track.offsetLeft) - (track.clientWidth - s.offsetWidth) / 2;
  }

  function go(i) {
    if (!slides.length) return;
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: posOf(index), behavior: 'smooth' });
    sync();
  }

  function sync() {
    dots.forEach(function (d, i) { d.setAttribute('aria-selected', String(i === index)); });
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  }

  // índice derivado del scroll real (drag / rueda / touch)
  var raf = null;
  track.addEventListener('scroll', function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      var mid = track.scrollLeft + track.clientWidth / 2;
      var best = 0, bestD = Infinity;
      slides.forEach(function (s, i) {
        var c = s.offsetLeft - track.offsetLeft + s.offsetWidth / 2;
        var d = Math.abs(c - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best !== index) { index = best; sync(); }
    });
  }, { passive: true });

  prev.addEventListener('click', function () { go(index - 1); restart(); });
  next.addEventListener('click', function () { go(index + 1); restart(); });

  document.addEventListener('keydown', function (e) {
    if ($('#menu').hasAttribute('hidden') === false) return;
    if (e.key === 'ArrowLeft')  { go(index - 1); restart(); }
    if (e.key === 'ArrowRight') { go(index + 1); restart(); }
  });

  dragScroll(track);

  function tick() { go(index >= slides.length - 1 ? 0 : index + 1); }
  function start() { if (!timer && slides.length > 1) timer = setInterval(tick, AUTOPLAY_MS); }
  function stop()  { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  $('.hero').addEventListener('pointerenter', stop);
  $('.hero').addEventListener('pointerleave', start);
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });

  // posición inicial sin animación
  requestAnimationFrame(function () {
    track.scrollLeft = posOf(index);
    sync();
    start();
  });
  addEventListener('resize', function () { track.scrollLeft = posOf(index); });

  /* ---------- rails ---------- */
  $$('.rail').forEach(dragScroll);
  $$('.rail-arrow').forEach(function (btn) {
    var rail = document.getElementById(btn.dataset.rail);
    btn.addEventListener('click', function () {
      var atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8;
      rail.scrollBy({ left: atEnd ? -rail.scrollWidth : rail.clientWidth * 0.86, behavior: 'smooth' });
    });
  });

  /* ---------- menu overlay ---------- */
  var burger = $('#burger');
  var menu   = $('#menu');
  function setMenu(open) {
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
    document.body.classList.toggle('no-scroll', open);
  }
  burger.addEventListener('click', function () { setMenu(menu.hidden); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); }
  });

  /* ---------- imágenes que fallan -> fondo de color ---------- */
  $$('img').forEach(function (img) {
    img.addEventListener('error', function () { img.style.visibility = 'hidden'; });
  });

  /* ---------- boletín: guarda en el store ---------- */
  var nlForm = $('#nlForm');
  if (nlForm && window.CeroStore) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = nlForm.querySelector('input');
      var msg = $('#nlMsg');
      CeroStore.suscribir(input.value.trim()).then(function (r) {
        msg.hidden = false;
        msg.textContent = r && r.ya ? 'Ese correo ya estaba suscrito.' : '¡Listo! Bienvenido al Boletín.';
        input.value = '';
      });
    });
  }
};
