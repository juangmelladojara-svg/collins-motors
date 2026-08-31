import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GaleriaCarousel } from '@/components/catalogo/galeria-carousel';
import { SimuladorCuotas } from '@/components/catalogo/simulador-cuotas';
import { obtenerPorSlug, obtenerImagenes } from '@/lib/vehiculos/queries';
import { imagenReferencial } from '@/lib/vehiculos/imagen-referencial';
import { formatCLP } from '@/lib/utils/formato';
import { CONTACTO, linkWhatsApp, linkMapa } from '@/lib/contacto';
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  Check,
  Gauge,
  Calendar,
  Fuel,
  Cog,
  DoorOpen,
  Palette,
  Car,
  MessageCircle,
  User,
  TrendingDown,
} from 'lucide-react';
import Link from 'next/link';
import { BotonWhatsApp } from '@/components/analitica/boton-whatsapp';

export const dynamic = 'force-dynamic';

interface VehiculoPageProps {
  // En Next 16 params es asíncrono: hay que await antes de leerlo.
  params: Promise<{ slug: string }>;
}

/**
 * Sin esto, compartir un auto por WhatsApp mandaba un link pelado: sin foto,
 * sin precio, sin nada. La ficha compartible es el principal canal de difusión
 * del negocio, así que el preview importa tanto como la página.
 */
