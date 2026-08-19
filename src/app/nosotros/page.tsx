import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nosotros | Collins Motors',
  description: 'Conoce quiénes somos y por qué Collins Motors es tu mejor opción en Temuco.',
};

export default function NosotrosPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Sobre Collins Motors</h1>

        <section className="space-y-6 text-lg text-foreground">
          <p>
            Collins Motors es una automotora con presencia local en Temuco, La Araucanía.
            Nos dedicamos a la venta de vehículos usados de calidad con financiamiento disponible.
          </p>

          <h2 className="text-2xl font-bold mt-10">Nuestra Misión</h2>
          <p>
            Facilitar el acceso a vehículos de calidad a través de una experiencia transparente,
            rápida y confiable, apoyando a nuestros clientes con opciones de financiamiento flexibles.
          </p>

          <h2 className="text-2xl font-bold mt-10">Valores</h2>
          <ul className="space-y-3 list-disc list-inside">
            <li><strong>Transparencia:</strong> Información completa y honesta de cada vehículo</li>
            <li><strong>Confianza:</strong> Proceso de compra seguro y confiable</li>
            <li><strong>Atención Local:</strong> Respuesta rápida y personalizada</li>
            <li><strong>Calidad:</strong> Vehículos revisados y en buen estado</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">¿Por qué elegir Collins Motors?</h2>
          <ul className="space-y-3 list-disc list-inside">
            <li>Amplio inventario de vehículos en diferentes marcas y modelos</li>
            <li>Financiamiento disponible sin complicaciones</li>
            <li>Atención personalizada de nuestro equipo</li>
            <li>Presencia local con respuesta rápida</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
