import type { Vehiculo, FiltrosCatalogo } from './tipos';
import { createClient } from '@/lib/supabase/server';
import { VEHICULOS_MOCK } from './datos-mock';

// Usar mock data en desarrollo local, Supabase en producción
const USE_MOCK = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function listarVehiculos(filtros?: FiltrosCatalogo): Promise<Vehiculo[]> {
  // Fallback a mock data si Supabase no está configurado
  if (USE_MOCK) {
    return listarVehiculosMock(filtros);
  }

  const supabase = await createClient();
  let query = supabase
    .from('vehiculos')
    .select('*')
    .eq('publicado', true)
    .eq('estado', 'disponible');

  if (filtros?.marca) {
    query = query.ilike('marca', `%${filtros.marca}%`);
  }

  if (filtros?.carroceria) {
    query = query.eq('carroceria', filtros.carroceria);
  }

  if (filtros?.transmision) {
    query = query.eq('transmision', filtros.transmision);
  }

  if (filtros?.combustible) {
    query = query.eq('combustible', filtros.combustible);
  }

  if (filtros?.precio_min) {
    query = query.gte('precio', filtros.precio_min);
  }

  if (filtros?.precio_max) {
    query = query.lte('precio', filtros.precio_max);
  }

  if (filtros?.anio_min) {
    query = query.gte('anio', filtros.anio_min);
  }

  if (filtros?.anio_max) {
    query = query.lte('anio', filtros.anio_max);
  }

  if (filtros?.q) {
    query = query.or(`marca.ilike.%${filtros.q}%,modelo.ilike.%${filtros.q}%,version.ilike.%${filtros.q}%`);
  }

  // Ordenamiento
  if (filtros?.orden === 'precio_asc') {
    query = query.order('precio', { ascending: true });
  } else if (filtros?.orden === 'precio_desc') {
    query = query.order('precio', { ascending: false });
  } else if (filtros?.orden === 'anio_desc') {
    query = query.order('anio', { ascending: false });
  } else {
    query = query.order('fecha_publicacion', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }

  return data as Vehiculo[];
}

export async function obtenerPorSlug(slug: string): Promise<Vehiculo | null> {
  // Fallback a mock data
  if (USE_MOCK) {
    return VEHICULOS_MOCK.find((v) => v.slug === slug) || null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vehiculos')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching vehicle:', error);
    return null;
  }

  return data as Vehiculo;
}

export async function obtenerDestacados(): Promise<Vehiculo[]> {
  // Fallback a mock data
  if (USE_MOCK) {
    return VEHICULOS_MOCK.filter((v) => v.destacado && v.publicado);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vehiculos')
    .select('*')
    .eq('publicado', true)
    .eq('destacado', true)
    .order('fecha_publicacion', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured vehicles:', error);
    return [];
  }

  return data as Vehiculo[];
}

export async function obtenerMarcas(): Promise<string[]> {
  // Fallback a mock data
  if (USE_MOCK) {
    const marcas = new Set(VEHICULOS_MOCK.filter((v) => v.publicado).map((v) => v.marca));
    return Array.from(marcas).sort();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vehiculos')
    .select('marca')
    .eq('publicado', true)
    .order('marca', { ascending: true });

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  const marcas = new Set((data as { marca: string }[]).map((v) => v.marca));
  return Array.from(marcas).sort();
}

// Función auxiliar para mock data
function listarVehiculosMock(filtros?: FiltrosCatalogo): Vehiculo[] {
  let resultado = VEHICULOS_MOCK.filter((v) => v.publicado && v.estado === 'disponible');

  if (filtros?.marca) {
    resultado = resultado.filter((v) => v.marca.toLowerCase() === filtros.marca?.toLowerCase());
  }

  if (filtros?.carroceria) {
    resultado = resultado.filter((v) => v.carroceria === filtros.carroceria);
  }

  if (filtros?.transmision) {
    resultado = resultado.filter((v) => v.transmision === filtros.transmision);
  }

  if (filtros?.combustible) {
    resultado = resultado.filter((v) => v.combustible === filtros.combustible);
  }

  if (filtros?.precio_min) {
    resultado = resultado.filter((v) => v.precio >= filtros.precio_min!);
  }

  if (filtros?.precio_max) {
    resultado = resultado.filter((v) => v.precio <= filtros.precio_max!);
  }

  if (filtros?.anio_min) {
    resultado = resultado.filter((v) => v.anio >= filtros.anio_min!);
  }

  if (filtros?.anio_max) {
    resultado = resultado.filter((v) => v.anio <= filtros.anio_max!);
  }

  if (filtros?.q) {
    const q = filtros.q.toLowerCase();
    resultado = resultado.filter(
      (v) =>
        v.marca.toLowerCase().includes(q) ||
        v.modelo.toLowerCase().includes(q) ||
        v.version?.toLowerCase().includes(q)
    );
  }

  if (filtros?.orden === 'precio_asc') {
    resultado.sort((a, b) => a.precio - b.precio);
  } else if (filtros?.orden === 'precio_desc') {
    resultado.sort((a, b) => b.precio - a.precio);
  } else if (filtros?.orden === 'anio_desc') {
    resultado.sort((a, b) => b.anio - a.anio);
  } else {
    resultado.sort((a, b) => new Date(b.fecha_publicacion!).getTime() - new Date(a.fecha_publicacion!).getTime());
  }

  return resultado;
}
