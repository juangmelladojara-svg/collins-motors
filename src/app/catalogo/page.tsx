import { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FiltrosCatalogo } from '@/components/catalogo/filtros-catalogo';
import { TarjetaVehiculoMejorada } from '@/components/catalogo/tarjeta-vehiculo-mejorada';
import { listarVehiculos, obtenerMarcas, obtenerImagenesPrincipales } from '@/lib/vehiculos/queries';
import type { FiltrosCatalogo as FiltrosCatalogoTipo } from '@/lib/vehiculos/tipos';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catálogo de Vehículos | Collins Motors',
  description: 'Explora nuestro catálogo de vehículos usados con filtros por marca, modelo, año y precio.',
};

interface CatalogoPageProps {
  // En Next 16 searchParams es asíncrono: hay que await antes de leerlo.
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const sp = await searchParams;

  // Normalizar (un mismo filtro repetido en la URL llega como array)
  const texto = (valor: string | string[] | undefined) =>
    typeof valor === 'string' && valor !== '' ? valor : undefined;

  const numero = (valor: string | string[] | undefined) => {
    const bruto = texto(valor);
    if (!bruto) return undefined;
    const n = parseInt(bruto, 10);
    return Number.isNaN(n) ? undefined : n;
  };

  const filtros = {
    marca: texto(sp.marca),
    carroceria: texto(sp.carroceria) as FiltrosCatalogoTipo['carroceria'],
    transmision: texto(sp.transmision) as FiltrosCatalogoTipo['transmision'],
    combustible: texto(sp.combustible) as FiltrosCatalogoTipo['combustible'],
    precio_min: numero(sp.precio_min),
    precio_max: numero(sp.precio_max),
    anio_min: numero(sp.anio_min),
    anio_max: numero(sp.anio_max),
    q: texto(sp.q),
    orden: texto(sp.orden) as FiltrosCatalogoTipo['orden'],
  };

  const [vehiculos, marcas] = await Promise.all([
    listarVehiculos(filtros),
    obtenerMarcas(),
  ]);

  // Una sola consulta para las fotos de toda la grilla, no una por tarjeta.
  const fotos = await obtenerImagenesPrincipales(vehiculos.map((v) => v.id));

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-10 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-4xl md:text-6xl font-semibold mb-2">Catálogo</h1>
            <p className="text-lg text-muted-foreground">
              Vehículos seleccionados y revisados en Temuco
            </p>
          </header>

          {/* Filtros en barra superior: libera el ancho completo para la grilla,
              que pasa de 2 a 3 columnas y muestra más autos sin hacer scroll. */}
          <div className="mb-8">
            <FiltrosCatalogo marcas={marcas} total={vehiculos.length} />
          </div>

          {vehiculos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehiculos.map((vehiculo) => (
                <TarjetaVehiculoMejorada
                  key={vehiculo.id}
                  vehiculo={vehiculo}
                  imagenUrl={fotos[vehiculo.id]?.url}
                  totalFotos={fotos[vehiculo.id]?.total ?? 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-border rounded-2xl bg-surface">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    No encontramos vehículos
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Prueba quitando algún filtro o escribiendo solo la marca
                  </p>
                  <a
                    href="/catalogo"
                    className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition"
                  >
                    Ver todos los vehículos
                  </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
