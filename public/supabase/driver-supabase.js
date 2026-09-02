/**
 * CERO25 — SupabaseDriver
 * Misma interfaz que LocalDriver. Se activa solo si config.js trae claves.
 * Requiere ejecutar supabase/schema.sql en el proyecto antes de activar.
 */
(function () {
  'use strict';
  var cfg = window.CERO25_CONFIG || {};
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return; // modo demo: no hace nada

  /* carga del cliente oficial desde CDN solo cuando hay claves */
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
  s.onload = function () {
    var sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

    /* map colección → tabla */
    var TABLAS = {
      categorias: 'categorias', autores: 'autores', programas: 'programas',
      articulos: 'articulos', suscriptores: 'suscriptores', medios: 'medios'
    };

    var SupabaseDriver = {
      getAll: function (col) {
        return sb.from(TABLAS[col]).select('*').then(function (r) {
          if (r.error) throw r.error;
          return r.data || [];
        });
      },
      upsert: function (col, item) {
        return sb.from(TABLAS[col]).upsert(item).select().then(function (r) {
          if (r.error) throw r.error;
          return r.data[0];
        });
      },
      remove: function (col, id) {
        return sb.from(TABLAS[col]).delete().eq('id', id).then(function (r) {
          if (r.error) throw r.error;
          return true;
        });
      },
      /* el lector anónimo no puede escribir en articulos: se usa la función RPC */
      registrarVista: function (id) {
        return sb.rpc('registrar_vista', { art_id: id }).then(function () { return true; });
      },
      getPortada: function () {
        return sb.from('portada').select('config').eq('id', 1).single().then(function (r) {
          if (r.error) throw r.error;
          return r.data.config;
        });
      },
      setPortada: function (portada) {
        return sb.from('portada').upsert({ id: 1, config: portada }).then(function (r) {
          if (r.error) throw r.error;
          return portada;
        });
      },
      login: function (email, pass) {
        return sb.auth.signInWithPassword({ email: email, password: pass }).then(function (r) {
          if (r.error) throw new Error('Correo o contraseña incorrectos');
          /* el rol vive en la tabla perfiles */
          return sb.from('perfiles').select('rol,nombre').eq('id', r.data.user.id).single()
            .then(function (p) {
              return { email: email, rol: (p.data && p.data.rol) || 'editor',
                       nombre: (p.data && p.data.nombre) || email, ts: Date.now() };
            });
        });
      },
      logout: function () { return sb.auth.signOut().then(function () { return true; }); },
      getSession: function () {
        return sb.auth.getSession().then(function (r) {
          var ses = r.data.session;
          if (!ses) return null;
          return sb.from('perfiles').select('rol,nombre').eq('id', ses.user.id).single()
            .then(function (p) {
              return { email: ses.user.email, rol: (p.data && p.data.rol) || 'editor',
                       nombre: (p.data && p.data.nombre) || ses.user.email, ts: Date.now() };
            });
        });
      }
    };

    window.CeroStore._setDriver(SupabaseDriver);
    console.info('CERO25: driver Supabase activo');
  };
  document.head.appendChild(s);
})();
