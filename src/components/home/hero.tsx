'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BuscadorHero } from './buscador-hero';
import { obtenerMarcas } from '@/lib/vehiculos/queries';

interface HeroProps {
  marcas?: string[];
}

export function Hero({ marcas = [] }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      gsap.from('.hero-headline', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.hero-subtext', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.hero-buscador', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden pt-20 md:pt-0"
    >
      {/* Decorative gradient blur */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="text-center space-y-8">
          {/* Eyebrow / Badge */}
          <div className="hero-badge inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide">
            Vehículos Usados de Calidad
          </div>

          {/* Headline */}
          <h1 className="hero-headline text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground">
            Tu próximo auto está aquí
          </h1>

          {/* Subtext */}
          <p className="hero-subtext text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Busca, compara y compra vehículos usados en Temuco. Con financiamiento disponible.
          </p>

          {/* Buscador mejorado */}
          <div className="hero-buscador">
            <BuscadorHero marcas={marcas} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Desplázate</span>
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
