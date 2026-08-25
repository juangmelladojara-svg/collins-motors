import { obtenerDestacados } from '@/lib/vehiculos/queries';
import { TarjetaVehiculoMejorada } from '@/components/catalogo/tarjeta-vehiculo-mejorada';

export async function Destacados() {
  const vehiculos = await obtenerDestacados();

  if (vehiculos.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Vehículos Destacados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Los mejores autos de nuestro inventario, listos para ti ahora mismo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehiculos.slice(0, 6).map((vehiculo) => (
            <TarjetaVehiculoMejorada key={vehiculo.id} vehiculo={vehiculo} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/catalogo"
            className="inline-block px-8 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white active:scale-[0.98] transition-all"
          >
            Ver todos los vehículos
          </a>
        </div>
      </div>
    </section>
  );
}
