-- Tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS public.mensajes_contacto (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  asunto text NOT NULL,
  mensaje text NOT NULL,
  vehiculo_id uuid REFERENCES public.vehiculos(id) ON DELETE SET NULL,
  estado text DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'respondido', 'archivado')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS mensajes_contacto_created_at_idx ON public.mensajes_contacto(created_at);
CREATE INDEX IF NOT EXISTS mensajes_contacto_estado_idx ON public.mensajes_contacto(estado);
CREATE INDEX IF NOT EXISTS mensajes_contacto_vehiculo_id_idx ON public.mensajes_contacto(vehiculo_id);

-- RLS
ALTER TABLE public.mensajes_contacto ENABLE ROW LEVEL SECURITY;

-- Políticas: solo admins pueden ver y gestionar
CREATE POLICY "Admin full access" ON public.mensajes_contacto
  FOR ALL USING (public.es_admin());

CREATE POLICY "Public can insert" ON public.mensajes_contacto
  FOR INSERT WITH CHECK (true);
