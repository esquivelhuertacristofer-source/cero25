/**
 * CERO25 — RENDER DE PORTADA
 * Toma la portada resuelta del store (lógica auto/curado/fallback ya aplicada)
 * y produce el markup EXACTO del diseño aprobado. Al terminar arranca la UI.
 */
(function () {
  'use strict';

  var S = window.CeroStore;
  var CATS = [], AUTS = [];

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function catNombre(slug) {
    var c = CATS.find(function (x) { return x.slug === slug; });
    return c ? c.nombre : slug;
  }
  function url(a) { return 'articulo.html?slug=' + encodeURIComponent(a.slug); }
  function autor(a) { return S.autorNombre(AUTS, a.autor); }

  /* media: foto real o póster de gradiente, según el artículo.
     eager=true para lo que está por encima del pliegue (hero, primeras tarjetas) */
  function media(a, ctx, eager) {
    if (a.img) {
      /* la clase de contexto (g-abs, g-thumb…) también posiciona a las fotos */
      return '<img' + (ctx ? ' class="' + ctx + '"' : '') +
        ' src="' + esc(a.img) + '" alt="' + esc(a.titulo) + '"' +
        (a.credito ? ' title="Foto: ' + esc(a.credito) + '"' : '') +
        ' loading="' + (eager ? 'eager' : 'lazy') + '">';
    }
    return '<div class="g-art ' + esc(a.art || 'g8') + (ctx ? ' ' + ctx : '') + '"' +
      ' data-glyph="' + esc(a.glyph || '') + '"></div>';
  }

  var playSvg = '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 7.5v9l7.5-4.5z" fill="currentColor" stroke="none"></path></svg></span>';
  var avatarR = '<span class="avatar avatar-r" aria-hidden="true">25</span>';

  /* ---------- secciones ---------- */

  function renderPills() {
    var el = document.getElementById('pills');
    el.innerHTML = '<a class="pill is-on" href="index.html">Lo último</a>' +
      CATS.map(function (c) {
        return '<a class="pill" href="seccion.html?cat=' + c.slug + '">' + esc(c.nombre) + '</a>';
      }).join('');
  }

  function renderHero(items) {
    var tints = ['#2a0d10', '#000000', '#1c1508', '#0b1c2a'];
    var arts = ['#7a1f28', '#08ba7e', '#d0a15b', '#2f6f9e'];
    document.getElementById('heroTrack').innerHTML = items.map(function (a, i) {
      return '<article class="slide" data-bg="' + tints[i % 4] + '">' +
        '<div class="slide-txt">' +
        '<span class="chip">' + esc(catNombre(a.categoria)) + '</span>' +
        '<h2 class="slide-h"><a href="' + url(a) + '">' + esc(a.titulo) + '</a></h2>' +
        '<div class="byline">' + avatarR + '<span>Por <b>' + esc(autor(a)) + '</b></span></div>' +
        '</div>' +
        '<div class="slide-art" style="--art:' + arts[i % 4] + '">' + media(a, null, true) + '</div>' +
        '</article>';
    }).join('');
  }

  function cardLatest(a) {
    var esVideo = a.tipo === 'video';
    return '<article class="card"><a class="card-media" href="' + url(a) + '">' +
      media(a) +
      '<span class="card-shade' + (esVideo ? ' card-shade-video' : '') + '"></span>' +
      (esVideo ? '<span class="badge-time">' + esc(a.duracion || '') + '</span>' + playSvg : '') +
      '<div class="card-body">' +
      '<span class="tag">' + esc(catNombre(a.categoria)) + '</span>' +
      '<h3 class="card-h">' + esc(a.titulo) + '</h3>' +
      '</div></a>' +
      '<div class="card-foot">' + avatarR +
      '<span>Por <a href="autor.html?id=' + esc(a.autor || '') + '"><b>' + esc(autor(a)) +
      '</b></a> <i class="dot">·</i> ' + S.minutosLectura(a) + '</span>' +
      '</div></article>';
  }

  /* Lo último recupera su variedad de tarjetas: 2 notas + boletín (tan) + vídeo */
  function cardBoletin() {
    return '<article class="card card-news"><a class="card-media" href="#boletin">' +
      '<div class="news-top">' +
      '<span class="news-kicker"><i></i>El Boletín</span>' +
      '<h3 class="card-h">Lo mejor de la semana, directo a tu correo</h3>' +
      '<div class="byline byline-sm">' + avatarR + '<span>Por <b>CERO25</b></span></div>' +
      '</div>' +
      '<div class="news-art"><div class="nl-mini-art">' +
      '<svg viewBox="0 0 48 40" aria-hidden="true">' +
      '<rect x="3" y="6" width="42" height="28" rx="4"></rect>' +
      '<path d="M5 9l19 14L43 9"></path></svg>' +
      '</div></div>' +
      '</a></article>';
  }
  function cardVideoFull(a) {
    return '<article class="card"><a class="card-media" href="' + url(a) + '">' +
      media(a) +
      '<span class="card-shade card-shade-video"></span>' +
      '<span class="badge-time">' + esc(a.duracion || '') + '</span>' + playSvg +
      '<div class="card-body">' +
      '<span class="tag tag-video">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="4"></rect><path d="M10.4 9.3v5.4l4.4-2.7z" fill="currentColor" stroke="none"></path></svg>' +
      esc(catNombre(a.categoria)) + '</span>' +
      '<h3 class="card-h">' + esc(a.titulo) + '</h3>' +
      '<div class="byline byline-sm byline-on-media">' +
      '<span class="avatar avatar-r avatar-green" aria-hidden="true">25</span>' +
      '<span><b>CERO25 Vídeo</b></span></div>' +
      '</div></a></article>';
  }
  function renderUltimo(items, video) {
    var html = items.slice(0, 2).map(cardLatest).join('') + cardBoletin();
    html += video ? cardVideoFull(video) : items.slice(2, 3).map(cardLatest).join('');
    document.getElementById('latest').innerHTML = html;
    /* primera imagen del rail: carga inmediata */
    var first = document.querySelector('#latest img');
    if (first) first.loading = 'eager';
  }

  function renderBanda(a) {
    if (!a) return;
    document.getElementById('banda').innerHTML =
      '<a class="band-in" href="' + url(a) + '">' + media(a, 'g-abs') +
      '<div class="band-txt">' +
      '<span class="chip chip-light">' + esc(catNombre(a.categoria)) + '</span>' +
      '<h2 class="band-h">' + esc(a.titulo) + '</h2>' +
      '<p class="band-p">Por ' + esc(autor(a)) + ' · ' + S.minutosLectura(a) + '</p>' +
      '</div></a>';
  }

  function renderLecturas(enlaces, tarjetas) {
    document.getElementById('noteworthy').innerHTML =
      '<div class="reads-list"><h2>Lecturas destacadas</h2>' +
      enlaces.map(function (a) {
        return '<a class="read-item" href="' + url(a) + '">' + esc(a.titulo) + '</a>';
      }).join('') + '</div>' +
      tarjetas.map(function (a) {
        return '<a class="note-card" href="' + url(a) + '">' + media(a, 'g-abs') +
          '<div class="nc-txt"><span class="tag">' + esc(catNombre(a.categoria)) + '</span>' +
          '<h3 class="card-h">' + esc(a.titulo) + '</h3></div></a>';
      }).join('');
  }

  function renderVideos(lista, destacado, banner) {
    var el = document.getElementById('videosMega');
    var filas = lista.map(function (a) {
      return '<a class="vid-row" href="' + url(a) + '">' + media(a, 'g-thumb') +
        '<h4>' + esc(a.titulo) + '</h4></a>';
    }).join('');
    var dest = destacado
      ? '<a class="vid-featured" href="' + url(destacado) + '">' + media(destacado, 'g-abs') + playSvg +
        '<div class="vf-txt"><h3 class="card-h">' + esc(destacado.titulo) + '</h3>' +
        '<div class="byline byline-sm">' + avatarR + '<span><b>' + esc(destacado.duracion || 'Vídeo') + ' · ' + esc(autor(destacado)) + '</b></span></div>' +
        '</div></a>'
      : '';
    var ban = banner
      ? '<a class="vm-banner" href="' + url(banner) + '">' + media(banner, 'g-abs') +
        '<h3 class="card-h">' + esc(banner.titulo) + '</h3></a>'
      : '';
    el.innerHTML = '<p class="vm-label">Vídeos</p>' +
      '<div class="vm-grid"><div class="vid-list">' + filas + '</div>' + dest + '</div>' + ban;
  }

  function cardStudy(a) {
    return '<a class="study-card" href="' + url(a) + '">' + media(a, 'g-1610') +
      '<div class="sc-txt"><span class="tag">' + esc(catNombre(a.categoria)) + '</span>' +
      '<h3>' + esc(a.titulo) + '</h3></div></a>';
  }

  function renderRail(idTitulo, idRail, rail) {
    document.getElementById(idTitulo).textContent = rail.titulo;
    document.getElementById(idRail).innerHTML = rail.items.map(cardStudy).join('');
  }

  function renderFeature(id, a) {
    if (!a) return;
    document.getElementById(id).innerHTML =
      '<a class="feature-xl" href="' + url(a) + '">' + media(a, 'g-abs') +
      '<div class="fx-txt"><h2 class="fx-h">' + esc(a.titulo) + '</h2>' +
      '<div class="byline">' + avatarR + '<span>Por <b>' + esc(autor(a)) + '</b> · ' + S.minutosLectura(a) + '</span></div>' +
      '</div></a>';
  }

  function renderMinis(items) {
    document.getElementById('miniRow').innerHTML = items.map(function (a) {
      return '<a class="mini-card" href="' + url(a) + '">' +
        '<div><h3>' + esc(a.titulo) + '</h3>' +
        '<span class="mc-meta">' + esc(catNombre(a.categoria)) + ' · ' + S.tiempoRelativo(a.fecha) + '</span></div>' +
        media(a, 'g-sq') + '</a>';
    }).join('');
  }

  function renderShorts(items) {
    document.getElementById('shorts').innerHTML = items.map(function (a) {
      return '<a class="short-card" href="' + url(a) + '">' + media(a, 'g-abs') + playSvg +
        '<h3>' + esc(a.titulo) + '</h3></a>';
    }).join('');
  }

  function renderProgramas(items) {
    document.getElementById('pods').innerHTML = items.map(function (p) {
      var cover = p.img
        ? '<img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '"' +
          (p.credito ? ' title="Foto: ' + esc(p.credito) + '"' : '') + ' loading="lazy">'
        : '<div class="g-art ' + esc(p.art) + ' g-pod" data-glyph="' + esc(p.glyph) + '"></div>';
      /* si el programa tiene enlace propio, abre ahí; si no, a la sección */
      var destino = p.url
        ? esc(p.url) + '" target="_blank" rel="noopener'
        : 'seccion.html?cat=podcast';
      return '<a class="pod-color ' + esc(p.color) + '" href="' + destino + '">' +
        cover + '<h3>' + esc(p.nombre) + '</h3>' +
        (p.host ? '<p class="pod-host">' + esc(p.host) + '</p>' : '') + '</a>';
    }).join('');
  }

  function renderGrandes(items) {
    document.getElementById('reads').innerHTML = items.map(cardStudy).join('');
  }

  /* ---------- arranque ---------- */
  Promise.all([S.categorias(), S.autores(), S.portadaResuelta()])
    .then(function (r) {
      CATS = r[0]; AUTS = r[1];
      var p = r[2];
      renderPills();
      renderHero(p.hero);
      renderUltimo(p.ultimo, p.videosLista[0] || null);
      renderBanda(p.banda);
      renderLecturas(p.lecturasEnlaces, p.lecturasTarjetas);
      renderVideos(p.videosLista, p.videoDestacado, p.videoBanner);
      renderRail('rail1Titulo', 'study', p.rail1);
      renderFeature('feature1', p.feature1);
      renderMinis(p.minis);
      renderFeature('feature2', p.feature2);
      renderRail('rail2Titulo', 'lakers', p.rail2);
      renderShorts(p.shorts);
      renderProgramas(p.programas);
      renderGrandes(p.grandes);
      if (window.initRingerUI) window.initRingerUI();
    })
    .catch(function (e) {
      console.error('CERO25 render:', e);
    });
})();
