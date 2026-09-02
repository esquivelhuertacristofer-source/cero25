/**
 * CERO25 — Service Worker
 * Estrategia: red primero para HTML y datos (contenido fresco),
 * caché primero para assets estáticos (fotos, CSS, JS de librería).
 */
var CACHE = 'cero25-v2';
var ESTATICOS = [
  'styles.css', 'manifest.json',
  'assets/icono-192.png', 'assets/icono-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ESTATICOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  /* SOLO imágenes van caché-primero (no cambian de contenido).
     CSS y JS van red-primero: un diseño actualizado debe llegar siempre. */
  if (url.pathname.indexOf('/assets/') >= 0 || /\.(png|jpg)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(function (hit) {
        return hit || fetch(e.request).then(function (res) {
          var copia = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
          return res;
        });
      })
    );
    return;
  }

  /* HTML, CSS y JS: red primero, caché solo sin conexión */
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copia = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
      return res;
    }).catch(function () { return caches.match(e.request); })
  );
});
