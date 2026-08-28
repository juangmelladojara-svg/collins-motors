import { obtenerDestacados, listarVehiculos, obtenerImagenesPrincipales } from '@/lib/vehiculos/queries';
import { TarjetaVehiculoMejorada } from '@/components/catalogo/tarjeta-vehiculo-mejorada';
import Link from 'next/link';

export async function Destacados() {
  const marcados = await obtenerDestacados();

  // Si nadie marcó vehículos como destacados, la home se quedaba sin esta
  // sección entera. Mejor mostrar lo más nuevo y decir que es lo más nuevo.
  const hayMarcados = marcados.length > 0;
  const vehiculos = (hayMarcados ? marcados : await listarVehiculos()).slice(0, 6);

  if (vehiculos.length === 0) return null;

  // Las tarjetas no recibían imagenUrl, así que en la home salían todas con el
  // placeholder "Sin fotos" aunque el catálogo sí las mostrara.
  const fotos = await obtenerImagenesPrincipales(vehiculos.map((v) => v.id));

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3">
              {hayMarcados ? 'Selección' : 'Recién llegados'}
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold">
              {hayMarcados ? 'Vehículos destacados' : 'Últimos ingresos'}
            </h2>
          </div>

          <Link
            href="/catalogo"
            className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
          >
            Ver todo el catálogo →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {vehiculos.map((vehiculo) => (
            <TarjetaVehiculoMejorada
              key={vehiculo.id}
              vehiculo={vehiculo}
              imagenUrl={fotos[vehiculo.id]?.url}
              totalFotos={fotos[vehiculo.id]?.total ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
