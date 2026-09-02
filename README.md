# CERO25

Plataforma editorial de videojuegos, cine y cultura digital en español.
Sitio público + panel de redacción, desplegada en Cloudflare con dominio
**cero25.com.mx**.

## Estructura

```
public/           el sitio completo (portada, artículo, sección, admin, PWA)
public/admin/     panel de redacción (login, artículos, portada, medios…)
public/supabase/  esquema SQL y driver para producción
wrangler.toml     configuración de despliegue en Cloudflare Workers
```

## Desarrollo local

Cualquier servidor estático sirviendo `public/`. Sin build, sin dependencias.

## Despliegue

- **Automático**: cada push a `main` despliega vía la integración Git de
  Cloudflare (Workers & Pages → conectar este repo).
- **Manual**: `npx wrangler@latest deploy`

Guía completa: [README-CLOUDFLARE.md](README-CLOUDFLARE.md) ·
Producto y lógica editorial: [public/README-PRODUCTO.md](public/README-PRODUCTO.md)

## Acceso demo al panel

`/admin/` — admin@cero25.com / cero25admin (hasta conectar Supabase)
