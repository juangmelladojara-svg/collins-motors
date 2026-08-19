'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, TrendingUp, Headphones } from 'lucide-react';

// Registrar ScrollTrigger solo una vez
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const values = [
  {
    icon: Shield,
    title: 'Transparencia Total',
    description:
      'Todos nuestros autos tienen ficha completa con kilómetros, estado y precio honesto. Sin sorpresas ni letras chicas.',
  },
  {
    icon: TrendingUp,
    title: 'Mejor Relación Precio',
    description:
      'Comparamos precios de mercado y ofrecemos las mejores oportunidades en Temuco y La Araucanía.',
  },
  {
    icon: Headphones,
    title: 'Atención Local',
    description:
      'Contacto directo, respuesta rápida por WhatsApp, y asesoría personalizada de nuestro equipo local.',
  },
];

export function ValorMarca() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>('.valor-card');

      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-black text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            ¿Por qué Collins Motors?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Tres pilares de confianza para tu compra
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <div
                key={i}
                className="valor-card bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:border-white/30 transition-all group"
              >
                <div className="mb-4 p-3 bg-primary rounded-lg w-fit group-hover:scale-110 transition-transform">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-slate-300 leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-20 pt-20 border-t border-white/10 text-center">
          <div>
            <p className="text-4xl md:text-5xl font-bold text-primary">10+</p>
            <p className="text-sm md:text-base text-slate-400 mt-2">Años en el mercado</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold text-primary">500+</p>
            <p className="text-sm md:text-base text-slate-400 mt-2">Clientes satisfechos</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold text-primary">24/7</p>
            <p className="text-sm md:text-base text-slate-400 mt-2">Disponibilidad</p>
          </div>
        </div>
      </div>
    </section>
  );
}
