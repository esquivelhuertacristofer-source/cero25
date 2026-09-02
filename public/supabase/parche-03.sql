-- ============================================================
-- CERO25 — Parche 03 (consolidado)
-- Una sola pegada arregla todo lo pendiente. Repetible sin errores.
--
-- 1) Las tarjetas de pódcast perdieron su foto al migrar
--    (la tabla no tenía columnas de imagen → caían al gradiente).
-- 2) Rellena las cinco portadas con sus créditos.
-- 3) Un correo no puede suscribirse dos veces al boletín.
-- ============================================================

-- 1) columnas de imagen para los programas
alter table programas add column if not exists img     text;
alter table programas add column if not exists credito text;

-- 2) portadas y créditos de los cinco programas
update programas set img='assets/podcast.jpg',     credito='Myotus · CC BY 4.0 · Wikimedia Commons'            where id='s1';
update programas set img='assets/hardware.jpg',    credito='Morn · CC BY-SA 4.0 · Wikimedia Commons'           where id='s2';
update programas set img='assets/cine.jpg',        credito='John Phelan · CC BY 4.0 · Wikimedia Commons'       where id='s3';
update programas set img='assets/videojuegos.jpg', credito='Evan-Amos · Dominio público · Wikimedia Commons'   where id='s4';
update programas set img='assets/esports.jpg',     credito='Chongkian · CC BY-SA 4.0 · Wikimedia Commons'      where id='s5';

-- 3) el boletín no admite el mismo correo dos veces
--    (el sitio ya trata el duplicado con elegancia: "Ese correo ya estaba suscrito")
create unique index if not exists suscriptores_email_unico
  on suscriptores (lower(email));

-- Verificación: 5 programas, todos con foto
select id, nombre, img from programas order by id;
