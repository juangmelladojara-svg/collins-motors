import { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { Destacados } from '@/components/home/destacados';
import { ValorMarca } from '@/components/home/valor-marca';
import { obtenerMarcas } from '@/lib/vehiculos/queries';

export const metadata: Metadata = {
  title: 'Collins Motors — Vehículos Usados en Temuco',
  description: 'Encuentra tu próximo vehículo en Collins Motors. Amplio inventario de autos usados con financiamiento disponible.',
};

export default async function Home() {
  const marcas = await obtenerMarcas();

  return (
    <>
      <Navbar />
      <main className="flex flex-col">
        <Hero marcas={marcas} />
        <Destacados />
        <ValorMarca />
      </main>
      <Footer />
    </>
  );
}
