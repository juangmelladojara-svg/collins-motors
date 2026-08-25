import { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { Destacados } from '@/components/home/destacados';
import { ValorMarca } from '@/components/home/valor-marca';
import { obtenerMarcas, listarVehiculos, obtenerImagenesPrincipales } from '@/lib/vehiculos/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Collins Motors — Vehículos Usados en Temuco',
  description: 'Encuentra tu próximo vehículo en Collins Motors. Amplio inventario de autos usados con financiamiento disponible.',
};

export default async function Home() {
  const [marcas, vehiculos] = await Promise.all([obtenerMarcas(), listarVehiculos()]);

  // El hero abre con inventario real, no con una ilustración: el auto es el
  // producto. Se elige el primero que tenga foto cargada.
  const fotos = await obtenerImagenesPrincipales(vehiculos.map((v) => v.id));
  const portada = vehiculos.find((v) => fotos[v.id]?.url);

  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero
          marcas={marcas}
          vehiculoPortada={portada}
          imagenPortada={portada ? fotos[portada.id].url : undefined}
        />
        <Destacados />
        <ValorMarca />
      </main>
      <Footer />
    </>
  );
}