export async function generateMetadata({ params }: VehiculoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehiculo = await obtenerPorSlug(slug);

  if (!vehiculo) {
    return { title: `Vehículo no encontrado | ${SITE_NAME}` };
  }

  const nombre = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`;
  const precio = formatCLP(vehiculo.precio);
  const titular = `${nombre} — ${precio}`;

  const ficha = [
    vehiculo.version,
    `${vehiculo.kilometraje.toLocaleString('es-CL')} km`,
    vehiculo.transmision === 'automatica' ? 'Automático' : 'Manual',
    precio,
  ]
    .filter(Boolean)
    .join(' · ');

  const descripcion = `${ficha}. Disponible en ${SITE_NAME}, ${vehiculo.ubicacion || 'Temuco'}.`;

  const fotos = await obtenerImagenes(vehiculo.id);
  const ruta = `/vehiculo/${vehiculo.slug}`;

  return {
    title: `${titular} | ${SITE_NAME}`,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      title: titular,
      description: descripcion,
      url: ruta,
      images: fotos.length > 0 ? [{ url: fotos[0], alt: nombre }] : undefined,
    },
    twitter: {
      title: titular,
      description: descripcion,
      images: fotos.length > 0 ? [fotos[0]] : undefined,
    },
  };
}

export default async function VehiculoPage({ params }: VehiculoPageProps) {
  const { slug } = await params;
  const vehiculo = await obtenerPorSlug(slug);

  if (!vehiculo) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Vehículo no encontrado</h1>
            <p className="text-muted-foreground mb-8">
              El vehículo que buscas no está disponible en este momento.
            </p>
            <Link
              href="/catalogo"
              className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition"
            >
              Volver al catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Fotos reales cargadas por el admin; los SVG de demo solo cubren los
  // vehículos de ejemplo que todavía no tienen imágenes.
  const imagenesReales = await obtenerImagenes(vehiculo.id);
  const imagenes = imagenesReales.length > 0 ? imagenesReales : [imagenReferencial(vehiculo)];

  const titulo = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`;
  const ahorro =
    vehiculo.precio_anterior && vehiculo.precio_anterior > vehiculo.precio
      ? vehiculo.precio_anterior - vehiculo.precio
      : 0;

  // Cada consulta llega al vendedor asignado a este vehículo, con el mensaje
  // ya escrito para que el cliente solo tenga que enviarlo.
  const whatsapp = linkWhatsApp(
    `Hola${vehiculo.vendedor_nombre ? ` ${vehiculo.vendedor_nombre.split(' ')[0]}` : ''}, vi el ${titulo} en la web de Collins Motors (${formatCLP(vehiculo.precio)}) y quiero cotizarlo.`,
    vehiculo.vendedor_telefono
  );

  const vendido = vehiculo.estado === 'vendido';
  const direccion = vehiculo.ubicacion || CONTACTO.direccion;

  const especificaciones = [
    { icono: Calendar, etiqueta: 'Año', valor: String(vehiculo.anio) },
    { icono: Gauge, etiqueta: 'Kilómetros', valor: `${vehiculo.kilometraje.toLocaleString('es-CL')} km` },
    { icono: Car, etiqueta: 'Carrocería', valor: vehiculo.carroceria },
    { icono: Cog, etiqueta: 'Transmisión', valor: vehiculo.transmision },
    { icono: Fuel, etiqueta: 'Combustible', valor: vehiculo.combustible },
    { icono: DoorOpen, etiqueta: 'Puertas', valor: String(vehiculo.puertas || 4) },
    ...(vehiculo.color ? [{ icono: Palette, etiqueta: 'Color', valor: vehiculo.color }] : []),
  ];

  const estadoBadge = {
    disponible: { texto: 'Disponible', clase: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    reservado: { texto: 'Reservado', clase: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    vendido: { texto: 'Vendido', clase: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
  }[vehiculo.estado];

  return (
    <>
      <Navbar />
      {/* pb extra en mobile para que la barra fija no tape el contenido */}
      <main className="min-h-screen py-8 md:py-14 pb-28 lg:pb-14 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link
            href="/catalogo"
            className="text-primary hover:underline text-sm font-semibold mb-5 inline-block"
          >
            ← Volver al catálogo
          </Link>

          {/* Encabezado */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${estadoBadge.clase}`}>
                {estadoBadge.texto}
              </span>
              {ahorro > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide bg-primary/10 text-primary">
                  <TrendingDown size={13} />
                  Precio rebajado
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold mb-3">{titulo}</h1>
            <p className="text-lg text-muted-foreground">
              {vehiculo.version && `${vehiculo.version} · `}
              {vehiculo.kilometraje.toLocaleString('es-CL')} km · {direccion}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ---------- Columna principal ---------- */}
            <div className="lg:col-span-2 space-y-8">
              <GaleriaCarousel
                marca={vehiculo.marca}
                modelo={vehiculo.modelo}
                fotos={imagenes.length}
                imageUrls={imagenes}
              />

              {/* Características: es lo que el vendedor eligió destacar, así que
                  va arriba, antes de la ficha técnica genérica. */}
              {vehiculo.caracteristicas && vehiculo.caracteristicas.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Lo que destaca</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehiculo.caracteristicas.map((caracteristica) => (
                      <li
                        key={caracteristica}
                        className="flex items-start gap-3 p-3 rounded-xl bg-muted"
                      >
                        <Check size={18} className="text-primary flex-shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="font-medium">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {vehiculo.descripcion && (
                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">Descripción</h2>
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {vehiculo.descripcion}
                  </p>
                </section>
              )}

              <section>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Ficha técnica</h2>
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
                  {especificaciones.map(({ icono: Icono, etiqueta, valor }) => (
                    <div key={etiqueta} className="bg-background p-4">
                      <dt className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                        <Icono size={14} />
                        {etiqueta}
                      </dt>
                      <dd className="text-lg font-medium capitalize">{valor}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Dónde verlo</h2>
                <a
                  href={linkMapa(direccion)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl border border-border hover:border-primary transition group"
                >
                  <MapPin size={22} className="text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">{direccion}</p>
                    <p className="text-sm text-muted-foreground">
                      Ven a verlo y pruébalo sin compromiso
                    </p>
                  </div>
                  <span className="text-sm font-bold text-primary group-hover:underline whitespace-nowrap">
                    Ver mapa →
                  </span>
                </a>
              </section>
            </div>

            {/* ---------- Panel de compra ---------- */}
            <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
              <div className="border-2 border-primary rounded-2xl p-6 bg-primary/[0.03]">
                <p className="text-sm text-muted-foreground mb-1">Precio</p>
                <p className="text-4xl font-semibold text-primary leading-none mb-2 tabular">
                  {formatCLP(vehiculo.precio)}
                </p>
                {ahorro > 0 && (
                  <p className="text-sm mb-4">
                    <span className="text-muted-foreground line-through">
                      {formatCLP(vehiculo.precio_anterior!)}
                    </span>{' '}
                    <span className="font-bold text-primary">Ahorras {formatCLP(ahorro)}</span>
                  </p>
                )}

                <div className="bg-background border border-border p-4 rounded-xl mb-5">
                  <p className="text-xs text-muted-foreground mb-1">Cuota estimada (60 meses)</p>
                  <p className="text-2xl font-semibold tabular">{formatCLP(Math.round(vehiculo.precio / 60))}/mes</p>
                </div>

                <div className="space-y-3">
                  {vendido ? (
                    // El link sigue vivo para quien lo recibió por WhatsApp hace
                    // semanas, pero mandarlo a cotizar algo ya vendido es peor
                    // que no responder: se le ofrece el resto del stock.
                    <>
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Este vehículo ya fue vendido.
                      </p>
                      <Link
                        href={`/catalogo?marca=${encodeURIComponent(vehiculo.marca)}`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-hover active:scale-[0.98] transition"
                      >
                        Ver otros {vehiculo.marca}
                      </Link>
                      <Link
                        href="/catalogo"
                        className="w-full flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition"
                      >
                        Ver todo el catálogo
                      </Link>
                    </>
                  ) : (
                    <>
                      <BotonWhatsApp
                        href={whatsapp}
                        vehiculo={titulo}
                        precio={vehiculo.precio}
                        origen="ficha"
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary-hover active:scale-[0.98] transition shadow-lg shadow-primary/20"
                      >
                        <MessageCircle size={20} />
                        {vehiculo.estado === 'reservado' ? 'CONSULTAR DISPONIBILIDAD' : '¡COTIZA AHORA!'}
                      </BotonWhatsApp>
                      <p className="text-xs text-center text-muted-foreground">
                        Te respondemos por WhatsApp en minutos
                      </p>

                      <SimuladorCuotas precioVehiculo={vehiculo.precio} isOpen={false} />
                    </>
                  )}
                </div>
              </div>

              {/* Vendedor a cargo de este vehículo */}
              {vehiculo.vendedor_nombre && (
                <div className="border border-border rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-bold mb-3">
                    Tu vendedor
                  </p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold truncate">{vehiculo.vendedor_nombre}</p>
                      <p className="text-sm text-muted-foreground">Collins Motors</p>
                    </div>
                  </div>
                  {vehiculo.vendedor_telefono && (
                    <a
                      href={`tel:${vehiculo.vendedor_telefono.replace(/\s/g, '')}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white active:scale-[0.98] transition"
                    >
                      <Phone size={16} />
                      {vehiculo.vendedor_telefono}
                    </a>
                  )}
                </div>
              )}

              {/* Opciones de financiamiento cargadas por el admin */}
              {vehiculo.opciones_financiamiento && vehiculo.opciones_financiamiento.length > 0 && (
                <div className="border border-border rounded-2xl p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-bold mb-3">
                    Formas de pago
                  </p>
                  <ul className="space-y-2.5">
                    {vehiculo.opciones_financiamiento.map((opcion) => (
                      <li key={opcion} className="flex items-start gap-2.5 text-sm">
                        <Check size={16} className="text-primary flex-shrink-0 mt-0.5" strokeWidth={3} />
                        <span>{opcion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border border-border rounded-2xl p-5 space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Revisado por Collins Motors</p>
                    <p className="text-muted-foreground">Documentación y mecánica al día</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-3 border-t border-border">
                  <Mail size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <a href={`mailto:${CONTACTO.email}`} className="hover:text-primary transition">
                    {CONTACTO.email}
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Barra fija en mobile: el panel de compra queda muy abajo al hacer scroll
          y ahí es donde se pierden las consultas desde el celular. */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t border-border px-4 py-3 flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Precio</p>
          <p className="text-lg font-semibold text-primary leading-tight truncate tabular">
            {formatCLP(vehiculo.precio)}
          </p>
        </div>
        {vendido ? (
          <Link
            href="/catalogo"
            className="flex-1 flex items-center justify-center px-4 py-3 bg-primary text-white font-bold rounded-xl active:scale-[0.98] transition"
          >
            Ver catálogo
          </Link>
        ) : (
          <BotonWhatsApp
            href={whatsapp}
            vehiculo={titulo}
            precio={vehiculo.precio}
            origen="ficha-mobile"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-xl active:scale-[0.98] transition"
          >
            <MessageCircle size={18} />
            {vehiculo.estado === 'reservado' ? 'CONSULTAR' : '¡COTIZA AHORA!'}
          </BotonWhatsApp>
        )}
      </div>

      <Footer />
    </>
  );
}
