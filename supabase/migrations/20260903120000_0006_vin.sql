-- VIN (número de chasis) para los feeds de anuncios.
--
-- Meta Automotive Inventory Ads segmenta a nivel de VIN y lo recomienda como
-- identificador. Queda opcional a propósito: un vehículo sin VIN cargado igual
-- entra al feed, solo pierde precisión de segmentación. Si Google Vehicle Ads
-- llega a Chile algún día, ahí sí pasa a ser obligatorio y el dato ya estaría.

ALTER TABLE public.vehiculos
ADD COLUMN IF NOT EXISTS vin TEXT;

-- Un VIN repetido hace que las plataformas rechacen ambas publicaciones, así
-- que se impide desde la base. El índice ignora los nulos, que son válidos.
CREATE UNIQUE INDEX IF NOT EXISTS vehiculos_vin_unico
  ON public.vehiculos (vin)
  WHERE vin IS NOT NULL;
