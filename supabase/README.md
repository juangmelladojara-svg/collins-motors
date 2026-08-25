# Migraciones de Supabase

## Estado

Las migraciones `0001`–`0004` se aplicaron originalmente **directo contra el
proyecto remoto**, sin quedar versionadas en el repo. Los archivos de esta
carpeta se reconstruyeron desde `supabase_migrations.schema_migrations` del
proyecto, así que el nombre de cada archivo (`<version>_<nombre>.sql`) coincide
exactamente con la versión registrada en el remoto. El CLI de Supabase las
reconoce como ya aplicadas y no intentará volver a ejecutarlas.

De la `0005` en adelante, los archivos son la fuente de verdad.

## Por qué importa

El bucket de Storage `vehiculos` estaba en el plan del proyecto pero nunca entró
en el SQL que realmente se ejecutó. Como no había nada versionado, no había forma
de notar la diferencia entre lo planeado y lo aplicado. La subida de fotos falló
en silencio durante todo ese tiempo. La `0005` corrige eso.

## Regla

Toda migración nueva se agrega **primero como archivo aquí** y después se aplica.
Nunca al revés.
