'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface BuscadorHeroProps {
  marcas: string[];
}

/**
 * Los rangos de precio y año viven en los filtros del catálogo, con listas.
 * Acá va una sola cosa: escribir qué buscas. Meter dos campos numéricos más
 * en el hero solo agrega decisiones antes de ver un auto.
 */
const ATAJOS = [
  { label: 'SUV', href: '/catalogo?carroceria=suv' },
  { label: 'Camionetas', href: '/catalogo?carroceria=camioneta' },
  { label: 'Automáticos', href: '/catalogo?transmision=automatica' },
  { label: 'Menor precio', href: '/catalogo?orden=precio_asc' },
];

export function BuscadorHero({ marcas }: BuscadorHeroProps) {
  const router = useRouter();
  const [q, setQ] = useState('');

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/catalogo?q=${encodeURIComponent(q.trim())}` : '/catalogo');
  };

  return (
    <div className="w-full max-w-xl space-y-4">
      <form onSubmit={buscar} className="relative">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
        />
        <input
          type="text"
          inputMode="search"
          placeholder="¿Qué buscas? Ej: Hilux, SUV, Toyota"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar vehículos"
          className="w-full pl-14 pr-32 py-4 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover active:scale-[0.98] transition"
        >
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {ATAJOS.map(({ label, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="px-4 py-1.5 rounded-full text-sm text-white/80 border border-white/25 hover:bg-white/10 hover:text-white transition"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
