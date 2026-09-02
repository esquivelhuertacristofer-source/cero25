-- ============================================================
-- CERO25 — ESQUEMA SUPABASE
-- Ejecutar completo en el SQL Editor del proyecto.
-- Después: crear los usuarios en Authentication y sus filas en perfiles.
-- ============================================================

-- ---------- contenido ----------
create table if not exists categorias (
  slug   text primary key,
  nombre text not null
);

create table if not exists autores (
  id     text primary key,
  nombre text not null,
  rol    text
);

create table if not exists programas (
  id     text primary key,
  nombre text not null,
  host   text,
  color  text,
  art    text,
  glyph  text
);

create table if not exists articulos (
  id        text primary key,
  tipo      text not null default 'articulo',   -- articulo | video | short | podcast
  estado    text not null default 'borrador',   -- borrador | publicado | papelera
  titulo    text not null,
  slug      text unique not null,
  categoria text references categorias(slug),
  autor     text references autores(id),
  programa  text references programas(id),
  fecha     timestamptz not null default now(),
  vistas    integer not null default 0,
  img       text,          -- url en storage o ruta local
  credito   text,
  art       text,          -- poster de gradiente (g1..g12) si no hay img
  glyph     text,
  duracion  text,          -- para video/short
  extracto  text,
  cuerpo    jsonb,         -- array de bloques (markdown ligero)
  vd        jsonb          -- vistas diarias {"2026-09-02": n} para la gráfica
);

-- composición de portada (una sola fila con el JSON de curación)
create table if not exists portada (
  id     integer primary key default 1,
  config jsonb not null
);

-- biblioteca de medios (imágenes reutilizables; en producción url apunta a Storage)
create table if not exists medios (
  id      text primary key,
  url     text not null,
  credito text,
  fecha   timestamptz not null default now()
);

create table if not exists suscriptores (
  id    text primary key,
  email text unique not null,
  fecha timestamptz not null default now()
);

-- perfiles de usuario (roles del admin) — id = auth.users.id
create table if not exists perfiles (
  id     uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  rol    text not null default 'editor'  -- admin | editor
);

-- ---------- seguridad (RLS) ----------
alter table categorias    enable row level security;
alter table autores       enable row level security;
alter table programas     enable row level security;
alter table articulos     enable row level security;
alter table portada       enable row level security;
alter table suscriptores  enable row level security;
alter table perfiles      enable row level security;

-- lectura pública del contenido publicado
create policy "leer categorias"  on categorias  for select using (true);
create policy "leer autores"     on autores     for select using (true);
create policy "leer programas"   on programas   for select using (true);
create policy "leer portada"     on portada     for select using (true);
create policy "leer publicados"  on articulos   for select
  using (estado = 'publicado' or auth.role() = 'authenticated');

-- escritura solo autenticados (admin/editor)
create policy "escribir articulos" on articulos for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "escribir portada" on portada for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "escribir programas" on programas for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "escribir autores" on autores for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- boletín: cualquiera puede suscribirse; solo autenticados leen la lista
create policy "alta boletin"  on suscriptores for insert with check (true);
create policy "leer boletin"  on suscriptores for select using (auth.role() = 'authenticated');

-- perfiles: cada quien lee el suyo
create policy "leer mi perfil" on perfiles for select using (auth.uid() = id);

-- ---------- storage para imágenes ----------
-- En el panel: Storage → crear bucket "medios" (público).
-- Política del bucket: lectura pública, escritura autenticada.

-- ---------- después de ejecutar ----------
-- 1. Authentication → crear usuarios (admin@..., editor@...) con contraseña.
-- 2. Insertar sus filas en perfiles con el uuid de cada usuario y su rol.
-- 3. Migrar el seed: desde el admin en modo demo, Ajustes → "Exportar JSON"
--    y cargarlo con el script de migración, o insertar manualmente.
