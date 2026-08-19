'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CARROCERIAS, TRANSMISIONES, COMBUSTIBLES, RANGO_AÑOS, RANGO_PRECIOS } from '@/lib/vehiculos/constantes';
import { obtenerMarcas } from '@/lib/vehiculos/queries';
import { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FiltrosCatalogoProps {
  marcas: string[];
}

export function FiltrosCatalogo({ marcas }: FiltrosCatalogoProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Estados para filtros
  const [marca, setMarca] = useState(searchParams.get('marca') || '');
  const [carroceria, setCarroceria] = useState(searchParams.get('carroceria') || '');
  const [transmision, setTransmision] = useState(searchParams.get('transmision') || '');
  const [combustible, setCombustible] = useState(searchParams.get('combustible') || '');
  const [precioMin, setPrecioMin] = useState(searchParams.get('precio_min') || '');
  const [precioMax, setPrecioMax] = useState(searchParams.get('precio_max') || '');
  const [anioMin, setAnioMin] = useState(searchParams.get('anio_min') || '');
  const [anioMax, setAnioMax] = useState(searchParams.get('anio_max') || '');
  const [q, setQ] = useState(searchParams.get('q') || '');

  // Construir query params
  const aplicarFiltros = () => {
    const params = new URLSearchParams();
    if (marca) params.append('marca', marca);
    if (carroceria) params.append('carroceria', carroceria);
    if (transmision) params.append('transmision', transmision);
    if (combustible) params.append('combustible', combustible);
    if (precioMin) params.append('precio_min', precioMin);
    if (precioMax) params.append('precio_max', precioMax);
    if (anioMin) params.append('anio_min', anioMin);
    if (anioMax) params.append('anio_max', anioMax);
    if (q) params.append('q', q);

    router.push(`/catalogo?${params.toString()}`);
  };

  const limpiarFiltros = () => {
    setMarca('');
    setCarroceria('');
    setTransmision('');
    setCombustible('');
    setPrecioMin('');
    setPrecioMax('');
    setAnioMin('');
    setAnioMax('');
    setQ('');
    router.push('/catalogo');
  };

  // Auto-apply filtros al cambiar
  useEffect(() => {
    const timer = setTimeout(aplicarFiltros, 300);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar por marca, modelo..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white"
        />
      </div>

      {/* Botón toggle filtros (mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition"
      >
        <Filter size={20} />
        <span className="font-semibold">{isOpen ? 'Ocultar' : 'Mostrar'} filtros</span>
      </button>

      {/* Panel de filtros */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} md:block bg-muted rounded-lg p-6 space-y-6`}
      >
        {/* Marca */}
        <div>
          <label className="block font-semibold mb-3">Marca</label>
          <select
            value={marca}
            onChange={(e) => {
              setMarca(e.target.value);
              aplicarFiltros();
            }}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white"
          >
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Carrocería */}
        <div>
          <label className="block font-semibold mb-3">Carrocería</label>
          <select
            value={carroceria}
            onChange={(e) => {
              setCarroceria(e.target.value);
              aplicarFiltros();
            }}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white"
          >
            <option value="">Todas las carrocerías</option>
            {Object.entries(CARROCERIAS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Transmisión */}
        <div>
          <label className="block font-semibold mb-3">Transmisión</label>
          <select
            value={transmision}
            onChange={(e) => {
              setTransmision(e.target.value);
              aplicarFiltros();
            }}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white"
          >
            <option value="">Todas</option>
            {Object.entries(TRANSMISIONES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Combustible */}
        <div>
          <label className="block font-semibold mb-3">Combustible</label>
          <select
            value={combustible}
            onChange={(e) => {
              setCombustible(e.target.value);
              aplicarFiltros();
            }}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white"
          >
            <option value="">Todos</option>
            {Object.entries(COMBUSTIBLES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Año */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mb-2 text-sm">Año desde</label>
            <input
              type="number"
              min={RANGO_AÑOS.min}
              max={RANGO_AÑOS.max}
              value={anioMin}
              onChange={(e) => {
                setAnioMin(e.target.value);
                aplicarFiltros();
              }}
              placeholder="2000"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-sm">Año hasta</label>
            <input
              type="number"
              min={RANGO_AÑOS.min}
              max={RANGO_AÑOS.max}
              value={anioMax}
              onChange={(e) => {
                setAnioMax(e.target.value);
                aplicarFiltros();
              }}
              placeholder={String(RANGO_AÑOS.max)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Precio */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mb-2 text-sm">Precio desde</label>
            <input
              type="number"
              min="0"
              step="1000000"
              value={precioMin}
              onChange={(e) => {
                setPrecioMin(e.target.value);
                aplicarFiltros();
              }}
              placeholder="0"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-sm">Precio hasta</label>
            <input
              type="number"
              min="0"
              step="1000000"
              value={precioMax}
              onChange={(e) => {
                setPrecioMax(e.target.value);
                aplicarFiltros();
              }}
              placeholder="100000000"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* Botón limpiar */}
        {(marca || carroceria || transmision || combustible || precioMin || precioMax || anioMin || anioMax || q) && (
          <button
            onClick={limpiarFiltros}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
          >
            <X size={16} />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
