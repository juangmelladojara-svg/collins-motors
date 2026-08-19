'use client';

import { Vehiculo } from '@/lib/vehiculos/tipos';
import { formatCLP, calcularDescuento } from '@/lib/utils/formato';
import Link from 'next/link';
import { MapPin, Gauge, Zap, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TarjetaVehiculoProps {
  vehiculo: Vehiculo;
}

export function TarjetaVehiculo({ vehiculo }: TarjetaVehiculoProps) {
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

      // Hover effect
      cardRef.current.addEventListener('mouseenter', () => {
        gsap.to(cardRef.current, {
          y: -8,
          duration: 0.3,
          ease: 'power3.out',
        });
      });

      cardRef.current.addEventListener('mouseleave', () => {
        gsap.to(cardRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power3.out',
        });
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const descuento = vehiculo.precio_anterior
    ? calcularDescuento(vehiculo.precio_anterior, vehiculo.precio)
    : null;

  return (
    <Link href={`/vehiculo/${vehiculo.slug}`}>
      <div
        ref={cardRef}
        className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-colors cursor-pointer group"
      >
        {/* Imagen */}
        <div className="relative h-48 md:h-56 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            {/* TODO: reemplazar con next/image cuando se carguen imágenes reales */}
            Foto de {vehiculo.marca} {vehiculo.modelo}
          </div>

          {/* Badge de estado */}
          {vehiculo.estado === 'vendido' && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              VENDIDO
            </div>
          )}

          {vehiculo.estado === 'reservado' && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
              RESERVADO
            </div>
          )}

          {/* Badge de descuento */}
          {descuento && descuento > 0 && (
            <div className="absolute top-3 left-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
              -{descuento}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Marca, modelo, año */}
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {vehiculo.marca} {vehiculo.modelo}
            </h3>
            <p className="text-sm text-muted-foreground">
              {vehiculo.anio} {vehiculo.version && `• ${vehiculo.version}`}
            </p>
          </div>

          {/* Precio */}
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">{formatCLP(vehiculo.precio)}</p>
            {vehiculo.precio_anterior && (
              <p className="text-sm text-muted-foreground line-through">
                {formatCLP(vehiculo.precio_anterior)}
              </p>
            )}
          </div>

          {/* Specs rápidas */}
          <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <Gauge size={16} className="text-primary" />
              <span className="text-muted-foreground">{vehiculo.kilometraje.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap size={16} className="text-primary" />
              <span className="text-muted-foreground capitalize">{vehiculo.combustible}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-primary" />
              <span className="text-muted-foreground">{vehiculo.puertas || 4} puertas</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-primary" />
              <span className="text-muted-foreground">Temuco</span>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover active:scale-[0.98] transition-all text-sm">
            Ver detalles
          </button>
        </div>
      </div>
    </Link>
  );
}
