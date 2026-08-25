-- Agregar columna tsvector para búsqueda full-text
ALTER TABLE public.vehiculos
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Función para actualizar search_vector
CREATE OR REPLACE FUNCTION public.update_vehiculos_search()
RETURNS trigger AS $$
BEGIN
  new.search_vector :=
    setweight(to_tsvector('spanish', coalesce(new.marca, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(new.modelo, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(new.version, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(new.color, '')), 'C') ||
    setweight(to_tsvector('spanish', coalesce(new.descripcion, '')), 'D');
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar search_vector
DROP TRIGGER IF EXISTS on_vehiculos_update ON public.vehiculos;
CREATE TRIGGER on_vehiculos_update
  BEFORE INSERT OR UPDATE ON public.vehiculos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vehiculos_search();

-- Índice GIN para búsqueda full-text
CREATE INDEX IF NOT EXISTS vehiculos_search_idx ON public.vehiculos USING GIN (search_vector);

-- Índices adicionales para filtros comunes
CREATE INDEX IF NOT EXISTS vehiculos_carroceria_idx ON public.vehiculos(carroceria);
CREATE INDEX IF NOT EXISTS vehiculos_transmision_idx ON public.vehiculos(transmision);
CREATE INDEX IF NOT EXISTS vehiculos_combustible_idx ON public.vehiculos(combustible);
CREATE INDEX IF NOT EXISTS vehiculos_anio_idx ON public.vehiculos(anio);
CREATE INDEX IF NOT EXISTS vehiculos_precio_idx ON public.vehiculos(precio);
CREATE INDEX IF NOT EXISTS vehiculos_publicado_destacado_idx ON public.vehiculos(publicado, destacado);
