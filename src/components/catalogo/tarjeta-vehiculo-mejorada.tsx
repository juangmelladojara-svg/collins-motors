'use client';

import { Vehiculo } from '@/lib/vehiculos/tipos';
import { formatCLP, calcularDescuento } from '@/lib/utils/formato';
import { linkWhatsApp } from '@/lib/contacto';
import Link from 'next/link';
import { MapPin, Gauge, Zap, Users, TrendingDown, Image as ImageIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

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
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!cardRef.current) return;

      // Entrada suave
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      });

    }, cardRef);

    return () => ctx.revert();
  }, []);

  const descuento = vehiculo.precio_anterior
    ? calcularDescuento(vehiculo.precio_anterior, vehiculo.precio)
    : null;

  const cuotaEstimada = Math.round(vehiculo.precio / 60);

  return (
    <Link href={`/vehiculo/${vehiculo.slug}`}>
      <div
        ref={cardRef}
        className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-300 cursor-pointer group flex flex-col h-full"
      >
        {/* Imagen */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {imagenUrl ? (
            <img
              src={imagenUrl}
              alt={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon size={32} className="opacity-50" />
                <span className="text-xs">Sin fotos por ahora</span>
              </div>
            </div>
          )}

          {/* Badges superior izquierda */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {vehiculo.estado === 'vendido' && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                VENDIDO
              </div>
            )}

            {vehiculo.estado === 'reservado' && (
              <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                RESERVADO
              </div>
            )}

            {descuento && descuento > 0 && (
              <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingDown size={12} />
                -{descuento}%
              </div>
            )}
          </div>

          {/* Contador de fotos */}
          {totalFotos > 0 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <ImageIcon size={12} />
              {totalFotos} {totalFotos === 1 ? 'foto' : 'fotos'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 flex-1 flex flex-col">
          {/* Marca, modelo, año */}
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {vehiculo.marca} {vehiculo.modelo}
            </h3>
            <p className="text-sm text-muted-foreground">
              {vehiculo.anio} {vehiculo.version && `• ${vehiculo.version}`}
            </p>
          </div>

          {/* Precio principal + anterior */}
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">{formatCLP(vehiculo.precio)}</p>
            {vehiculo.precio_anterior && (
              <p className="text-sm text-muted-foreground line-through">
                {formatCLP(vehiculo.precio_anterior)}
              </p>
            )}
            {/* Cuota estimada */}
            <p className="text-xs text-muted-foreground pt-1">
              Desde <span className="font-semibold text-foreground">{formatCLP(cuotaEstimada)}</span>/mes
            </p>
          </div>

          {/* Specs rápidas */}
          <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-border text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Gauge size={16} className="text-primary flex-shrink-0" />
              <span>{vehiculo.kilometraje.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap size={16} className="text-primary flex-shrink-0" />
              <span className="capitalize">{vehiculo.combustible}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={16} className="text-primary flex-shrink-0" />
              <span>{vehiculo.puertas || 4} puertas</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={16} className="text-primary flex-shrink-0" />
              <span className="truncate">{vehiculo.ubicacion || 'Temuco'}</span>
            </div>
          </div>

          {/* Descripción corta */}
          {vehiculo.descripcion && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {vehiculo.descripcion}
            </p>
          )}

          {/* CTA múltiple */}
          <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
            {/* La tarjeta entera ya es el enlace, así que esto es solo el
                affordance visual: un <button> dentro de un <a> es inválido. */}
            <span className="px-3 py-2.5 bg-primary text-white font-semibold rounded-xl group-hover:bg-primary-hover transition text-sm text-center">
              Ver detalles
            </span>
            <a
              href={linkWhatsApp(
                `Hola, me interesa el ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} que vi en la web de Collins Motors.`,
                vehiculo.vendedor_telefono
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-2 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white active:scale-[0.98] transition text-sm text-center"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Link>
  );
}
