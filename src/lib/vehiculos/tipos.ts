export type Carroceria = 'sedan' | 'suv' | 'pickup' | 'hatchback' | 'camioneta' | 'furgon' | 'coupe' | 'station_wagon';
export type Transmision = 'manual' | 'automatica';
export type Combustible = 'bencina' | 'diesel' | 'electrico' | 'hibrido';
export type Estado = 'disponible' | 'reservado' | 'vendido';

export interface Vehiculo {
  id: string;
  slug: string;
  marca: string;
  modelo: string;
  version?: string;
  anio: number;
  precio: number;
  precio_anterior?: number;
  kilometraje: number;
  carroceria: Carroceria;
  transmision: Transmision;
  combustible: Combustible;
  color?: string;
  puertas?: number;
  descripcion?: string;
  estado: Estado;
  publicado: boolean;
  destacado: boolean;
  meta_descripcion?: string;
  fecha_publicacion?: string;
  caracteristicas?: string[];
  vendedor_nombre?: string;
  vendedor_telefono?: string;
  ubicacion?: string;
  opciones_financiamiento?: string[];
  created_at: string;
  updated_at: string;
}

export interface VehiculoImagen {
  id: string;
  vehiculo_id: string;
  storage_path: string;
  orden: number;
  es_principal: boolean;
  created_at: string;
}

export interface FiltrosCatalogo {
  marca?: string;
  carroceria?: Carroceria;
  transmision?: Transmision;
  combustible?: Combustible;
  precio_min?: number;
  precio_max?: number;
  anio_min?: number;
  anio_max?: number;
  q?: string;
  orden?: 'precio_asc' | 'precio_desc' | 'anio_desc' | 'recientes';
  page?: number;
}

export interface MensajeContacto {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  vehiculo_id?: string;
  leido: boolean;
  created_at: string;
}
