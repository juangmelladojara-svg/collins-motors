import { obtenerPorSlug } from '@/lib/vehiculos/queries';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || 'toyota-corolla-2020-abc123';

  const vehiculo = await obtenerPorSlug(slug);

  return Response.json({
    slug,
    resultado: vehiculo || 'No encontrado',
  });
}
