-- El plan del proyecto contemplaba crear este bucket en 0001, pero el SQL que
-- realmente se aplicó nunca lo incluyó. Sin bucket, toda subida de fotos fallaba
-- en silencio (el código descartaba el error), así que ningún vehículo tenía
-- imágenes y nadie recibía aviso.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehiculos',
  'vehiculos',
  true,
  10485760, -- 10 MB por foto
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Lectura pública: las fichas de vehículo son páginas abiertas.
drop policy if exists "Public read vehiculos bucket" on storage.objects;
create policy "Public read vehiculos bucket"
  on storage.objects for select
  using (bucket_id = 'vehiculos');

-- Escritura solo para el staff, con el mismo es_admin() que el resto del esquema.
drop policy if exists "Admin insert vehiculos bucket" on storage.objects;
create policy "Admin insert vehiculos bucket"
  on storage.objects for insert
  with check (bucket_id = 'vehiculos' and public.es_admin());

drop policy if exists "Admin update vehiculos bucket" on storage.objects;
create policy "Admin update vehiculos bucket"
  on storage.objects for update
  using (bucket_id = 'vehiculos' and public.es_admin());

drop policy if exists "Admin delete vehiculos bucket" on storage.objects;
create policy "Admin delete vehiculos bucket"
  on storage.objects for delete
  using (bucket_id = 'vehiculos' and public.es_admin());
