'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { BuscadorHero } from './buscador-hero';
import { formatCLP } from '@/lib/utils/formato';
import type { Vehiculo } from '@/lib/vehiculos/tipos';

interface HeroProps {
  marcas?: string[];
  vehiculoPortada?: Vehiculo;
  imagenPortada?: string;
}

export function Hero({ marcas = [], vehiculoPortada, imagenPortada }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Una sola entrada escalonada y lenta. El movimiento caro es el que
      // apenas se nota; varias animaciones compitiendo abaratan la página.
      gsap.from('.hero-anim', {
        opacity: 0,
        y: 24,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[92dvh] flex flex-col justify-end overflow-hidden">
      {/* La foto es el fondo completo, no un accesorio en una columna. */}
      {imagenPortada ? (
        <>
          <img
            src={imagenPortada}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Scrim vertical: mantiene el texto legible sin apagar la foto. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
        </>
      ) : (
        <div className="absolute inset-0 bg-foreground" />
      )}

      <div className="container mx-auto px-4 max-w-7xl relative z-10 pb-14 pt-32">
        <div className="max-w-3xl">
          <p className="hero-anim text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-5">
            Collins Motors · Temuco
          </p>

          <h1 className="hero-anim text-5xl md:text-7xl lg:text-8xl font-semibold text-white mb-5">
            Autos que valen
            <br />
            la vuelta.
          </h1>

          <p className="hero-anim text-lg text-white/70 max-w-lg mb-9">
            Inventario revisado, precios a la vista y respuesta el mismo día.
          </p>

          <div className="hero-anim">
            <BuscadorHero marcas={marcas} />
          </div>
        </div>
      </div>

      {/* Crédito de la foto: el auto del hero es stock real y se puede visitar. */}
      {vehiculoPortada && (
        <Link
          href={`/vehiculo/${vehiculoPortada.slug}`}
          className="hero-anim relative z-10 border-t border-white/15 bg-black/25 backdrop-blur-sm hover:bg-black/40 transition"
        >
          <div className="container mx-auto px-4 max-w-7xl py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-0.5">
                En vitrina
              </p>
              <p className="text-white font-medium truncate">
                {vehiculoPortada.marca} {vehiculoPortada.modelo} {vehiculoPortada.anio}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-white font-semibold tabular">{formatCLP(vehiculoPortada.precio)}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">Ver ficha →</p>
            </div>
          </div>
        </Link>
      )}
    </section>
  );
}
