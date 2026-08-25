-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Tabla de perfiles de usuarios
CREATE TABLE IF NOT EXISTS public.perfiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text,
  rol text DEFAULT 'staff' CHECK (rol IN ('admin', 'staff')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabla de vehículos
CREATE TABLE IF NOT EXISTS public.vehiculos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text UNIQUE NOT NULL,
  marca text NOT NULL,
  modelo text NOT NULL,
  version text,
  anio integer NOT NULL,
  precio bigint NOT NULL,
  precio_anterior bigint,
  kilometraje integer NOT NULL,
  carroceria text NOT NULL,
  transmision text NOT NULL,
  combustible text NOT NULL,
  color text,
  puertas integer DEFAULT 4,
  descripcion text,
  estado text DEFAULT 'disponible' CHECK (estado IN ('disponible', 'reservado', 'vendido')),
  publicado boolean DEFAULT false,
  destacado boolean DEFAULT false,
  meta_descripcion text,
  fecha_publicacion timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabla de imágenes de vehículos
CREATE TABLE IF NOT EXISTS public.vehiculo_imagenes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehiculo_id uuid NOT NULL REFERENCES public.vehiculos(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  orden integer DEFAULT 0,
  es_principal boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS vehiculos_slug_idx ON public.vehiculos(slug);
CREATE INDEX IF NOT EXISTS vehiculos_marca_idx ON public.vehiculos(marca);
CREATE INDEX IF NOT EXISTS vehiculos_publicado_idx ON public.vehiculos(publicado);
CREATE INDEX IF NOT EXISTS vehiculo_imagenes_vehiculo_id_idx ON public.vehiculo_imagenes(vehiculo_id);
CREATE INDEX IF NOT EXISTS vehiculo_imagenes_orden_idx ON public.vehiculo_imagenes(orden);

-- Función para verificar si es admin
CREATE OR REPLACE FUNCTION public.es_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = auth.uid() AND rol = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para manejar nuevo usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre, rol)
  VALUES (new.id, new.email, 'staff');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrar usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Habilitar RLS
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculo_imagenes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: perfiles (solo admins ven todo)
CREATE POLICY "Admin solo" ON public.perfiles
  FOR ALL USING (public.es_admin());

-- Políticas RLS: vehículos (público ve solo publicados, admin ve todo)
CREATE POLICY "Public read published vehicles" ON public.vehiculos
  FOR SELECT USING (publicado = true OR public.es_admin());

CREATE POLICY "Admin full access" ON public.vehiculos
  FOR ALL USING (public.es_admin());

-- Políticas RLS: imágenes (público ve solo si vehículo publicado)
CREATE POLICY "Public read images of published vehicles" ON public.vehiculo_imagenes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vehiculos v
      WHERE v.id = vehiculo_imagenes.vehiculo_id AND v.publicado = true
    ) OR public.es_admin()
  );

CREATE POLICY "Admin full access images" ON public.vehiculo_imagenes
  FOR ALL USING (public.es_admin());
