-- Agregar columnas de características, vendedor y ubicación a vehículos
ALTER TABLE public.vehiculos
ADD COLUMN IF NOT EXISTS caracteristicas JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS vendedor_nombre TEXT,
ADD COLUMN IF NOT EXISTS vendedor_telefono TEXT,
ADD COLUMN IF NOT EXISTS ubicacion TEXT,
ADD COLUMN IF NOT EXISTS opciones_financiamiento JSONB DEFAULT '[]';

-- Crear índice para búsqueda
CREATE INDEX IF NOT EXISTS vehiculos_ubicacion_idx ON public.vehiculos(ubicacion);
