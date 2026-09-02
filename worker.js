/**
 * CERO25 — Worker
 * Todo se sirve como asset estático salvo /sitemap.xml, que se genera
 * en vivo desde la base: así cada artículo que publique la redacción
 * entra al índice de Google sin tocar nada. Si la base no responde,
 * cae al sitemap.xml estático de /public como respaldo.
 */

const SUPABASE_URL = 'https://tstzxdoyuqehpvbbvchh.supabase.co';
/* clave anon: pública por diseño (es la misma que viaja en config.js) */
const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzdHp4ZG95dXFlaHB2YmJ2Y2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTkxMjgsImV4cCI6MjEwMzkzNTEyOH0.XcUWstl5VbRqx9033tiV8H9-ZWDhX_LgZyAOV5mmxbA';

const BASE = 'https://www.cero25.com.mx';

const PAGINAS_FIJAS = [
  '',
  'seccion.html',
  'seccion.html?tipo=video',
  'legal.html?p=privacidad',
  'legal.html?p=terminos',
  'legal.html?p=cookies',
  'legal.html?p=nosotros',
  'legal.html?p=contacto'
];

function xmlEscape(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sitemap(env, request) {
  const r = await fetch(
    SUPABASE_URL + '/rest/v1/articulos?select=slug,fecha&estado=eq.publicado&order=fecha.desc&limit=1000',
    { headers: { apikey: SUPABASE_ANON } }
  );
  if (!r.ok) throw new Error('supabase ' + r.status);
  const arts = await r.json();
  const ahora = Date.now();

  const urls = PAGINAS_FIJAS.map(function (p) {
    return '<url><loc>' + xmlEscape(BASE + '/' + p) + '</loc></url>';
  }).concat(
    arts
      /* los programados no entran al índice hasta su hora */
      .filter(function (a) { return a.slug && new Date(a.fecha).getTime() <= ahora; })
      .map(function (a) {
        return '<url><loc>' + xmlEscape(BASE + '/articulo.html?slug=' + a.slug) + '</loc>' +
          '<lastmod>' + new Date(a.fecha).toISOString().slice(0, 10) + '</lastmod></url>';
      })
  );

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('\n') + '\n</urlset>';

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      /* una hora en el borde: la base no se toca en cada rastreo */
      'cache-control': 'public, max-age=3600'
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/sitemap.xml') {
      try { return await sitemap(env, request); }
      catch (e) { /* respaldo: el sitemap estático de /public */ }
    }
    return env.ASSETS.fetch(request);
  }
};
