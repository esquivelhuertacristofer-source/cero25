/**
 * CERO25 — STORE (capa de datos)
 * API async única para sitio y admin. Driver intercambiable:
 *  - LocalDriver (hoy): localStorage + seed de data.js. Login demo.
 *  - SupabaseDriver (producción): misma interfaz, ver supabase/driver-supabase.js
 * El sitio y el admin SOLO hablan con CeroStore; nunca con el driver directo.
 */
(function () {
  'use strict';

  var DB_KEY = 'cero25_db_v6'; /* subir versión invalida el seed viejo en navegadores */
  var SESSION_KEY = 'cero25_session_v1';

  /* ================= LocalDriver ================= */
  var LocalDriver = {
    _db: null,

    _load: function () {
      if (this._db) return this._db;
      try {
        var raw = localStorage.getItem(DB_KEY);
        if (raw) { this._db = JSON.parse(raw); return this._db; }
      } catch (e) { /* localStorage bloqueado: solo lectura del seed */ }
      this._db = JSON.parse(JSON.stringify(window.CERO25_SEED));
      return this._db;
    },

    _save: function () {
      try { localStorage.setItem(DB_KEY, JSON.stringify(this._db)); }
      catch (e) { console.warn('CERO25: sin persistencia (localStorage lleno o bloqueado)'); }
    },

    reset: function () {
      this._db = JSON.parse(JSON.stringify(window.CERO25_SEED));
      this._save();
    },

    getAll: function (col) { return Promise.resolve(this._load()[col] || []); },

    upsert: function (col, item) {
      var db = this._load();
      var arr = db[col] || (db[col] = []);
      var i = arr.findIndex(function (x) { return x.id === item.id; });
      if (i >= 0) arr[i] = item; else arr.unshift(item);
      this._save();
      return Promise.resolve(item);
    },

    remove: function (col, id) {
      var db = this._load();
      db[col] = (db[col] || []).filter(function (x) { return x.id !== id; });
      this._save();
      return Promise.resolve(true);
    },

    getPortada: function () { return Promise.resolve(this._load().portada); },

    setPortada: function (portada) {
      this._load().portada = portada;
      this._save();
      return Promise.resolve(portada);
    },

    /* login demo — con Supabase esto se vuelve auth real */
    USERS: [
      { email: 'admin@cero25.com',  pass: 'cero25admin',  rol: 'admin',  nombre: 'Admin CERO25' },
      { email: 'editor@cero25.com', pass: 'cero25editor', rol: 'editor', nombre: 'Editor CERO25' }
    ],
    login: function (email, pass) {
      var u = this.USERS.find(function (x) { return x.email === email && x.pass === pass; });
      if (!u) return Promise.reject(new Error('Correo o contraseña incorrectos'));
      var session = { email: u.email, rol: u.rol, nombre: u.nombre, ts: Date.now() };
      try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
      return Promise.resolve(session);
    },
    logout: function () {
      try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
      return Promise.resolve(true);
    },
    getSession: function () {
      try {
        var raw = localStorage.getItem(SESSION_KEY);
        return Promise.resolve(raw ? JSON.parse(raw) : null);
      } catch (e) { return Promise.resolve(null); }
    }
  };

  /* driver activo: si config.js define window.CERO25_SUPABASE con claves,
     driver-supabase.js se registrará aquí; si no, LocalDriver. */
  var driver = LocalDriver;

  /* ================= helpers ================= */
  function bySlugMap(arr) {
    var m = {}; arr.forEach(function (x) { m[x.slug || x.id] = x; }); return m;
  }

  function tiempoRelativo(iso) {
    var ms = Date.now() - new Date(iso).getTime();
    var min = Math.floor(ms / 60000);
    if (min < 1) return 'Ahora mismo';
    if (min < 60) return 'Hace ' + min + ' min';
    var h = Math.floor(min / 60);
    if (h < 24) return 'Hace ' + h + ' h';
    var d = Math.floor(h / 24);
    if (d === 1) return 'Ayer';
    if (d < 7) return 'Hace ' + d + ' días';
    var f = new Date(iso);
    var meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return f.getDate() + ' ' + meses[f.getMonth()] + ' ' + f.getFullYear();
  }

  function minutosLectura(a) {
    if (a.duracion) return a.duracion;
    var palabras = (a.cuerpo || []).join(' ').split(/\s+/).length + (a.extracto || '').split(/\s+/).length;
    return Math.max(3, Math.round(palabras / 180) + 2) + ' min de lectura';
  }

  /* ================= API pública ================= */
  window.CeroStore = {

    _setDriver: function (d) { driver = d; },
    esDemo: function () { return driver === LocalDriver; },
    reset: function () { if (driver.reset) driver.reset(); },

    /* --- lectura --- */
    categorias: function () { return driver.getAll('categorias'); },
    autores:    function () { return driver.getAll('autores'); },
    programas:  function () { return driver.getAll('programas'); },

    articulos: function (filtro) {
      filtro = filtro || {};
      return driver.getAll('articulos').then(function (arts) {
        var out = arts.slice();
        /* la papelera nunca sale, salvo que se pida explícitamente */
        if (filtro.papelera) {
          out = out.filter(function (a) { return a.estado === 'papelera'; });
          out.sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
          return out;
        }
        out = out.filter(function (a) { return a.estado !== 'papelera'; });
        if (!filtro.incluirBorradores) {
          var ahora = Date.now();
          out = out.filter(function (a) {
            /* publicado Y con fecha alcanzada: publicar a futuro = programado */
            return a.estado === 'publicado' && new Date(a.fecha).getTime() <= ahora;
          });
        }
        if (filtro.tipo)      out = out.filter(function (a) { return a.tipo === filtro.tipo; });
        if (filtro.categoria) out = out.filter(function (a) { return a.categoria === filtro.categoria; });
        if (filtro.q) {
          var q = filtro.q.toLowerCase();
          out = out.filter(function (a) {
            return (a.titulo + ' ' + (a.extracto || '') + ' ' + a.categoria).toLowerCase().indexOf(q) >= 0;
          });
        }
        out.sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
        if (filtro.n) out = out.slice(0, filtro.n);
        return out;
      });
    },

    porSlug: function (slug) {
      return driver.getAll('articulos').then(function (arts) {
        return arts.find(function (a) { return a.slug === slug || a.id === slug; }) || null;
      });
    },

    relacionados: function (articulo, n) {
      return this.articulos({ categoria: articulo.categoria }).then(function (arts) {
        return arts.filter(function (a) { return a.id !== articulo.id; }).slice(0, n || 3);
      });
    },

    /* --- resolución de portada: aquí vive la lógica auto/curado/fallback --- */
    portadaResuelta: function () {
      var self = this;
      return Promise.all([driver.getPortada(), self.articulos({}), driver.getAll('programas')])
        .then(function (r) {
          var portada = r[0], arts = r[1], programas = r[2];
          var byId = {}; arts.forEach(function (a) { byId[a.id] = a; });
          var usados = {};

          function elegible(filtro) {
            return arts.filter(function (a) {
              if (usados[a.id]) return false;
              if (filtro.tipo && a.tipo !== filtro.tipo) return false;
              if (filtro.excluirTipos && filtro.excluirTipos.indexOf(a.tipo) >= 0) return false;
              if (filtro.longform && (a.cuerpo || []).length < (filtro.minParrafos || 3)) return false;
              return true;
            });
          }

          /* slots curados con fallback: nunca huecos rotos */
          function resolverSlots(ids, filtro, marcar) {
            return (ids || []).map(function (id) {
              var a = byId[id];
              if (!a || a.estado !== 'publicado') a = elegible(filtro || {})[0] || null;
              if (a && marcar !== false) usados[a.id] = true;
              return a;
            }).filter(Boolean);
          }

          var out = {};
          out.hero = resolverSlots(portada.hero.slots, { excluirTipos: ['short', 'podcast'] });
          out.ultimo = elegible({ excluirTipos: portada.ultimo.excluirTipos })
            .slice(0, portada.ultimo.n);
          out.ultimo.forEach(function (a) { usados[a.id] = true; });
          out.banda = resolverSlots(portada.banda.slots, { excluirTipos: ['short'] })[0] || null;
          out.lecturasEnlaces = arts.filter(function (a) { return a.tipo === 'articulo'; })
            .slice().sort(function (a, b) { return b.vistas - a.vistas; })
            .slice(0, portada.lecturas.enlaces.n);
          out.lecturasTarjetas = resolverSlots(portada.lecturas.tarjetas, { excluirTipos: ['short'] });
          out.videosLista = arts.filter(function (a) { return a.tipo === 'video'; })
            .slice(0, portada.videos.lista);
          out.videoDestacado = byId[portada.videos.destacado] || out.videosLista[0] || null;
          out.videoBanner = byId[portada.videos.banner] || null;
          out.rail1 = { titulo: portada.rail1.titulo, items: resolverSlots(portada.rail1.slots, {}) };
          out.feature1 = resolverSlots(portada.feature1.slots, { excluirTipos: ['short'] })[0] || null;
          out.minis = resolverSlots(portada.minis.slots, {});
          out.feature2 = resolverSlots(portada.feature2.slots, { excluirTipos: ['short'] })[0] || null;
          out.rail2 = { titulo: portada.rail2.titulo, items: resolverSlots(portada.rail2.slots, {}) };
          out.shorts = arts.filter(function (a) { return a.tipo === 'short'; }).slice(0, portada.shorts.n);
          out.programas = programas;
          out.grandes = elegible({ longform: true, minParrafos: portada.grandes.minParrafos })
            .filter(function (a) { return a.tipo === 'articulo'; })
            .slice(0, portada.grandes.n);
          return out;
        });
    },

    portadaConfig: function () { return driver.getPortada(); },
    guardarPortada: function (p) { return driver.setPortada(p); },

    /* --- escritura (admin) --- */
    guardarArticulo: function (a) {
      if (!a.id) a.id = 'n' + Date.now().toString(36);
      if (!a.slug) a.slug = a.titulo.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
      if (!a.fecha) a.fecha = new Date().toISOString();
      if (a.vistas == null) a.vistas = 0;
      return driver.upsert('articulos', a);
    },
    borrarArticulo: function (id) { return driver.remove('articulos', id); },
    guardarAutor: function (a) {
      if (!a.id) a.id = 'a' + Date.now().toString(36);
      return driver.upsert('autores', a);
    },
    guardarPrograma: function (p) {
      if (!p.id) p.id = 's' + Date.now().toString(36);
      return driver.upsert('programas', p);
    },

    /* --- vistas reales: total + serie diaria (para la gráfica del panel) --- */
    registrarVista: function (id) {
      /* en producción el driver expone su propia vía (RPC): el lector anónimo
         no tiene permiso de escritura directa sobre la tabla */
      if (driver.registrarVista) return driver.registrarVista(id);
      return driver.getAll('articulos').then(function (arts) {
        var a = arts.find(function (x) { return x.id === id; });
        if (!a) return null;
        a.vistas = (a.vistas || 0) + 1;
        var hoy = new Date().toISOString().slice(0, 10);
        a.vd = a.vd || {};
        a.vd[hoy] = (a.vd[hoy] || 0) + 1;
        return driver.upsert('articulos', a);
      });
    },

    /* --- papelera: borrar es recuperable --- */
    aPapelera: function (id) {
      return driver.getAll('articulos').then(function (arts) {
        var a = arts.find(function (x) { return x.id === id; });
        if (!a) return null;
        a.estadoPrevio = a.estado;
        a.estado = 'papelera';
        return driver.upsert('articulos', a);
      });
    },
    restaurar: function (id) {
      return driver.getAll('articulos').then(function (arts) {
        var a = arts.find(function (x) { return x.id === id; });
        if (!a) return null;
        a.estado = a.estadoPrevio || 'borrador';
        delete a.estadoPrevio;
        return driver.upsert('articulos', a);
      });
    },

    /* --- biblioteca de medios --- */
    medios: function () { return driver.getAll('medios'); },
    guardarMedio: function (m) {
      if (!m.id) m.id = 'm' + Date.now().toString(36);
      if (!m.fecha) m.fecha = new Date().toISOString();
      return driver.upsert('medios', m);
    },
    borrarMedio: function (id) { return driver.remove('medios', id); },

    /* --- boletín (demo: se guarda en el store; producción: tabla) --- */
    suscribir: function (email) {
      return driver.getAll('suscriptores').then(function (subs) {
        if (subs.some(function (s) { return s.email === email; })) return { ya: true };
        return driver.upsert('suscriptores', { id: 'sub' + Date.now().toString(36), email: email, fecha: new Date().toISOString() });
      });
    },
    suscriptores: function () { return driver.getAll('suscriptores'); },

    /* --- auth --- */
    login: function (e, p) { return driver.login(e, p); },
    logout: function () { return driver.logout(); },
    sesion: function () { return driver.getSession(); },

    /* --- reproductores embebidos ---
       Detecta la plataforma a partir de la URL que pegue el editor y
       devuelve {tipo, id, embed} o null si no se reconoce. */
    detectarMedia: function (url) {
      if (!url) return null;
      url = String(url).trim();
      var m;
      /* YouTube: watch?v= · youtu.be/ · /embed/ · /shorts/ */
      m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,15})/);
      if (m) return { tipo: 'youtube', id: m[1],
        embed: 'https://www.youtube-nocookie.com/embed/' + m[1] };
      /* Spotify: episode · show · track · playlist · album */
      m = url.match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(episode|show|track|playlist|album)\/([A-Za-z0-9]{10,40})/);
      if (m) return { tipo: 'spotify', clase: m[1], id: m[2],
        embed: 'https://open.spotify.com/embed/' + m[1] + '/' + m[2] };
      /* Vimeo */
      m = url.match(/vimeo\.com\/(?:video\/)?(\d{6,12})/);
      if (m) return { tipo: 'vimeo', id: m[1],
        embed: 'https://player.vimeo.com/video/' + m[1] };
      return null;
    },

    /* --- helpers de presentación --- */
    tiempoRelativo: tiempoRelativo,
    minutosLectura: minutosLectura,
    autorNombre: function (autores, id) {
      var a = autores.find(function (x) { return x.id === id; });
      return a ? a.nombre : 'La Redacción';
    }
  };
})();
