# CERO25 — Despliegue en Cloudflare

Carpeta lista para subir. Dos caminos; el resultado es el mismo sitio.

## Camino A — Worker con assets estáticos (lo que pediste)

Requisito único: Node.js (una vez). En PowerShell:

```powershell
winget install OpenJS.NodeJS.LTS
```

Cierra y reabre la terminal, entra a esta carpeta y:

```powershell
cd "c:\Users\crist\OneDrive\Escritorio\Tramitex\cloudflare-worker"
npx wrangler@latest login     # abre el navegador: autoriza con tu cuenta de Cloudflare
npx wrangler@latest deploy    # sube todo
```

Al terminar te imprime la URL:  `https://cero25.<tu-subdominio>.workers.dev`

Cambios futuros: repites solo `npx wrangler@latest deploy` (sube en segundos).

## Camino B — Pages por arrastre (sin instalar nada)

1. dash.cloudflare.com → **Workers & Pages** → **Create** → pestaña **Pages**
   → **Upload assets**
2. Arrastra la carpeta **`public/`** (la de adentro, no esta raíz)
3. Nombre del proyecto: `cero25` → Deploy

URL resultante: `https://cero25.pages.dev`

## Qué incluye el paquete

- `public/` — el sitio completo: portada, artículo, sección, admin, PWA,
  robots, sitemap, 404 de marca, 27 imágenes locales
- `public/_headers` — caché larga para fotos, revalidación para CSS,
  `no-cache` para el service worker, `noindex` para /admin/
- `wrangler.toml` — configuración del Worker (404 propio incluido)

## Después del primer deploy (checklist de dominio)

1. **Dominio**: compra en Cloudflare Registrar (precio de costo) o apunta
   uno existente. Workers/Pages → tu proyecto → **Custom domains** → añadir.
   SSL automático.
2. **sitemap.xml** y **robots.txt**: cuando haya dominio, dime cuál y
   reescribo las rutas relativas a URLs absolutas (2 minutos).
3. **og:image**: misma actualización a URL absoluta.
4. **Supabase**: con la URL pública fijada, pegamos claves en `config.js`,
   ejecuto `supabase/schema.sql` y el login demo pasa a auth real.

## Notas de operación

- El admin en demo guarda en el navegador de quien lo usa; hasta conectar
  Supabase, cada editor ve su propia copia local. Es la limitación esperada
  de esta fase.
- Tier gratuito de Workers: 100.000 peticiones/día — sobrado para meses.
- Para actualizar el sitio tras cambios locales: copia los archivos
  modificados a `public/` y vuelve a desplegar.
