-- CERO25 — Parche 01 (ejecutar en el SQL Editor de Supabase)
-- 1) La tabla medios no tenía políticas: sin esto la biblioteca sale vacía.
-- 2) La papelera necesita recordar el estado previo del artículo.

alter table medios enable row level security;

create policy "leer medios" on medios
  for select using (true);

create policy "escribir medios" on medios
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

alter table articulos add column if not exists "estadoPrevio" text;

-- 3) Enlace de vídeo/audio (YouTube, Spotify, Vimeo) por artículo y por programa.
alter table articulos add column if not exists media text;
alter table programas add column if not exists url   text;

-- 4) Contador de lecturas para visitantes anónimos.
--    Escribir en "articulos" exige sesión, así que el lector no podía sumar vistas.
--    Esta función corre con permisos elevados pero SOLO toca los contadores.
create or replace function registrar_vista(art_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare hoy text := to_char(now(), 'YYYY-MM-DD');
begin
  update articulos
     set vistas = coalesce(vistas, 0) + 1,
         vd = jsonb_set(
                coalesce(vd, '{}'::jsonb),
                array[hoy],
                to_jsonb(coalesce((vd ->> hoy)::int, 0) + 1),
                true)
   where id = art_id and estado = 'publicado';
end;
$$;

grant execute on function registrar_vista(text) to anon, authenticated;
