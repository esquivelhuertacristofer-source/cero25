-- ============================================================
-- CERO25 — Parche 02
-- Solo lo NUEVO respecto al parche 01 (que ya ejecutaste).
-- Se puede correr varias veces sin errores.
-- ============================================================

-- 1) Enlace de vídeo/audio (YouTube, Spotify, Vimeo)
alter table articulos add column if not exists media text;
alter table programas add column if not exists url   text;

-- 2) Columna que usa la papelera para recordar el estado anterior
alter table articulos add column if not exists "estadoPrevio" text;

-- 3) Contador de lecturas para visitantes anónimos.
--    Escribir en "articulos" exige sesión iniciada, así que el lector
--    no podía sumar vistas. Esta función corre con permisos elevados
--    pero SOLO toca los contadores de artículos publicados.
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

-- 4) Verificación: debe devolver las 3 columnas nuevas
select column_name
  from information_schema.columns
 where table_name in ('articulos','programas')
   and column_name in ('media','url','estadoPrevio')
 order by column_name;
