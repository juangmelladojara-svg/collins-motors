import { VEHICULOS_MOCK } from '@/lib/vehiculos/datos-mock';

export async function GET() {
  return Response.json({
    total: VEHICULOS_MOCK.length,
    vehiculos: VEHICULOS_MOCK.map(v => ({
      id: v.id,
      slug: v.slug,
      marca: v.marca,
      modelo: v.modelo,
      publicado: v.publicado,
      estado: v.estado,
    })),
  });
}
