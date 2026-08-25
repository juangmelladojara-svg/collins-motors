import { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GaleriaCarousel } from '@/components/catalogo/galeria-carousel';
import { SimuladorCuotas } from '@/components/catalogo/simulador-cuotas';
import { obtenerPorSlug, obtenerImagenes } from '@/lib/vehiculos/queries';
import { formatCLP } from '@/lib/utils/formato';
import { Phone, Mail, MapPin, Shield, Zap, Users, Calendar, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface VehiculoPageProps {
  // En Next 16 params es asíncrono: hay que await antes de leerlo.
  params: Promise<{ slug: string }>;
}

export default async function VehiculoPage({ params }: VehiculoPageProps) {
  const { slug } = await params;
  const vehiculo = await obtenerPorSlug(slug);

  // Mapear imágenes según el vehículo
  const getImagenesParaVehiculo = (slug: string): string[] => {
    if (slug.includes('toyota')) {
      return [
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221600%22 height=%22900%22%3E%3Crect fill=%22%23e8f0f5%22 width=%221600%22 height=%22900%22/%3E%3Crect fill=%22%2387ceeb%22 width=%221600%22 height=%22450%22/%3E%3Ccircle cx=%22800%22 cy=%22300%22 r=%22200%22 fill=%22%23ffffff%22 opacity=%220.1%22/%3E%3Crect x=%22400%22 y=%22350%22 width=%22800%22 height=%22400%22 fill=%22%23c0c0c0%22 rx=%2240%22/%3E%3Ccircle cx=%22550%22 cy=%22650%22 r=%2260%22 fill=%22%23333333%22/%3E%3Ccircle cx=%221050%22 cy=%22650%22 r=%2260%22 fill=%22%23333333%22/%3E%3Crect x=%22420%22 y=%22400%22 width=%22600%22 height=%22200%22 fill=%22%23888888%22 rx=%2220%22/%3E%3Ctext x=%22800%22 y=%22850%22 font-size=%2224%22 fill=%22%23666%22 text-anchor=%22middle%22 font-family=%22Arial%22%3EToyota Corolla 2020 - Gris%3C/text%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221600%22 height=%22900%22%3E%3Crect fill=%22%23e8f0f5%22 width=%221600%22 height=%22900%22/%3E%3Crect fill=%22%2387ceeb%22 width=%221600%22 height=%22450%22/%3E%3Crect x=%22300%22 y=%22380%22 width=%22900%22 height=%22350%22 fill=%22%23a9a9a9%22 rx=%2240%22/%3E%3Ccircle cx=%22450%22 cy=%22680%22 r=%2255%22 fill=%22%23222222%22/%3E%3Ccircle cx=%221150%22 cy=%22680%22 r=%2255%22 fill=%22%23222222%22/%3E%3Crect x=%22320%22 y=%22430%22 width=%22700%22 height=%22180%22 fill=%22%23757575%22 rx=%2220%22/%3E%3Crect x=%221050%22 y=%22450%22 width=%22150%22 height=%22120%22 fill=%22%23555555%22/%3E%3Ctext x=%22800%22 y=%22850%22 font-size=%2224%22 fill=%22%23666%22 text-anchor=%22middle%22 font-family=%22Arial%22%3EToyota Corolla 2020 - Lateral%3C/text%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221600%22 height=%22900%22%3E%3Crect fill=%22%23f0f8ff%22 width=%221600%22 height=%22900%22/%3E%3Crect fill=%22%23b0e0e6%22 width=%221600%22 height=%22450%22/%3E%3Crect x=%22550%22 y=%22350%22 width=%22500%22 height=%22380%22 fill=%22%23c0c0c0%22 rx=%2230%22/%3E%3Ccircle cx=%22650%22 cy=%22700%22 r=%2250%22 fill=%22%23333333%22/%3E%3Ccircle cx=%22950%22 cy=%22700%22 r=%2250%22 fill=%22%23333333%22/%3E%3Crect x=%22580%22 y=%22400%22 width=%22450%22 height=%22200%22 fill=%22%23888888%22 rx=%2215%22/%3E%3Ctext x=%22800%22 y=%22850%22 font-size=%2224%22 fill=%22%23666%22 text-anchor=%22middle%22 font-family=%22Arial%22%3EToyota Corolla 2020 - Trasera%3C/text%3E%3C/svg%3E'
      ];
    } else if (slug.includes('hyundai')) {
      return [
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221600%22 height=%22900%22%3E%3Crect fill=%22%23f5f5f5%22 width=%221600%22 height=%22900%22/%3E%3Crect fill=%22%23a8d8ff%22 width=%221600%22 height=%22450%22/%3E%3Crect x=%22350%22 y=%22300%22 width=%22900%22 height=%22450%22 fill=%22%23222222%22 rx=%2250%22/%3E%3Ccircle cx=%22500%22 cy=%22700%22 r=%2265%22 fill=%22%23111111%22/%3E%3Ccircle cx=%221100%22 cy=%22700%22 r=%2265%22 fill=%22%23111111%22/%3E%3Crect x=%22380%22 y=%22360%22 width=%22700%22 height=%22240%22 fill=%22%23444444%22 rx=%2225%22/%3E%3Crect x=%221100%22 y=%22400%22 width=%22180%22 height=%22150%22 fill=%22%23333333%22/%3E%3Ctext x=%22800%22 y=%22850%22 font-size=%2224%22 fill=%22%23666%22 text-anchor=%22middle%22 font-family=%22Arial%22%3EHyundai Tucson 2022 - Negro%3C/text%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221600%22 height=%22900%22%3E%3Crect fill=%22%23f5f5f5%22 width=%221600%22 height=%22900%22/%3E%3Crect fill=%22%23a8d8ff%22 width=%221600%22 height=%22450%22/%3E%3Crect x=%22250%22 y=%22320%22 width=%221100%22 height=%22420%22 fill=%22%23222222%22 rx=%2250%22/%3E%3Ccircle cx=%22420%22 cy=%22710%22 r=%2265%22 fill=%22%23111111%22/%3E%3Ccircle cx=%221180%22 cy=%22710%22 r=%2265%22 fill=%22%23111111%22/%3E%3Crect x=%22280%22 y=%22380%22 width=%22850%22 height=%22220%22 fill=%22%23444444%22 rx=%2225%22/%3E%3Crect x=%221180%22 y=%22420%22 width=%22140%22 height=%22130%22 fill=%22%23555555%22/%3E%3Ctext x=%22800%22 y=%22850%22 font-size=%2224%22 fill=%22%23666%22 text-anchor=%22middle%22 font-family=%22Arial%22%3EHyundai Tucson 2022 - Lateral%3C/text%3E%3C/svg%3E',
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221600%22 height=%22900%22%3E%3Crect fill=%22%23f5f5f5%22 width=%221600%22 height=%22900%22/%3E%3Crect fill=%22%23a8d8ff%22 width=%221600%22 height=%22450%22/%3E%3Crect x=%22500%22 y=%22300%22 width=%22600%22 height=%22430%22 fill=%22%23222222%22 rx=%2240%22/%3E%3Ccircle cx=%22600%22 cy=%22710%22 r=%2260%22 fill=%22%23111111%22/%3E%3Ccircle cx=%221000%22 cy=%22710%22 r=%2260%22 fill=%22%23111111%22/%3E%3Crect x=%22530%22 y=%22360%22 width=%22550%22 height=%22230%22 fill=%22%23444444%22 rx=%2220%22/%3E%3Ctext x=%22800%22 y=%22850%22 font-size=%2224%22 fill=%22%23666%22 text-anchor=%22middle%22 font-family=%22Arial%22%3EHyundai Tucson 2022 - Trasera%3C/text%3E%3C/svg%3E'
      ];
    }
    return [];
  };

  if (!vehiculo) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-20 bg-white dark:bg-zinc-950">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Vehículo no encontrado</h1>
            <p className="text-muted-foreground mb-8">
              El vehículo que buscas no está disponible en este momento.
            </p>
            <Link
              href="/catalogo"
              className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition"
            >
              Volver al catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Fotos reales cargadas por el admin. Los SVG de arriba son solo decoración
  // para los vehículos de ejemplo sembrados, que todavía no tienen fotos.
  const imagenesReales = await obtenerImagenes(vehiculo.id);
  const imagenes = imagenesReales.length > 0 ? imagenesReales : getImagenesParaVehiculo(vehiculo.slug);

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12 md:py-20 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-12">
            <Link href="/catalogo" className="text-primary hover:underline text-sm font-semibold mb-4 inline-block">
              ← Volver al catálogo
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
              </h1>
              <p className="text-lg text-muted-foreground">
                {vehiculo.version && `${vehiculo.version} •`} {vehiculo.kilometraje.toLocaleString()} km
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda - Galería + detalles */}
            <div className="lg:col-span-2 space-y-8">
              {/* Galería */}
              <div>
                <GaleriaCarousel
                  marca={vehiculo.marca}
                  modelo={vehiculo.modelo}
                  fotos={imagenes.length}
                  imageUrls={imagenes}
                />
              </div>

              {/* Descripción */}
              {vehiculo.descripcion && (
                <div className="bg-muted p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-3">Descripción</h3>
                  <p className="text-foreground leading-relaxed">{vehiculo.descripcion}</p>
                </div>
              )}

              {/* Especificaciones completas */}
              <div className="bg-muted p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6">Especificaciones técnicas</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Año</p>
                    <p className="text-lg font-semibold">{vehiculo.anio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Kilómetros</p>
                    <p className="text-lg font-semibold">{vehiculo.kilometraje.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Carrocería</p>
                    <p className="text-lg font-semibold capitalize">{vehiculo.carroceria}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transmisión</p>
                    <p className="text-lg font-semibold capitalize">{vehiculo.transmision}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Combustible</p>
                    <p className="text-lg font-semibold capitalize">{vehiculo.combustible}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Puertas</p>
                    <p className="text-lg font-semibold">{vehiculo.puertas || 4}</p>
                  </div>
                  {vehiculo.color && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Color</p>
                      <p className="text-lg font-semibold">{vehiculo.color}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Precio + CTAs */}
            <div className="space-y-6">
              {/* Card de precio */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary p-6 rounded-2xl sticky top-6">
                <p className="text-sm text-muted-foreground mb-2">Precio</p>
                <p className="text-4xl font-bold text-primary mb-1">{formatCLP(vehiculo.precio)}</p>
                {vehiculo.precio_anterior && (
                  <p className="text-sm text-muted-foreground line-through mb-6">
                    {formatCLP(vehiculo.precio_anterior)}
                  </p>
                )}

                {/* Cuota estimada */}
                <div className="bg-white/50 dark:bg-zinc-900/50 p-4 rounded-lg mb-6">
                  <p className="text-xs text-muted-foreground mb-1">Cuota estimada (60 meses)</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCLP(Math.round(vehiculo.precio / 60))}/mes
                  </p>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/56912345678?text=Hola%2C%20me%20interesa%20el%20${encodeURIComponent(vehiculo.marca + ' ' + vehiculo.modelo + ' ' + vehiculo.anio)}`}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover active:scale-[0.98] transition"
                  >
                    <MessageCircle size={18} />
                    Contactar por WhatsApp
                  </a>

                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white active:scale-[0.98] transition">
                    <Heart size={18} />
                    Guardar anuncio
                  </button>

                  <SimuladorCuotas precioVehiculo={vehiculo.precio} isOpen={false} />
                </div>

                {/* Contacto directo */}
                <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-primary" />
                    <span>(45) 2123 4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-primary" />
                    <span>info@collinsmotors.cl</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span>Temuco, La Araucanía</span>
                  </div>
                </div>
              </div>

              {/* Info adicional */}
              <div className="bg-muted p-4 rounded-lg space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Transacción segura</p>
                    <p className="text-muted-foreground">Compra protegida con Collins Motors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Financiamiento disponible</p>
                    <p className="text-muted-foreground">Consulta nuestras opciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
