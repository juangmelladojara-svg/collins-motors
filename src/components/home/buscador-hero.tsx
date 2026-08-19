'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';

interface BuscadorHeroProps {
  marcas: string[];
}

export function BuscadorHero({ marcas }: BuscadorHeroProps) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (precioMin) params.append('precio_min', precioMin);
    if (precioMax) params.append('precio_max', precioMax);
    router.push(`/catalogo?${params.toString()}`);
  };

  const filtrosRapidos = [
    { label: 'Menores precios', params: 'orden=precio_asc' },
    { label: 'Menor kilometraje', params: 'orden=recientes' },
    { label: 'SUV', params: 'carroceria=suv' },
    { label: 'Sedan', params: 'carroceria=sedan' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Buscador principal */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
            <Search size={24} />
          </div>
          <input
            type="text"
            placeholder="Busca por marca, modelo (ej: Toyota Corolla)..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          />
        </div>

        {/* Filtros rápidos inline */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="number"
            placeholder="Precio desde"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <input
            type="number"
            placeholder="Precio hasta"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button
            type="submit"
            className="col-span-2 md:col-span-1 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Buscar
          </button>
          <button
            type="button"
            onClick={() => router.push('/catalogo')}
            className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg hover:bg-white/20 transition font-semibold text-sm"
          >
            Ver todos
          </button>
        </div>
      </form>

      {/* Filtros rápidos como chips */}
      <div className="space-y-2">
        <p className="text-sm text-white/60 font-medium">Búsquedas populares:</p>
        <div className="flex flex-wrap gap-2">
          {filtrosRapidos.map((filtro) => (
            <button
              key={filtro.label}
              onClick={() => router.push(`/catalogo?${filtro.params}`)}
              className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm hover:bg-white/20 hover:border-white/40 transition-all flex items-center gap-2 group"
            >
              {filtro.label}
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
