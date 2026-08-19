import { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FiltrosCatalogo } from '@/components/catalogo/filtros-catalogo';
import { TarjetaVehiculoMejorada } from '@/components/catalogo/tarjeta-vehiculo-mejorada';
import { listarVehiculos, obtenerMarcas } from '@/lib/vehiculos/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catálogo de Vehículos | Collins Motors',
  description: 'Explora nuestro catálogo de vehículos usados con filtros por marca, modelo, año y precio.',
};

interface CatalogoPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  // Normalizar searchParams (pueden ser arrays)
  const marca = typeof searchParams.marca === 'string' ? searchParams.marca : undefined;
  const carroceria = typeof searchParams.carroceria === 'string' ? (searchParams.carroceria as any) : undefined;
  const transmision = typeof searchParams.transmision === 'string' ? (searchParams.transmision as any) : undefined;
  const combustible = typeof searchParams.combustible === 'string' ? (searchParams.combustible as any) : undefined;

  const filtros = {
    marca,
    carroceria,
    transmision,
    combustible,
    precio_min: searchParams.precio_min
      ? typeof searchParams.precio_min === 'string'
        ? parseInt(searchParams.precio_min)
        : undefined
      : undefined,
    precio_max: searchParams.precio_max
      ? typeof searchParams.precio_max === 'string'
        ? parseInt(searchParams.precio_max)
        : undefined
      : undefined,
    anio_min: searchParams.anio_min
      ? typeof searchParams.anio_min === 'string'
        ? parseInt(searchParams.anio_min)
        : undefined
      : undefined,
    anio_max: searchParams.anio_max
      ? typeof searchParams.anio_max === 'string'
        ? parseInt(searchParams.anio_max)
        : undefined
      : undefined,
    q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
  };

  const [vehiculos, marcas] = await Promise.all([
    listarVehiculos(filtros),
    obtenerMarcas(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12 md:py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Catálogo de Vehículos
            </h1>
            <p className="text-lg text-muted-foreground">
              {vehiculos.length} vehículos disponibles en Temuco
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar con filtros */}
            <div className="lg:col-span-1">
              <FiltrosCatalogo marcas={marcas} />
            </div>

            {/* Grilla de vehículos */}
            <div className="lg:col-span-3">
              {vehiculos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vehiculos.map((vehiculo) => (
                    <TarjetaVehiculoMejorada key={vehiculo.id} vehiculo={vehiculo} />
                  ))}
                </div>
              ) : (
                <div className="col-span-full text-center py-20">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    No encontramos vehículos
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Intenta ajustar los filtros para ver más opciones
                  </p>
                  <a
                    href="/catalogo"
                    className="inline-block px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition"
                  >
                    Ver todos los vehículos
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
