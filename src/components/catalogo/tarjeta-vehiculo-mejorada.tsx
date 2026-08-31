'use client';

import { Vehiculo } from '@/lib/vehiculos/tipos';
import { formatCLP, calcularDescuento } from '@/lib/utils/formato';
import { linkWhatsApp } from '@/lib/contacto';
import { imagenReferencial } from '@/lib/vehiculos/imagen-referencial';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { BotonWhatsApp } from '@/components/analitica/boton-whatsapp';

interface TarjetaVehiculoMejoradaProps {
  vehiculo: Vehiculo;
  /** Foto principal ya resuelta por el catálogo, para no consultar por tarjeta. */
  imagenUrl?: string;
  totalFotos?: number;
}

export function TarjetaVehiculoMejorada({
  vehiculo,
  imagenUrl,
  totalFotos = 0,
}: TarjetaVehiculoMejoradaProps) {
  const descuento = vehiculo.precio_anterior
    ? calcularDescuento(vehiculo.precio_anterior, vehiculo.precio)
    : null;

  // Mientras no haya fotos reales, una pieza de diseño con la identidad del
  // auto: mantiene la grilla pareja en vez de dejar huecos grises.
  const foto = imagenUrl ?? imagenReferencial(vehiculo);
  const esReferencial = !imagenUrl;

  // Una línea sobria en vez de cuatro filas de iconos rojos. El acento se
  // reserva para acciones; si tiñe cada icono deja de significar algo.
  const specs = [
    String(vehiculo.anio),
    `${vehiculo.kilometraje.toLocaleString('es-CL')} km`,
    vehiculo.transmision === 'automatica' ? 'Automático' : 'Manual',
    vehiculo.combustible,
  ];

  return (
    <article className="group relative flex flex-col">
      {/* La foto manda: a sangre, sin marco ni sombra alrededor. */}
      <Link
        href={`/vehiculo/${vehiculo.slug}`}
        className="relative aspect-[16/10] bg-muted rounded-xl overflow-hidden block"
      >
        <img
          src={foto}
          alt={
            esReferencial
              ? `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} — fotos próximamente`
              : `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`
          }
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[900ms] ease-out"
          loading="lazy"
        />

        {(vehiculo.estado !== 'disponible' || descuento) && (
          <div className="absolute top-3 left-3 flex gap-2">
            {vehiculo.estado === 'vendido' && (
              <span className="bg-foreground/90 text-background px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider">
                Vendido
              </span>
            )}
            {vehiculo.estado === 'reservado' && (
              <span className="bg-background/90 text-foreground px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider">
                Reservado
              </span>
            )}
            {descuento && descuento > 0 && (
              <span className="bg-primary text-white px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider">
                -{descuento}%
              </span>
            )}
          </div>
        )}

        {totalFotos > 0 && (
          <span className="absolute bottom-3 right-3 bg-black/55 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[11px] font-medium tabular">
            {totalFotos} {totalFotos === 1 ? 'foto' : 'fotos'}
          </span>
        )}
      </Link>

      <div className="pt-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-lg font-semibold leading-snug">
            <Link href={`/vehiculo/${vehiculo.slug}`} className="hover:text-primary transition-colors">
              {vehiculo.marca} {vehiculo.modelo}
            </Link>
          </h3>

          <BotonWhatsApp
            href={linkWhatsApp(
              `Hola, me interesa el ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} que vi en la web de Collins Motors.`,
              vehiculo.vendedor_telefono
            )}
            vehiculo={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`}
            precio={vehiculo.precio}
            origen="catalogo"
            aria-label={`Consultar por ${vehiculo.marca} ${vehiculo.modelo} por WhatsApp`}
            className="flex-shrink-0 p-2 -m-1 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition"
          >
            <MessageCircle size={19} />
          </BotonWhatsApp>
        </div>

        {vehiculo.version && (
          <p className="text-sm text-muted-foreground mb-2 truncate">{vehiculo.version}</p>
        )}

        <p className="text-sm text-muted-foreground capitalize mb-4">{specs.join(' · ')}</p>

        <div className="mt-auto flex items-baseline gap-2.5">
          <p className="text-2xl font-semibold tabular">{formatCLP(vehiculo.precio)}</p>
          {vehiculo.precio_anterior && (
            <p className="text-sm text-muted-foreground line-through tabular">
              {formatCLP(vehiculo.precio_anterior)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
