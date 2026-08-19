import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Collins Motors',
  description: 'Ponte en contacto con Collins Motors para consultas sobre vehículos o financiamiento.',
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">Contacto</h1>
        <p className="text-center text-muted-foreground mb-12">
          Ponte en contacto con nosotros. Te responderemos lo antes posible.
        </p>

        {/* Formulario de contacto - placeholder */}
        <form className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Nombre</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Mensaje</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tu mensaje..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover transition"
          >
            Enviar Mensaje
          </button>
        </form>

        {/* Información de contacto - placeholder */}
        <div className="mt-12 pt-12 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Dirección</h3>
            <p className="text-muted-foreground">
              [Dirección en Temuco] — Fase 1
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contacto</h3>
            <p className="text-muted-foreground">
              Teléfono: [Número]<br />
              Email: [Email]
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
