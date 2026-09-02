# CERO25 — Producto editorial

Sitio editorial completo: portada curada, páginas de artículo y sección,
búsqueda, boletín y panel de redacción con login. Todo el contenido es
original de CERO25; las fotos son CC de Wikimedia (crédito embebido) o
pósters de gradiente propios.

## Cómo correrlo

Cualquier servidor estático sirve la carpeta. En local:
`http://localhost:8090/ringer-clone/`

## El modelo de publicación (la lógica de producto)

**Contenido y colocación están separados.** Publicar un artículo lo mete al
pool; dónde aparece en portada lo decide la composición:

| Sección           | Modo   | Regla |
|-------------------|--------|-------|
| Hero (carrusel)   | curado | 4 huecos, exige imagen panorámica |
| Lo último         | auto   | los 4 más recientes (sin shorts) |
| Banda             | curado | 1 hueco panorámico |
| Lecturas destacadas | mixto | enlaces = 6 más leídos (auto) · 2 tarjetas curadas |
| Vídeos            | mixto  | lista = 4 vídeos recientes (auto) · destacado y banner curados |
| Rails temáticos ×2 | curado | título editable + huecos elegidos |
| Features XL ×2    | curado | 1 hueco panorámico cada uno |
| Fila mini         | curado | 3 huecos compactos |
| Shorts            | auto   | los 5 shorts más recientes |
| Pódcast           | auto   | los programas dados de alta |
| Grandes lecturas  | auto   | longform (3+ párrafos), los 4 más recientes |

**Regla de oro:** un hueco curado vacío o con un borrador nunca rompe la
portada — el renderer lo rellena con el elegible más reciente.

El editor gestiona todo esto en **Admin → Portada**, que además avisa si
asignas una imagen vertical a un hueco que exige panorámica.

## Estructura

```
index.html          portada (shell; la llena render.js)
articulo.html       página de artículo (?slug=)
seccion.html        categoría / formato / búsqueda / archivo (?cat= ?tipo= ?q=)
admin/              panel de redacción (login, artículos, portada, boletín…)
data.js             seed de contenido
store.js            capa de datos (driver local ↔ Supabase)
render.js           renderiza la portada desde el store
config.js           claves de Supabase (vacías = modo demo)
supabase/           schema.sql + driver de producción
assets/             fotos CC locales
```

## Modo demo (hoy)

Sin claves en `config.js`, todo funciona con datos locales del navegador:

- **Login demo**: `admin@cero25.com / cero25admin` · `editor@cero25.com / cero25editor`
- Los cambios (artículos, portada, suscriptores) persisten en localStorage.
- Las imágenes subidas se optimizan (máx. 1280px, JPEG) y viven en el navegador.
- Ajustes → *Restaurar* vuelve al seed; *Exportar JSON* saca todo el contenido.

## Pasar a producción (Supabase)

1. Crear proyecto en supabase.com (plan gratuito alcanza).
2. SQL Editor → pegar y ejecutar `supabase/schema.sql` completo.
3. Authentication → crear los usuarios reales del equipo; insertar su fila
   en la tabla `perfiles` con rol `admin` o `editor`.
4. Storage → crear bucket público `medios` (para las imágenes subidas).
5. Pegar URL y anon key en `config.js`. Listo: el driver real se activa solo,
   el login pasa a ser auth de verdad y los roles salen de `perfiles`.
6. Migrar el seed: Admin → Ajustes → Exportar JSON, e insertar (o pedirme
   que genere el script de inserts a partir del export).

## Analítica de audiencia

**Cloudflare Web Analytics** — gratis, sin cookies y sin banner de consentimiento
(no rastrea individuos). Como el sitio ya vive en Cloudflare, se activa sin tocar
el código:

1. dash.cloudflare.com → **Analytics & Logs** → **Web Analytics**
2. **Add a site** → elegir `cero25.com.mx`
3. Activar **Automatic Setup** (Cloudflare inyecta el medidor solo)

Da: visitantes únicos, páginas más vistas, de dónde llegan (buscadores, redes,
directo), países y dispositivos. Complementa las lecturas del panel, que miden
artículo por artículo.

## Reproductores de vídeo y audio

No se alojan archivos: se pegan enlaces. En el editor, campo **Enlace de vídeo o
audio** acepta URLs de:

- **YouTube** — `youtube.com/watch?v=…`, `youtu.be/…`, Shorts y `/live/`
- **Spotify** — episodios, programas, temas, álbumes y listas
- **Vimeo** — `vimeo.com/…`

El sistema detecta la plataforma sola y muestra el reproductor arriba del
artículo. Los programas de la sección Pódcast también aceptan su enlace propio.

## Roles

- **admin**: todo el panel.
- **editor**: Panel, Artículos, Portada y Pódcast (sin Autores/Boletín/Ajustes).
