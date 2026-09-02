/**
 * CERO25 ADMIN — panel de redacción (tema claro)
 * Panel · Artículos · Editor (preview en vivo) · Portada (curación) ·
 * Pódcast · Autores · Boletín · Ajustes. Roles admin/editor.
 */
(function () {
  'use strict';
  var S = window.CeroStore;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var main = $('#mainView');
  var SESION = null;
  var GRADS = ['g1','g2','g3','g4','g5','g6','g7','g8','g9','g10','g11','g12'];

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg; t.hidden = false;
    requestAnimationFrame(function () { t.classList.add('show'); });
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }
  function icono(nombre) {
    var I = {
      doc: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 16h6"/>',
      ojo: '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>',
      video: '<rect x="3" y="5" width="13" height="14" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>',
      rayo: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
      fantasma: '<path d="M12 3a7 7 0 00-7 7v11l2.5-2 2.5 2 2.5-2 2.5 2 2.5-2 2.5 2V10a7 7 0 00-7-7z"/><circle cx="9.5" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="10" r="1" fill="currentColor" stroke="none"/>'
    };
    return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (I[nombre] || I.doc) + '</svg>';
  }

  /* ================= auth ================= */
  function mostrarLogin() {
    $('#loginView').hidden = false;
    $('#appView').hidden = true;
    $('#loginDemo').hidden = !S.esDemo();
  }
  function mostrarApp() {
    $('#loginView').hidden = true;
    $('#appView').hidden = false;
    $('#userName').textContent = SESION.nombre;
    $('#userRol').textContent = SESION.rol;
    $('#userAvatar').textContent = (SESION.nombre || '25').split(' ')
      .map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
    document.querySelectorAll('[data-solo-admin]').forEach(function (el) {
      el.style.display = SESION.rol === 'admin' ? '' : 'none';
    });
    enrutar();
  }

  $('#loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    S.login($('#loginEmail').value.trim(), $('#loginPass').value)
      .then(function (ses) { SESION = ses; mostrarApp(); })
      .catch(function (err) {
        var el = $('#loginError');
        el.hidden = false; el.textContent = err.message;
      });
  });
  $('#btnLogout').addEventListener('click', function () {
    S.logout().then(function () { SESION = null; location.hash = ''; mostrarLogin(); });
  });

  /* ================= router ================= */
  function enrutar() {
    var hash = location.hash.replace(/^#\//, '') || 'panel';
    var partes = hash.split('/');
    var vista = partes[0];
    if (!SESION) return;
    if (SESION.rol !== 'admin' && ['autores', 'boletin', 'ajustes'].indexOf(vista) >= 0) vista = 'panel';
    document.querySelectorAll('.side-nav a').forEach(function (a) {
      a.classList.toggle('on', a.dataset.view === vista);
    });
    var V = {
      panel: vPanel, articulos: vArticulos, editor: vEditor, portada: vPortada,
      medios: vMedios, papelera: vPapelera,
      programas: vProgramas, autores: vAutores, boletin: vBoletin, ajustes: vAjustes
    };
    (V[vista] || vPanel)(partes[1]);
  }
  window.addEventListener('hashchange', enrutar);

  /* ================= panel ================= */
  function vPanel() {
    Promise.all([S.articulos({ incluirBorradores: true }), S.suscriptores()]).then(function (r) {
      var arts = r[0], subs = r[1];
      var pub = arts.filter(function (a) { return a.estado === 'publicado'; });
      var bor = arts.filter(function (a) { return a.estado === 'borrador'; });
      var vid = pub.filter(function (a) { return a.tipo === 'video' || a.tipo === 'short'; });
      main.innerHTML =
        '<div class="vista-head"><div><h1>Hola, ' + esc(SESION.nombre.split(' ')[0]) + '</h1>' +
        '<p class="vista-sub">' + (S.esDemo()
          ? 'Modo demo: los cambios viven en este navegador. En Ajustes tienes los pasos a producción.'
          : 'Conectado a producción.') + '</p></div>' +
        '<a class="btn-acc" href="#/editor/nuevo">+ Nuevo artículo</a></div>' +
        '<div class="stats">' +
        '<div class="stat acc"><div class="stat-top">' + icono('doc') + '</div><b>' + pub.length + '</b><span class="lbl">Publicados</span></div>' +
        '<div class="stat"><div class="stat-top">' + icono('rayo') + '</div><b>' + bor.length + '</b><span class="lbl">Borradores</span></div>' +
        '<div class="stat"><div class="stat-top">' + icono('video') + '</div><b>' + vid.length + '</b><span class="lbl">Vídeos y shorts</span></div>' +
        '<div class="stat"><div class="stat-top">' + icono('mail') + '</div><b>' + subs.length + '</b><span class="lbl">Suscriptores</span></div>' +
        '</div>' +
        graficaVistas(arts) +
        '<p class="seccion-titulo">' + icono('rayo') + ' Lo más reciente</p>' +
        tablaArticulos(arts.slice(0, 6));
      atarTabla();
    });
  }

  /* gráfica de barras SVG: vistas de los últimos 14 días (sin librerías) */
  function graficaVistas(arts) {
    var dias = [], hoy = new Date();
    for (var i = 13; i >= 0; i--) {
      var d = new Date(hoy.getTime() - i * 86400000);
      dias.push(d.toISOString().slice(0, 10));
    }
    var serie = dias.map(function (dia) {
      return arts.reduce(function (sum, a) { return sum + ((a.vd || {})[dia] || 0); }, 0);
    });
    var max = Math.max.apply(null, serie.concat([1]));
    var W = 700, H = 120, bw = W / 14;
    var barras = serie.map(function (v, i) {
      var h = Math.round((v / max) * (H - 24));
      return '<rect x="' + (i * bw + 6) + '" y="' + (H - h - 18) + '" width="' + (bw - 12) +
        '" height="' + Math.max(h, 2) + '" rx="4" fill="' + (i === 13 ? '#ff0a3c' : '#e6e6ec') + '">' +
        '<title>' + dias[i].slice(5) + ': ' + v + ' vistas</title></rect>' +
        (i % 2 === 1 ? '<text x="' + (i * bw + bw / 2) + '" y="' + (H - 4) +
          '" text-anchor="middle" font-size="9" fill="#8f8fa0">' + dias[i].slice(8) + '/' + dias[i].slice(5, 7) + '</text>' : '');
    }).join('');
    var total14 = serie.reduce(function (a, b) { return a + b; }, 0);
    var top = arts.filter(function (a) { return a.vd; })
      .map(function (a) {
        var s = 0; dias.forEach(function (d) { s += (a.vd[d] || 0); });
        return { t: a.titulo, n: s };
      })
      .filter(function (x) { return x.n > 0; })
      .sort(function (a, b) { return b.n - a.n; }).slice(0, 3);
    return '<div class="card-form" style="margin-bottom:24px">' +
      '<h3>Lecturas — últimos 14 días · ' + total14.toLocaleString('es') + ' en total</h3>' +
      '<div style="overflow-x:auto"><svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;min-width:480px;display:block">' + barras + '</svg></div>' +
      (top.length
        ? '<p class="vista-sub">Top de la quincena: ' + top.map(function (x, i) {
            return (i + 1) + '. ' + esc(x.t.slice(0, 40)) + ' (' + x.n + ')';
          }).join(' · ') + '</p>'
        : '<p class="vista-sub">Aún sin lecturas registradas — abre artículos en el sitio y vuelve.</p>') +
      '</div>';
  }

  /* ================= artículos ================= */
  function tablaArticulos(arts) {
    if (!arts.length) {
      return '<div class="vacio">' + icono('fantasma') +
        '<span>Todavía no hay artículos aquí.</span>' +
        '<a class="btn-acc" href="#/editor/nuevo">Crear el primero</a></div>';
    }
    return '<div class="tabla-wrap"><table class="tabla"><thead><tr>' +
      '<th>Título</th><th>Tipo</th><th>Categoría</th><th>Estado</th><th>Vistas</th><th>Fecha</th><th></th>' +
      '</tr></thead><tbody>' +
      arts.map(function (a) {
        var programado = a.estado === 'publicado' && new Date(a.fecha).getTime() > Date.now();
        var estado = programado
          ? '<span class="pill-estado bor">Programado</span>'
          : '<span class="pill-estado ' + (a.estado === 'publicado' ? 'pub">Publicado' : 'bor">Borrador') + '</span>';
        return '<tr>' +
          '<td class="celda-titulo">' + esc(a.titulo) +
          '<small>/' + esc(a.slug) + '</small></td>' +
          '<td><span class="pill-tipo">' + esc(a.tipo) + '</span></td>' +
          '<td>' + esc(a.categoria) + '</td>' +
          '<td>' + estado + '</td>' +
          '<td style="font-variant-numeric:tabular-nums">' + (a.vistas || 0).toLocaleString('es') + '</td>' +
          '<td style="white-space:nowrap">' + S.tiempoRelativo(a.fecha) + '</td>' +
          '<td><div class="acciones">' +
          '<a class="btn-mini" href="#/editor/' + a.id + '">Editar</a>' +
          '<a class="btn-mini" href="../articulo.html?slug=' + esc(a.slug) + '" target="_blank" rel="noopener">Ver</a>' +
          '<button class="btn-mini" data-duplicar="' + a.id + '">Duplicar</button>' +
          '<button class="btn-mini peligro" data-borrar="' + a.id + '">Borrar</button>' +
          '</div></td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function atarTabla() {
    main.querySelectorAll('[data-borrar]').forEach(function (b) {
      b.addEventListener('click', function () {
        S.aPapelera(b.dataset.borrar).then(function () {
          toast('Enviado a la papelera — recuperable desde el menú'); enrutar();
        });
      });
    });
    main.querySelectorAll('[data-duplicar]').forEach(function (b) {
      b.addEventListener('click', function () {
        S.articulos({ incluirBorradores: true }).then(function (arts) {
          var a = arts.find(function (x) { return x.id === b.dataset.duplicar; });
          if (!a) return;
          var copia = JSON.parse(JSON.stringify(a));
          delete copia.id; delete copia.slug;
          copia.titulo = a.titulo + ' (copia)';
          copia.estado = 'borrador';
          copia.fecha = new Date().toISOString();
          copia.vistas = 0;
          S.guardarArticulo(copia).then(function (nuevo) {
            toast('Duplicado como borrador');
            location.hash = '#/editor/' + nuevo.id;
          });
        });
      });
    });
  }

  function vArticulos() {
    S.articulos({ incluirBorradores: true }).then(function (arts) {
      main.innerHTML =
        '<div class="vista-head"><div><h1>Artículos</h1>' +
        '<p class="vista-sub">' + arts.length + ' en total. Publicado = visible en el sitio; borrador = solo aquí.</p></div>' +
        '<a class="btn-acc" href="#/editor/nuevo">+ Nuevo artículo</a></div>' +
        '<div class="tabla-filtros">' +
        '<input id="fQ" placeholder="Buscar por título…">' +
        '<select id="fTipo"><option value="">Todos los tipos</option>' +
        '<option>articulo</option><option>video</option><option>short</option></select>' +
        '<select id="fEstado"><option value="">Todos los estados</option>' +
        '<option>publicado</option><option>borrador</option></select>' +
        '</div><div id="tablaZona">' + tablaArticulos(arts) + '</div>';
      atarTabla();
      function filtrar() {
        var q = $('#fQ').value.toLowerCase(), t = $('#fTipo').value, e = $('#fEstado').value;
        var out = arts.filter(function (a) {
          return (!q || a.titulo.toLowerCase().indexOf(q) >= 0) &&
                 (!t || a.tipo === t) && (!e || a.estado === e);
        });
        $('#tablaZona').innerHTML = tablaArticulos(out);
        atarTabla();
      }
      ['fQ', 'fTipo', 'fEstado'].forEach(function (id) {
        $('#' + id).addEventListener('input', filtrar);
      });
    });
  }

  /* ================= editor ================= */
  var PORTADA = null;
  function vEditor(id) {
    Promise.all([S.categorias(), S.autores(), S.articulos({ incluirBorradores: true }), S.portadaConfig()])
    .then(function (r) {
      var cats = r[0], auts = r[1];
      PORTADA = r[3];
      var a = r[2].find(function (x) { return x.id === id || x.slug === id; }) ||
        { tipo: 'articulo', estado: 'borrador', categoria: cats[0].slug, autor: auts[0].id, cuerpo: [] };

      var fechaLocal = a.fecha ? a.fecha.slice(0, 16) : new Date().toISOString().slice(0, 16);

      main.innerHTML =
        '<div class="vista-head"><div><h1>' + (a.id ? 'Editar artículo' : 'Nuevo artículo') + '</h1>' +
        '<p class="vista-sub">La vista previa de la derecha es la tarjeta real del sitio. Guarda con el botón o Ctrl+S.</p></div></div>' +
        '<div class="editor-grid"><div class="card-form">' +
        '<label class="fld"><span>Título</span><input id="eTitulo" maxlength="90" value="' + esc(a.titulo || '') + '"></label>' +
        '<p class="contador" id="cTitulo"></p>' +
        '<div class="fila-2">' +
        '<label class="fld"><span>Tipo</span><select id="eTipo">' +
        ['articulo', 'video', 'short'].map(function (t) {
          return '<option' + (a.tipo === t ? ' selected' : '') + '>' + t + '</option>';
        }).join('') + '</select></label>' +
        '<label class="fld"><span>Categoría</span><select id="eCat">' +
        cats.map(function (c) {
          return '<option value="' + c.slug + '"' + (a.categoria === c.slug ? ' selected' : '') + '>' + esc(c.nombre) + '</option>';
        }).join('') + '</select></label></div>' +
        '<div class="fila-2">' +
        '<label class="fld"><span>Autor</span><select id="eAutor">' +
        auts.map(function (x) {
          return '<option value="' + x.id + '"' + (a.autor === x.id ? ' selected' : '') + '>' + esc(x.nombre) + '</option>';
        }).join('') + '</select></label>' +
        '<label class="fld"><span>Duración <span class="hint">(vídeo/short)</span></span><input id="eDur" value="' + esc(a.duracion || '') + '" placeholder="12 min · 0:58"></label>' +
        '</div>' +
        '<label class="fld"><span>Enlace de vídeo o audio <span class="hint">(pega la URL de YouTube o Spotify)</span></span>' +
        '<input id="eMedia" value="' + esc(a.media || '') + '" placeholder="https://www.youtube.com/watch?v=… · https://open.spotify.com/episode/…"></label>' +
        '<p class="contador" id="cMedia"></p>' +
        '<div class="fila-2">' +
        '<label class="fld"><span>Slug <span class="hint">(URL)</span></span><input id="eSlug" value="' + esc(a.slug || '') + '" placeholder="se-genera-del-titulo"></label>' +
        '<label class="fld"><span>Fecha</span><input id="eFecha" type="datetime-local" value="' + esc(fechaLocal) + '"></label>' +
        '</div>' +
        '<label class="fld"><span>Extracto <span class="hint">(también es la descripción SEO)</span></span>' +
        '<textarea id="eExtracto" rows="2" maxlength="200">' + esc(a.extracto || '') + '</textarea></label>' +
        '<p class="contador" id="cExtracto"></p>' +
        '<label class="fld"><span>Cuerpo <span class="hint">(bloques separados por línea en blanco)</span></span>' +
        '<div class="toolbar" id="eToolbar">' +
        '<button type="button" data-ins="**texto**" title="Negrita"><b>B</b></button>' +
        '<button type="button" data-ins="[texto](https://)" title="Enlace">🔗</button>' +
        '<button type="button" data-bloque="## " title="Subtítulo">H2</button>' +
        '<button type="button" data-bloque="> " title="Cita">❝</button>' +
        '<button type="button" data-imgpicker="1" title="Imagen de la biblioteca">Img</button>' +
        '<button type="button" data-bloque="!yt:VIDEOID" title="Vídeo de YouTube">YT</button>' +
        '</div>' +
        '<textarea id="eCuerpo" rows="10">' + esc((a.cuerpo || []).join('\n\n')) + '</textarea></label>' +
        '<p class="contador">Formato: **negrita** · [enlace](url) · "## " subtítulo · "&gt; " cita · !img:url|pie · !yt:id</p>' +
        '</div>' +

        '<div class="editor-aside">' +
        '<div class="card-form"><h3>' + icono('ojo') + ' Cómo se verá en portada</h3>' +
        '<div class="tarjeta-preview"><div class="tp-media" id="tpMedia"></div>' +
        '<div class="tp-txt"><span class="tp-tag" id="tpTag"></span>' +
        '<h4 class="tp-h" id="tpTitulo"></h4>' +
        '<p class="tp-meta" id="tpMeta"></p></div></div>' +
        '<button type="button" class="btn-ghost" id="eVerCompleta" style="width:100%">' +
        'Ver artículo completo</button>' +
        '</div>' +
        '<div class="card-form"><h3>' + icono('rayo') + ' Dónde aparecerá</h3>' +
        '<div id="eUbicacion"></div></div>' +
        '<div class="card-form"><h3>Imagen destacada</h3>' +
        '<div class="media-preview" id="ePreview"></div>' +
        '<p class="media-info" id="eMediaInfo"></p>' +
        '<button type="button" class="btn-ghost" id="eBiblio" style="width:100%">Elegir de la biblioteca</button>' +
        '<label class="media-drop">…o subir nueva — se optimiza sola a 1280px' +
        '<input type="file" id="eFile" accept="image/*" hidden></label>' +
        '<h3>…o póster de gradiente</h3>' +
        '<div class="grad-pick" id="eGrads">' +
        GRADS.map(function (g) {
          return '<button type="button" class="' + g + (a.art === g ? ' on' : '') + '" data-g="' + g + '" aria-label="' + g + '"></button>';
        }).join('') + '</div>' +
        '<label class="fld"><span>Glifo del póster</span><input id="eGlyph" maxlength="6" value="' + esc(a.glyph || '') + '" placeholder="GG · 8BIT · OP"></label>' +
        '</div>' +
        '<div class="card-form">' +
        '<label class="fld"><span>Estado</span><select id="eEstado">' +
        '<option value="borrador"' + (a.estado === 'borrador' ? ' selected' : '') + '>Borrador</option>' +
        '<option value="publicado"' + (a.estado === 'publicado' ? ' selected' : '') + '>Publicado</option>' +
        '</select></label>' +
        '<button class="btn-acc" id="eGuardar">Guardar</button>' +
        '<button class="btn-ghost" id="ePreview">Guardar y previsualizar</button>' +
        '<a class="btn-ghost" href="#/articulos">Cancelar</a>' +
        '<p class="media-info" id="eAutosave"></p>' +
        '</div></div></div>';

      var img = a.img || null, art = a.art || null;
      var catNombre = {}; cats.forEach(function (c) { catNombre[c.slug] = c.nombre; });
      var autNombre = {}; auts.forEach(function (x) { autNombre[x.id] = x.nombre; });

      function contadores() {
        var t = $('#eTitulo').value.length, x = $('#eExtracto').value.length;
        $('#cTitulo').textContent = t + '/75 recomendado para SEO';
        $('#cTitulo').className = 'contador' + (t > 75 ? ' pasa' : '');
        $('#cExtracto').textContent = x + '/160 recomendado para SEO';
        $('#cExtracto').className = 'contador' + (x > 160 ? ' pasa' : '');
        /* valida el enlace pegado y dice qué reproductor saldrá */
        var mEl = $('#cMedia'), val = $('#eMedia').value.trim();
        if (!val) { mEl.textContent = ''; mEl.className = 'contador'; }
        else {
          var det = S.detectarMedia(val);
          if (det) {
            var nombre = det.tipo === 'youtube' ? 'YouTube'
              : det.tipo === 'vimeo' ? 'Vimeo'
              : 'Spotify (' + det.clase + ')';
            mEl.textContent = '✓ Reproductor de ' + nombre + ' — se mostrará arriba del artículo';
            mEl.className = 'contador';
            mEl.style.color = 'var(--ok)';
          } else {
            mEl.textContent = '⚠ No reconozco ese enlace. Usa una URL de YouTube, Spotify o Vimeo.';
            mEl.className = 'contador pasa';
            mEl.style.color = '';
          }
        }
      }

      function previews() {
        contadores();
        /* tarjeta en vivo */
        var tp = $('#tpMedia');
        if (img) tp.innerHTML = '<img src="' + esc(img) + '" alt="">';
        else if (art) tp.innerHTML = '<div class="grad ' + art + '" style="position:absolute;inset:0"><span style="padding:8px">' + esc($('#eGlyph').value || '') + '</span></div>';
        else tp.innerHTML = '';
        $('#tpTag').textContent = catNombre[$('#eCat').value] || '';
        $('#tpTitulo').textContent = $('#eTitulo').value || 'Título del artículo';
        $('#tpMeta').textContent = 'Por ' + (autNombre[$('#eAutor').value] || '') +
          ($('#eDur').value ? ' · ' + $('#eDur').value : '');
        /* imagen destacada */
        var pv = $('#ePreview');
        if (img) { pv.innerHTML = '<img src="' + esc(img) + '" alt="">'; medir(img); }
        else if (art) { pv.innerHTML = '<div class="' + art + '" style="position:absolute;inset:0"></div>'; $('#eMediaInfo').className = 'media-info'; $('#eMediaInfo').textContent = 'Póster de gradiente ' + art; }
        else { pv.textContent = 'Sin imagen'; $('#eMediaInfo').textContent = ''; }
      }
      function medir(src) {
        var im = new Image();
        im.onload = function () {
          var info = $('#eMediaInfo');
          var r = im.naturalWidth / im.naturalHeight;
          info.className = 'media-info ' + (r < 1.2 ? 'warn' : 'bien');
          info.textContent = im.naturalWidth + '×' + im.naturalHeight +
            (r < 1.2 ? ' — vertical: no sirve para hero, banda ni features'
                     : ' — panorámica: sirve para todos los formatos');
        };
        im.src = src;
      }

      /* ---- dónde aparecerá: cruza el artículo con las reglas de la portada ---- */
      function calcularUbicacion() {
        var zona = $('#eUbicacion');
        var estado = $('#eEstado') ? $('#eEstado').value : a.estado;
        var tipo = $('#eTipo').value;
        var fechaVal = $('#eFecha').value ? new Date($('#eFecha').value) : new Date();
        var parrafos = $('#eCuerpo').value.split(/\n\s*\n/).filter(function (p) { return p.trim(); }).length;

        function fila(txt, tono) {
          var col = tono === 'no' ? 'var(--ink-3)' : tono === 'cur' ? 'var(--acc-text)' : 'var(--ok)';
          var punto = tono === 'no' ? '○' : '●';
          return '<p style="margin:0 0 7px;font-size:13px;display:flex;gap:8px;align-items:flex-start">' +
            '<span style="color:' + col + ';flex:0 0 auto">' + punto + '</span>' +
            '<span style="color:' + (tono === 'no' ? 'var(--ink-3)' : 'var(--ink)') + '">' + txt + '</span></p>';
        }

        if (estado === 'borrador') {
          zona.innerHTML = fila('<b>No aparece en el sitio.</b> Es un borrador: solo tú lo ves.', 'no') +
            fila('Cambia el estado a <b>Publicado</b> para que entre a la portada.', 'no');
          return;
        }
        if (fechaVal.getTime() > Date.now()) {
          zona.innerHTML = fila('<b>Programado.</b> Aparecerá automáticamente el ' +
            fechaVal.toLocaleString('es', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) + '.', 'cur');
          return;
        }

        var html = '';
        /* zonas automáticas */
        if (tipo === 'short') {
          html += fila('<b>Shorts</b> — entra solo si es de los 5 más recientes.');
        } else {
          html += fila('<b>Lo último</b> — entra solo si es de los más recientes.');
          if (tipo === 'video') html += fila('<b>Vídeos</b> — aparece en la lista del bloque negro.');
          if (tipo === 'articulo' && parrafos >= 3) html += fila('<b>Grandes lecturas</b> — tiene ' + parrafos + ' párrafos (mínimo 3).');
          if (tipo === 'articulo' && parrafos < 3) html += fila('<b>Grandes lecturas</b> — necesita 3 párrafos; hoy tiene ' + parrafos + '.', 'no');
        }
        html += fila('<b>Su sección</b> — siempre visible en la página de ' + (catNombre[$('#eCat').value] || 'su categoría') + '.');
        html += fila('<b>Lecturas destacadas</b> — si llega a ser de los 6 más leídos.', 'no');

        /* zonas curadas: ¿está elegido en algún hueco? */
        if (a.id && PORTADA) {
          var nombres = { hero: 'Hero (carrusel)', banda: 'Banda destacada', feature1: 'Feature XL 1',
            feature2: 'Feature XL 2', rail1: 'Rail temático 1', rail2: 'Rail temático 2',
            minis: 'Fila mini', lecturas: 'Lecturas destacadas (tarjeta)' };
          var puesto = [];
          ['hero', 'banda', 'feature1', 'feature2', 'rail1', 'rail2', 'minis'].forEach(function (k) {
            var s = PORTADA[k] && PORTADA[k].slots;
            if (s && s.indexOf(a.id) >= 0) puesto.push(nombres[k] + ' · hueco ' + (s.indexOf(a.id) + 1));
          });
          if (PORTADA.lecturas && PORTADA.lecturas.tarjetas && PORTADA.lecturas.tarjetas.indexOf(a.id) >= 0) {
            puesto.push(nombres.lecturas);
          }
          if (PORTADA.videos) {
            if (PORTADA.videos.destacado === a.id) puesto.push('Vídeo destacado');
            if (PORTADA.videos.banner === a.id) puesto.push('Banner de vídeos');
          }
          puesto.forEach(function (p) { html += fila('<b>' + p + '</b> — elegido a mano.', 'cur'); });
          if (!puesto.length) {
            html += fila('No está elegido en ninguna zona destacada. Ve a <b>Portada</b> para ponerlo en el hero o un rail.', 'no');
          }
        } else if (!a.id) {
          html += fila('Guarda el artículo para poder elegirlo en las zonas destacadas.', 'no');
        }
        zona.innerHTML = html;
      }

      /* ---- vista previa del artículo completo ---- */
      function verCompleta() {
        var cuerpo = $('#eCuerpo').value.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
        var det = S.detectarMedia($('#eMedia').value.trim());
        function bloque(p) {
          var e = esc(p);
          e = e.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
          if (p.indexOf('## ') === 0) return '<h2 style="font-size:24px;font-weight:800;margin:1.3em 0 .5em">' + esc(p.slice(3)) + '</h2>';
          if (p.indexOf('> ') === 0) return '<blockquote style="border-left:4px solid #ff0a3c;padding:.4em 0 .4em 1em;margin:1.3em 0;font-size:19px;font-weight:700">' + esc(p.slice(2)) + '</blockquote>';
          if (p.indexOf('!img:') === 0) {
            var pt = p.slice(5).split('|');
            return '<figure style="margin:1.4em 0"><img src="' + esc(pt[0].trim()) + '" style="width:100%;border-radius:12px">' +
              (pt[1] ? '<figcaption style="font-size:12.5px;color:#8f8fa0;font-style:italic;margin-top:7px">' + esc(pt[1]) + '</figcaption>' : '') + '</figure>';
          }
          if (p.indexOf('!yt:') === 0) return '<div style="background:#111;color:#fff;border-radius:12px;padding:30px;text-align:center;margin:1.4em 0">▶ Vídeo de YouTube</div>';
          return '<p style="margin:0 0 1.2em">' + e + '</p>';
        }
        var cabecera = det
          ? '<div style="background:#111;color:#fff;border-radius:14px;padding:44px;text-align:center;margin-bottom:1.4em">▶ Reproductor de ' +
            (det.tipo === 'youtube' ? 'YouTube' : det.tipo === 'vimeo' ? 'Vimeo' : 'Spotify') + '</div>'
          : (img ? '<img src="' + esc(img) + '" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:14px;margin-bottom:1.4em">'
                 : '<div class="' + (art || 'g8') + '" style="aspect-ratio:16/9;border-radius:14px;margin-bottom:1.4em"></div>');

        var ov = document.createElement('div');
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(23,23,28,.6);z-index:90;overflow:auto;padding:24px';
        ov.innerHTML =
          '<div style="background:#fff;max-width:760px;margin:0 auto;border-radius:16px;overflow:hidden">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-bottom:1px solid #e6e6ec;position:sticky;top:0;background:#fff">' +
          '<b style="font-size:14px">Así se verá publicado</b>' +
          '<button id="pvCerrar" class="btn-mini">Cerrar</button></div>' +
          '<div style="padding:34px 40px 44px;font-family:Archivo,sans-serif">' +
          '<span style="display:inline-block;background:#ff0a3c;color:#fff;font-size:11px;font-weight:800;' +
          'letter-spacing:.05em;text-transform:uppercase;padding:5px 13px;border-radius:999px;margin-bottom:16px">' +
          esc(catNombre[$('#eCat').value] || '') + '</span>' +
          '<h1 style="font-size:38px;font-weight:800;letter-spacing:-.03em;line-height:1.07;margin:0 0 16px">' +
          esc($('#eTitulo').value || 'Título del artículo') + '</h1>' +
          '<p style="font-size:14.5px;color:#5c5c6b;padding-bottom:18px;margin:0 0 22px;border-bottom:1px solid #e6e6ec">Por <b>' +
          esc(autNombre[$('#eAutor').value] || '') + '</b> · hoy' +
          ($('#eDur').value ? ' · ' + esc($('#eDur').value) : '') + '</p>' +
          cabecera +
          '<div style="font-size:18px;line-height:1.65;color:#2b2b2b">' +
          (cuerpo.length ? cuerpo.map(bloque).join('') : '<p style="color:#8f8fa0">Sin cuerpo todavía.</p>') +
          '</div></div></div>';
        document.body.appendChild(ov);
        ov.addEventListener('click', function (e) {
          if (e.target === ov || e.target.id === 'pvCerrar') ov.remove();
        });
      }
      $('#eVerCompleta').addEventListener('click', verCompleta);

      ['eTitulo', 'eExtracto', 'eCat', 'eAutor', 'eDur', 'eGlyph', 'eMedia'].forEach(function (fid) {
        $('#' + fid).addEventListener('input', previews);
      });
      ['eEstado', 'eTipo', 'eFecha', 'eCuerpo', 'eCat'].forEach(function (fid) {
        $('#' + fid).addEventListener('input', calcularUbicacion);
        $('#' + fid).addEventListener('change', calcularUbicacion);
      });
      calcularUbicacion();
      previews();

      /* barra de formato: inserta sintaxis en el cursor del cuerpo */
      $('#eToolbar').addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var ta = $('#eCuerpo');
        if (b.dataset.imgpicker) {
          selectorMedios(function (m) {
            var ini = ta.selectionStart, v = ta.value;
            var pre = v.slice(0, ini);
            var salto = (pre === '' || /\n\n$/.test(pre)) ? '' : (/\n$/.test(pre) ? '\n' : '\n\n');
            ta.value = pre + salto + '!img:' + m.url + '|' + (m.credito || 'Pie de foto') + v.slice(ini);
            ta.focus();
          });
          return;
        }
        var ins = b.dataset.ins, blq = b.dataset.bloque;
        var ini = ta.selectionStart, fin = ta.selectionEnd, v = ta.value;
        if (ins) {
          var sel = v.slice(ini, fin);
          var texto = ins.indexOf('**') === 0
            ? '**' + (sel || 'texto') + '**'
            : '[' + (sel || 'texto') + '](https://)';
          ta.value = v.slice(0, ini) + texto + v.slice(fin);
        } else if (blq) {
          var pre = v.slice(0, ini);
          var salto = (pre === '' || /\n\n$/.test(pre)) ? '' : (/\n$/.test(pre) ? '\n' : '\n\n');
          ta.value = pre + salto + blq + v.slice(fin);
        }
        ta.focus();
      });

      $('#eFile').addEventListener('change', function () {
        var f = this.files[0]; if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          var im = new Image();
          im.onload = function () {
            var MAX = 1280, w = im.width, h = im.height;
            if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
            var cv = document.createElement('canvas');
            cv.width = w; cv.height = h;
            cv.getContext('2d').drawImage(im, 0, 0, w, h);
            img = cv.toDataURL('image/jpeg', 0.72);
            art = null;
            document.querySelectorAll('#eGrads button').forEach(function (b) { b.classList.remove('on'); });
            previews();
            if (S.esDemo()) toast('Demo: la imagen vive en este navegador; en producción va a Storage');
          };
          im.src = reader.result;
        };
        reader.readAsDataURL(f);
      });

      document.querySelectorAll('#eGrads button').forEach(function (b) {
        b.addEventListener('click', function () {
          art = b.dataset.g; img = null;
          document.querySelectorAll('#eGrads button').forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          previews();
        });
      });

      /* imagen destacada desde la biblioteca (con su crédito) */
      var creditoBiblio = null;
      $('#eBiblio').addEventListener('click', function () {
        selectorMedios(function (m) {
          img = m.url; art = null; creditoBiblio = m.credito || null;
          document.querySelectorAll('#eGrads button').forEach(function (x) { x.classList.remove('on'); });
          previews();
        });
      });

      function recogerCampos() {
        return {
          id: a.id, vistas: a.vistas,
          slug: $('#eSlug').value.trim() || undefined,
          fecha: $('#eFecha').value ? new Date($('#eFecha').value).toISOString() : a.fecha,
          tipo: $('#eTipo').value, estado: $('#eEstado').value,
          titulo: $('#eTitulo').value.trim(), categoria: $('#eCat').value, autor: $('#eAutor').value,
          duracion: $('#eDur').value.trim() || undefined,
          media: $('#eMedia').value.trim() || undefined,
          extracto: $('#eExtracto').value.trim(),
          cuerpo: $('#eCuerpo').value.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean),
          img: img || undefined,
          credito: img === a.img ? a.credito : (creditoBiblio || undefined),
          art: art || undefined, glyph: $('#eGlyph').value.trim() || undefined
        };
      }
      function guardar(irAPreview) {
        var nuevo = recogerCampos();
        if (!nuevo.titulo) { toast('El título es obligatorio'); return; }
        var btn = $('#eGuardar');
        if (btn) { btn.disabled = true; btn.textContent = 'Guardando…'; }
        S.guardarArticulo(nuevo).then(function (guardado) {
          try { localStorage.removeItem(claveAutosave); } catch (er) {}
          if (irAPreview) {
            window.open('../articulo.html?slug=' + encodeURIComponent(guardado.slug), '_blank');
            a = guardado;
            location.hash = '#/editor/' + guardado.id;
          } else {
            var prog = nuevo.estado === 'publicado' && new Date(nuevo.fecha).getTime() > Date.now();
            toast(prog ? 'Programado ✓' : (nuevo.estado === 'publicado' ? 'Publicado ✓' : 'Guardado como borrador'));
            location.hash = '#/articulos';
          }
        }).catch(function (err) {
          /* nunca decir "publicado" si el guardado falló */
          console.error('CERO25 guardar:', err);
          var msg = (err && (err.message || err.hint)) || 'Error desconocido';
          alert('No se pudo guardar el artículo.\n\n' + msg +
                '\n\nTus cambios siguen en pantalla: corrige e inténtalo de nuevo. ' +
                'El respaldo automático también los conserva.');
        }).then(function () {
          if (btn) { btn.disabled = false; btn.textContent = 'Guardar'; }
        });
      }
      $('#eGuardar').addEventListener('click', function () { guardar(false); });
      $('#ePreview').addEventListener('click', function () { guardar(true); });
      main.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); guardar(false); }
      });

      /* autosalvado: cada 8s a localStorage; se ofrece recuperar al volver */
      var claveAutosave = 'cero25_draft_' + (a.id || 'nuevo');
      try {
        var previo = localStorage.getItem(claveAutosave);
        if (previo && confirm('Hay cambios sin guardar de una sesión anterior en este artículo. ¿Recuperarlos?')) {
          var d = JSON.parse(previo);
          $('#eTitulo').value = d.titulo || '';
          $('#eExtracto').value = d.extracto || '';
          $('#eCuerpo').value = (d.cuerpo || []).join('\n\n');
          if (d.img) { img = d.img; art = null; }
          previews();
        }
      } catch (er) {}
      var autosaveTimer = setInterval(function () {
        if (!document.getElementById('eTitulo')) { clearInterval(autosaveTimer); return; }
        try {
          localStorage.setItem(claveAutosave, JSON.stringify(recogerCampos()));
          $('#eAutosave').textContent = 'Borrador autosalvado · ' + new Date().toLocaleTimeString('es');
        } catch (er) { /* lleno: sin autosave */ }
      }, 8000);
    });
  }

  /* ================= portada ================= */
  var DESCRIPCIONES = {
    hero:     ['Hero (carrusel)', 'curado', '4 huecos · exige imagen panorámica', 4],
    ultimo:   ['Lo último', 'auto', '2 notas recientes + tarjeta del Boletín + vídeo reciente. Se llena solo.', 0],
    banda:    ['Banda destacada', 'curado', '1 hueco · imagen panorámica a lo ancho', 1],
    lecturas: ['Lecturas destacadas', 'mixto', 'Enlaces: los 6 más leídos (auto) · Tarjetas: 2 huecos curados', 2],
    videos:   ['Vídeos', 'mixto', 'Lista: 4 vídeos recientes (auto) · Destacado y banner: curados', 2],
    rail1:    ['Rail temático 1', 'curado', 'Título editable + 4 huecos', 4],
    feature1: ['Feature XL 1', 'curado', '1 hueco · imagen panorámica gigante', 1],
    minis:    ['Fila mini', 'curado', '3 huecos · tarjetas compactas', 3],
    feature2: ['Feature XL 2', 'curado', '1 hueco · imagen panorámica gigante', 1],
    rail2:    ['Rail temático 2', 'curado', 'Título editable + 3 huecos', 3],
    shorts:   ['Shorts', 'auto', 'Los 5 shorts más recientes. Se llena solo.', 0],
    grandes:  ['Grandes lecturas', 'auto', 'Longform (3+ párrafos), los 4 más recientes.', 0]
  };

  function vPortada() {
    Promise.all([S.portadaConfig(), S.articulos({})]).then(function (r) {
      var portada = JSON.parse(JSON.stringify(r[0])), arts = r[1];
      var elegibles = arts.filter(function (a) { return a.tipo !== 'short'; });
      var videos = arts.filter(function (a) { return a.tipo === 'video'; });

      function selectDe(valor, pool) {
        return '<select data-slot>' +
          pool.map(function (a) {
            return '<option value="' + a.id + '"' + (a.id === valor ? ' selected' : '') + '>' +
              esc(a.titulo.slice(0, 64)) + (a.img ? '' : ' · [póster]') + '</option>';
          }).join('') + '</select>';
      }
      function seccion(clave, filasHtml, tituloEditable) {
        var d = DESCRIPCIONES[clave];
        return '<div class="slot-sec" data-sec="' + clave + '">' +
          '<h2>' + d[0] + ' <span class="badge-modo ' + d[1] + '">' + d[1] + '</span></h2>' +
          '<p class="slot-desc">' + d[2] + '</p>' +
          (tituloEditable ? '<input class="slot-titulo-input" data-titulo value="' + esc(tituloEditable) + '" placeholder="Título del rail">' : '') +
          (filasHtml ? '<div class="slot-lista">' + filasHtml + '</div>' : '') +
          '</div>';
      }
      function filas(ids, pool) {
        return ids.map(function (id, i) {
          return '<div class="slot-fila"><span class="slot-num">' + (i + 1) + '</span>' +
            selectDe(id, pool) + '<span class="slot-aviso" data-aviso hidden>⚠ vertical</span></div>';
        }).join('');
      }

      main.innerHTML =
        '<div class="vista-head"><div><h1>Portada</h1>' +
        '<p class="vista-sub">Las secciones automáticas se llenan solas; las curadas las decides aquí. Un hueco vacío nunca rompe: entra el elegible más reciente.</p></div>' +
        '<a class="btn-ghost" href="../index.html" target="_blank" rel="noopener">Ver portada</a></div>' +
        seccion('hero', filas(portada.hero.slots, elegibles)) +
        seccion('ultimo', '') +
        seccion('banda', filas(portada.banda.slots, elegibles)) +
        seccion('lecturas', filas(portada.lecturas.tarjetas, elegibles)) +
        seccion('videos',
          '<div class="slot-fila"><span class="slot-num">★</span>' + selectDe(portada.videos.destacado, videos.length ? videos : elegibles) + '<span></span></div>' +
          '<div class="slot-fila"><span class="slot-num">▬</span>' + selectDe(portada.videos.banner, elegibles) + '<span></span></div>') +
        seccion('rail1', filas(portada.rail1.slots, arts), portada.rail1.titulo) +
        seccion('feature1', filas(portada.feature1.slots, elegibles)) +
        seccion('minis', filas(portada.minis.slots, arts)) +
        seccion('feature2', filas(portada.feature2.slots, elegibles)) +
        seccion('rail2', filas(portada.rail2.slots, arts), portada.rail2.titulo) +
        seccion('shorts', '') +
        seccion('grandes', '') +
        '<div class="portada-guardar">' +
        '<button class="btn-acc" id="pGuardar">Guardar portada</button></div>';

      var byId = {}; arts.forEach(function (a) { byId[a.id] = a; });
      function validar(sec) {
        var exige = ['hero', 'banda', 'feature1', 'feature2', 'lecturas'].indexOf(sec.dataset.sec) >= 0;
        if (!exige) return;
        sec.querySelectorAll('.slot-fila').forEach(function (fila) {
          var sel = fila.querySelector('select'), aviso = fila.querySelector('[data-aviso]');
          if (!sel || !aviso) return;
          var a = byId[sel.value];
          if (a && a.img) {
            var im = new Image();
            im.onload = function () { aviso.hidden = (im.naturalWidth / im.naturalHeight) >= 1.2; };
            im.src = a.img.indexOf('data:') === 0 ? a.img : '../' + a.img;
          } else { aviso.hidden = true; }
        });
      }
      main.querySelectorAll('.slot-sec').forEach(function (sec) {
        validar(sec);
        sec.addEventListener('change', function () { validar(sec); });
      });

      $('#pGuardar').addEventListener('click', function () {
        function idsDe(sec) {
          return Array.prototype.map.call(
            main.querySelectorAll('[data-sec="' + sec + '"] select'), function (s) { return s.value; });
        }
        portada.hero.slots = idsDe('hero');
        portada.banda.slots = idsDe('banda');
        portada.lecturas.tarjetas = idsDe('lecturas');
        var vids = idsDe('videos');
        portada.videos.destacado = vids[0]; portada.videos.banner = vids[1];
        portada.rail1.slots = idsDe('rail1');
        portada.rail1.titulo = main.querySelector('[data-sec="rail1"] [data-titulo]').value;
        portada.feature1.slots = idsDe('feature1');
        portada.minis.slots = idsDe('minis');
        portada.feature2.slots = idsDe('feature2');
        portada.rail2.slots = idsDe('rail2');
        portada.rail2.titulo = main.querySelector('[data-sec="rail2"] [data-titulo]').value;
        S.guardarPortada(portada).then(function () { toast('Portada guardada ✓'); });
      });
    });
  }

  /* ================= biblioteca de medios ================= */
  function selectorMedios(alElegir) {
    S.medios().then(function (medios) {
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(23,23,28,.55);z-index:80;display:grid;place-items:center;padding:24px';
      overlay.innerHTML =
        '<div style="background:#fff;border-radius:16px;max-width:760px;width:100%;max-height:80vh;overflow:auto;padding:22px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
        '<b style="font-size:16px">Elegir de la biblioteca</b>' +
        '<button id="selCerrar" class="btn-mini">Cerrar</button></div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px">' +
        medios.map(function (m) {
          return '<button type="button" data-medio="' + m.id + '" style="border:1px solid #e6e6ec;border-radius:10px;overflow:hidden;padding:0;cursor:pointer;background:#fff">' +
            '<img src="' + esc(m.url) + '" alt="" style="width:100%;aspect-ratio:16/10;object-fit:cover;display:block" loading="lazy">' +
            '<span style="display:block;font-size:10px;color:#8f8fa0;padding:6px 8px;text-align:left;line-height:1.3">' + esc((m.credito || '').split('·')[0]) + '</span>' +
            '</button>';
        }).join('') + '</div></div>';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.id === 'selCerrar') { overlay.remove(); return; }
        var b = e.target.closest('[data-medio]');
        if (b) {
          var m = medios.find(function (x) { return x.id === b.dataset.medio; });
          overlay.remove();
          if (m) alElegir(m);
        }
      });
    });
  }

  function vMedios() {
    S.medios().then(function (medios) {
      main.innerHTML =
        '<div class="vista-head"><div><h1>Medios</h1>' +
        '<p class="vista-sub">' + medios.length + ' imágenes reutilizables. Desde el editor: "Elegir de la biblioteca".</p></div>' +
        '<label class="btn-acc" style="cursor:pointer">+ Subir imagen' +
        '<input type="file" id="mFile" accept="image/*" hidden></label></div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px">' +
        medios.map(function (m) {
          return '<div style="background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden">' +
            '<img src="' + esc(m.url) + '" alt="" style="width:100%;aspect-ratio:16/10;object-fit:cover;display:block" loading="lazy">' +
            '<div style="padding:9px 11px;display:flex;flex-direction:column;gap:7px">' +
            '<span style="font-size:10.5px;color:var(--ink-3);line-height:1.35">' + esc(m.credito || 'Sin crédito') + '</span>' +
            '<button class="btn-mini peligro" data-mborrar="' + m.id + '" style="align-self:flex-start">Quitar</button>' +
            '</div></div>';
        }).join('') + '</div>';
      $('#mFile').addEventListener('change', function () {
        var f = this.files[0]; if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          var im = new Image();
          im.onload = function () {
            var MAX = 1280, w = im.width, h = im.height;
            if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
            var cv = document.createElement('canvas');
            cv.width = w; cv.height = h;
            cv.getContext('2d').drawImage(im, 0, 0, w, h);
            S.guardarMedio({ url: cv.toDataURL('image/jpeg', 0.72), credito: 'Subida propia' })
              .then(function () { toast('Imagen añadida a la biblioteca'); vMedios(); });
          };
          im.src = reader.result;
        };
        reader.readAsDataURL(f);
      });
      main.querySelectorAll('[data-mborrar]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (!confirm('¿Quitar esta imagen de la biblioteca? (los artículos que ya la usan no se tocan)')) return;
          S.borrarMedio(b.dataset.mborrar).then(function () { toast('Imagen quitada'); vMedios(); });
        });
      });
    });
  }

  /* ================= papelera ================= */
  function vPapelera() {
    S.articulos({ papelera: true }).then(function (arts) {
      main.innerHTML =
        '<div class="vista-head"><div><h1>Papelera</h1>' +
        '<p class="vista-sub">Todo aquí es recuperable. Eliminar definitivamente no tiene vuelta.</p></div></div>' +
        (arts.length
          ? '<div class="tabla-wrap"><table class="tabla"><thead><tr>' +
            '<th>Título</th><th>Tipo</th><th>Categoría</th><th></th></tr></thead><tbody>' +
            arts.map(function (a) {
              return '<tr><td class="celda-titulo">' + esc(a.titulo) + '</td>' +
                '<td><span class="pill-tipo">' + esc(a.tipo) + '</span></td>' +
                '<td>' + esc(a.categoria) + '</td>' +
                '<td><div class="acciones">' +
                '<button class="btn-mini" data-restaurar="' + a.id + '">Restaurar</button>' +
                '<button class="btn-mini peligro" data-eliminar="' + a.id + '">Eliminar definitivamente</button>' +
                '</div></td></tr>';
            }).join('') + '</tbody></table></div>'
          : '<div class="vacio">' + icono('fantasma') + '<span>La papelera está vacía.</span></div>');
      main.querySelectorAll('[data-restaurar]').forEach(function (b) {
        b.addEventListener('click', function () {
          S.restaurar(b.dataset.restaurar).then(function () { toast('Restaurado'); vPapelera(); });
        });
      });
      main.querySelectorAll('[data-eliminar]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (!confirm('¿Eliminar DEFINITIVAMENTE? No se puede deshacer.')) return;
          S.borrarArticulo(b.dataset.eliminar).then(function () { toast('Eliminado'); vPapelera(); });
        });
      });
    });
  }

  /* ================= pódcast ================= */
  function vProgramas() {
    S.programas().then(function (progs) {
      main.innerHTML =
        '<div class="vista-head"><div><h1>Pódcast</h1>' +
        '<p class="vista-sub">Los programas de la sección Pódcast de la portada.</p></div>' +
        '<button class="btn-acc" id="prNuevo">+ Añadir programa</button></div>' +
        '<div id="prForm" hidden></div>' +
        '<div class="tabla-wrap"><table class="tabla"><thead><tr>' +
        '<th>Programa</th><th>Host</th><th>Tarjeta</th><th></th></tr></thead><tbody>' +
        progs.map(function (p) {
          return '<tr><td class="celda-titulo">' + esc(p.nombre) + '</td>' +
            '<td>' + esc(p.host) + '</td>' +
            '<td><span style="display:inline-block;width:40px;height:24px;border-radius:6px;vertical-align:middle" class="' + esc(p.art) + '"></span></td>' +
            '<td><div class="acciones"><button class="btn-mini" data-edit="' + p.id + '">Editar</button></div></td></tr>';
        }).join('') + '</tbody></table></div>';

      function formPrograma(p) {
        p = p || { color: 'pc-green', art: 'g1' };
        var zona = $('#prForm');
        zona.hidden = false;
        zona.innerHTML = '<div class="card-form" style="margin-bottom:16px">' +
          '<h3>' + (p.id ? 'Editar' : 'Nuevo') + ' programa</h3>' +
          '<div class="fila-2">' +
          '<label class="fld"><span>Nombre</span><input id="prNombre" value="' + esc(p.nombre || '') + '"></label>' +
          '<label class="fld"><span>Host</span><input id="prHost" value="' + esc(p.host || '') + '"></label></div>' +
          '<div class="fila-2">' +
          '<label class="fld"><span>Color de tarjeta</span><select id="prColor">' +
          ['pc-green', 'pc-orange', 'pc-red', 'pc-yellow', 'pc-mint'].map(function (c) {
            return '<option' + (p.color === c ? ' selected' : '') + '>' + c + '</option>';
          }).join('') + '</select></label>' +
          '<label class="fld"><span>Glifo</span><input id="prGlyph" maxlength="4" value="' + esc(p.glyph || '') + '"></label></div>' +
          '<label class="fld"><span>Enlace del programa <span class="hint">(Spotify, YouTube o el que uses)</span></span>' +
          '<input id="prUrl" value="' + esc(p.url || '') + '" placeholder="https://open.spotify.com/show/…"></label>' +
          '<div style="display:flex;gap:10px"><button class="btn-acc" id="prGuardar">Guardar</button>' +
          '<button class="btn-ghost" id="prCancelar">Cancelar</button></div></div>';
        $('#prCancelar').addEventListener('click', function () { zona.hidden = true; });
        $('#prGuardar').addEventListener('click', function () {
          var nombre = $('#prNombre').value.trim();
          if (!nombre) { toast('El nombre es obligatorio'); return; }
          S.guardarPrograma({
            id: p.id, nombre: nombre, host: $('#prHost').value.trim(),
            color: $('#prColor').value, art: p.art || 'g' + (1 + Math.floor(Math.random() * 12)),
            glyph: $('#prGlyph').value.trim(),
            url: $('#prUrl').value.trim() || undefined,
            img: p.img, credito: p.credito
          }).then(function () { toast('Programa guardado'); vProgramas(); });
        });
      }
      $('#prNuevo').addEventListener('click', function () { formPrograma(null); });
      main.querySelectorAll('[data-edit]').forEach(function (b) {
        b.addEventListener('click', function () {
          formPrograma(progs.find(function (p) { return p.id === b.dataset.edit; }));
        });
      });
    });
  }

  /* ================= autores ================= */
  function vAutores() {
    S.autores().then(function (auts) {
      main.innerHTML =
        '<div class="vista-head"><div><h1>Autores</h1>' +
        '<p class="vista-sub">Aparecen en las bylines de todo el sitio.</p></div></div>' +
        '<div class="card-form" style="margin-bottom:16px;max-width:560px">' +
        '<h3>Añadir autor</h3><div class="fila-2">' +
        '<label class="fld"><span>Nombre</span><input id="auNombre" placeholder="Nombre y apellido"></label>' +
        '<label class="fld"><span>Rol</span><input id="auRol" placeholder="Redactor de Cine"></label></div>' +
        '<button class="btn-acc" id="auGuardar" style="align-self:flex-start">Añadir</button></div>' +
        '<div class="tabla-wrap"><table class="tabla"><thead><tr>' +
        '<th>Nombre</th><th>Rol</th></tr></thead><tbody>' +
        auts.map(function (a) {
          return '<tr><td class="celda-titulo">' + esc(a.nombre) + '</td><td>' + esc(a.rol || '') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
      $('#auGuardar').addEventListener('click', function () {
        var nombre = $('#auNombre').value.trim();
        if (!nombre) { toast('El nombre es obligatorio'); return; }
        S.guardarAutor({ nombre: nombre, rol: $('#auRol').value.trim() })
          .then(function () { toast('Autor añadido'); vAutores(); });
      });
    });
  }

  /* ================= boletín ================= */
  function vBoletin() {
    S.suscriptores().then(function (subs) {
      main.innerHTML =
        '<div class="vista-head"><div><h1>Boletín</h1>' +
        '<p class="vista-sub">' + subs.length + ' suscriptores. El alta vive al final de la portada.</p></div>' +
        (subs.length ? '<button class="btn-ghost" id="subCsv">Exportar CSV</button>' : '') + '</div>' +
        (subs.length
          ? '<div class="tabla-wrap"><table class="tabla"><thead><tr><th>Correo</th><th>Alta</th></tr></thead><tbody>' +
            subs.map(function (s) {
              return '<tr><td>' + esc(s.email) + '</td><td>' + S.tiempoRelativo(s.fecha) + '</td></tr>';
            }).join('') + '</tbody></table></div>'
          : '<div class="vacio">' + icono('mail') + '<span>Aún no hay suscriptores.</span></div>');
      var btn = $('#subCsv');
      if (btn) btn.addEventListener('click', function () {
        var csv = 'email,fecha\n' + subs.map(function (s) { return s.email + ',' + s.fecha; }).join('\n');
        var aEl = document.createElement('a');
        aEl.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        aEl.download = 'cero25-boletin.csv';
        aEl.click();
      });
    });
  }

  /* ================= ajustes ================= */
  function vAjustes() {
    Promise.all([S.articulos({ incluirBorradores: true }), S.suscriptores()]).then(function (r) {
      main.innerHTML =
        '<div class="vista-head"><div><h1>Ajustes</h1></div></div>' +
        '<div class="card-form" style="max-width:560px;margin-bottom:16px">' +
        '<h3>Estado del sistema</h3>' +
        '<p class="vista-sub">Motor de datos: <b>' + (S.esDemo() ? 'Demo (navegador)' : 'Supabase (producción)') + '</b><br>' +
        'Contenido: ' + r[0].length + ' artículos · ' + r[1].length + ' suscriptores</p>' +
        (S.esDemo()
          ? '<p class="vista-sub">Para pasar a producción: pega las claves de Supabase en <b>config.js</b>, ejecuta <b>supabase/schema.sql</b> y crea los usuarios. Guía completa en README-PRODUCTO.md.</p>'
          : '') +
        '</div>' +
        '<div class="card-form" style="max-width:560px">' +
        '<h3>Datos</h3>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
        '<button class="btn-ghost" id="ajExportar">Exportar todo (JSON)</button>' +
        (S.esDemo() ? '<button class="btn-mini peligro" id="ajReset">Restaurar demo</button>' : '') +
        '</div></div>';
      $('#ajExportar').addEventListener('click', function () {
        Promise.all([S.articulos({ incluirBorradores: true }), S.categorias(), S.autores(),
          S.programas(), S.portadaConfig(), S.suscriptores()])
          .then(function (x) {
            var blob = new Blob([JSON.stringify({
              articulos: x[0], categorias: x[1], autores: x[2],
              programas: x[3], portada: x[4], suscriptores: x[5]
            }, null, 2)], { type: 'application/json' });
            var aEl = document.createElement('a');
            aEl.href = URL.createObjectURL(blob);
            aEl.download = 'cero25-export.json';
            aEl.click();
          });
      });
      var rst = $('#ajReset');
      if (rst) rst.addEventListener('click', function () {
        if (!confirm('Esto descarta TODOS los cambios locales y vuelve al seed. ¿Seguro?')) return;
        S.reset(); toast('Datos restaurados'); location.hash = '#/panel';
      });
    });
  }

  /* ================= arranque ================= */
  S.sesion().then(function (ses) {
    if (ses) { SESION = ses; mostrarApp(); }
    else mostrarLogin();
  }).catch(function () { mostrarLogin(); });
})();
