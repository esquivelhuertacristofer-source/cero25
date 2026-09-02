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
