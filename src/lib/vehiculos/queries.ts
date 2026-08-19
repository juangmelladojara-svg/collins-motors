import type { Vehiculo, FiltrosCatalogo } from './tipos';
import { VEHICULOS_MOCK } from './datos-mock';

// TODO: En Fase 2, reemplazar con queries reales a Supabase

export async function listarVehiculos(filtros?: FiltrosCatalogo): Promise<Vehiculo[]> {
  // Simulación: retornar mock data filtrado
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

  // Ordenamiento
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

export async function obtenerPorSlug(slug: string): Promise<Vehiculo | null> {
  return VEHICULOS_MOCK.find((v) => v.slug === slug) || null;
}

export async function obtenerDestacados(): Promise<Vehiculo[]> {
  return VEHICULOS_MOCK.filter((v) => v.destacado && v.publicado);
}

export async function obtenerMarcas(): Promise<string[]> {
  const marcas = new Set(VEHICULOS_MOCK.filter((v) => v.publicado).map((v) => v.marca));
  return Array.from(marcas).sort();
}
