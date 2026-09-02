# CERO25 — Auditoría del desarrollo (1 sep 2026)

## Estado: producto funcional en modo demo, listo para revisión de cliente

### ✅ Completo y verificado

**Sitio público**
- Portada data-driven con el diseño aprobado (verificado por diff contra la
  versión estática: CSS intacto, 14/14 clases de sección presentes)
- Página de artículo (cuerpo, relacionados, JSON-LD NewsArticle)
- Sección / búsqueda / archivo (`?cat= ?tipo= ?q=`)
- Boletín funcional (guarda suscriptores) · navegación completa · favicon
- 30 piezas de contenido original en español (20 notas, 5 vídeos, 5 shorts)
- SEO: metas OG/Twitter, canonical, theme-color, JSON-LD (WebSite +
  SearchAction + NewsArticle), robots.txt (admin excluido), sitemap.xml

**Panel de redacción (tema claro)**
- Login con roles admin/editor · dashboard con métricas
- CRUD de artículos con filtros · editor con vista previa en vivo,
  contadores SEO (título 75 / extracto 160), slug y fecha editables,
  subida de imagen auto-optimizada (1280px), pósters de gradiente, Ctrl+S
- Curación de portada: 13 secciones con modo auto/curado/mixto,
  validación de encuadre (aviso si imagen vertical va a hueco panorámico)
- Pódcast y autores con formularios inline · boletín con export CSV
- Ajustes: estado del sistema, export JSON, reset de demo

**Arquitectura**
- Capa `CeroStore` con driver intercambiable (Local hoy / Supabase después)
- `schema.sql` completo con RLS · driver de producción escrito
- Regla "nunca huecos rotos" en la resolución de portada

### ⚠️ Deuda conocida (aceptada en demo, resolver en producción)

1. **Densidad fotográfica**: la maqueta aprobada tenía 45 fotos; el producto
   tiene 15 propias (CC) + gradientes. Se cierra cuando el cliente aporte
   assets o se haga una cacería CC ampliada. *Es la diferencia visual real.*
2. **SEO limitado por render en JS**: los buscadores modernos indexan JS,
   pero para SEO serio de un medio hace falta prerender/SSG (Netlify
   prerendering o build step al pasar a Supabase). El sitemap lista
   secciones; los artículos entrarán cuando haya URLs prerenderizadas.
3. **Imágenes subidas en demo** viven en localStorage (límite ~5MB del
   navegador). En producción van a Supabase Storage.
4. **Auth en demo es simulada** (client-side). Real con Supabase.
5. Reproductor de vídeo: placeholder (se conecta a YouTube/Vimeo/archivo
   cuando haya material real).

### 📋 Faltantes para lanzamiento real (por prioridad)

1. **Repositorio Git** + Netlify conectado (deploy automático, historial)
2. **Supabase**: claves → schema → usuarios → migrar seed (30 min)
3. **Dominio propio** + HTTPS (Netlify lo da) + reescribir sitemap absoluto
4. Prerender para SEO de artículos
5. Páginas legales reales (privacidad/términos/cookies — hay base en la
   plantilla masonry) + banner de consentimiento si hay analytics
6. Analytics (Plausible recomendado: sin cookies, sin banner)
7. Boletín conectado a un servicio de envío real (Brevo/Buttondown)
8. Accesibilidad: pasada formal con lector de pantalla (la base es buena:
   aria-labels, foco visible, reduced-motion)
9. Imagen OG dedicada 1200×630 con el logo (hoy usa una foto CC)
10. Página 404 propia

### ✅ Mejoras implementadas en esta ronda

- **Programación de publicación**: publicado + fecha futura = "Programado"
  (oculto en el sitio hasta la hora; badge propio en el admin)
- **Autosave** del editor cada 8s con recuperación al volver
- **Vista previa completa** desde el editor ("Guardar y previsualizar"; los
  borradores se abren con banner de aviso y no cuentan vistas)
- **Vistas reales**: cada lectura suma; "más leídos" ahora es dinámico;
  columna de vistas en el admin
- **Duplicar artículo** desde la tabla
- **Página 404** propia
- Densidad fotográfica: 14 fotos CC nuevas (25/44 piezas con foto; el
  100% de los escaparates) + 4 en reserva en `assets/`

### 💡 Siguientes mejoras sugeridas (no bloqueantes)

- Historial de versiones por artículo
- Búsqueda con resaltado de términos
- Modo oscuro del sitio público (los tokens ya lo permiten)
- RSS feed (generarlo en el build cuando haya prerender)
