'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CARROCERIAS, TRANSMISIONES, COMBUSTIBLES } from '@/lib/vehiculos/constantes';
import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FiltrosCatalogoProps {
  marcas: string[];
  total: number;
}

const PRECIOS = [5, 10, 15, 20, 25, 30, 40, 50].map((millones) => ({
  valor: String(millones * 1_000_000),
  etiqueta: `$${millones}.000.000`,
}));

const ANIOS = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() - i));

/** Atajos de un toque para las búsquedas más habituales. */
const ATAJOS: { etiqueta: string; filtros: Record<string, string> }[] = [
  { etiqueta: 'SUV', filtros: { carroceria: 'suv' } },
  { etiqueta: 'Camioneta', filtros: { carroceria: 'camioneta' } },
  { etiqueta: 'Sedán', filtros: { carroceria: 'sedan' } },
  { etiqueta: 'Automático', filtros: { transmision: 'automatica' } },
  { etiqueta: 'Diésel', filtros: { combustible: 'diesel' } },
  { etiqueta: 'Hasta $10M', filtros: { precio_max: '10000000' } },
  { etiqueta: 'Desde 2020', filtros: { anio_min: '2020' } },
];

export function FiltrosCatalogo({ marcas, total }: FiltrosCatalogoProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [abierto, setAbierto] = useState(false);

  // La URL es la única fuente de verdad. Antes cada select guardaba su propio
  // estado y llamaba a aplicar() en el mismo handler, que por el closure leía
  // el valor anterior: el select mostraba una marca y la lista filtraba otra.
  const valor = (clave: string) => searchParams.get(clave) ?? '';

  const actualizar = (cambios: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [clave, v] of Object.entries(cambios)) {
      if (v) params.set(clave, v);
      else params.delete(clave);
    }

    const query = params.toString();
    router.push(query ? `/catalogo?${query}` : '/catalogo', { scroll: false });
  };

  // El texto necesita estado local para responder a cada tecla; se sincroniza
  // con la URL cuando cambia por fuera (atajos, quitar chip, limpiar).
  const [texto, setTexto] = useState(valor('q'));
  useEffect(() => setTexto(searchParams.get('q') ?? ''), [searchParams]);

  useEffect(() => {
    if (texto === (searchParams.get('q') ?? '')) return; // sin push al montar
    const t = setTimeout(() => actualizar({ q: texto }), 350);
    return () => clearTimeout(t);
  }, [texto]);

  const activo = (filtros: Record<string, string>) =>
    Object.entries(filtros).every(([k, v]) => valor(k) === v);

  const alternarAtajo = (filtros: Record<string, string>) => {
    const quitar = activo(filtros);
    actualizar(Object.fromEntries(Object.keys(filtros).map((k) => [k, quitar ? '' : filtros[k]])));
  };

  // Chips de lo que está filtrado ahora, cada uno quitable por separado.
  const etiquetas: Record<string, (v: string) => string> = {
    q: (v) => `"${v}"`,
    marca: (v) => v,
    carroceria: (v) => CARROCERIAS[v as keyof typeof CARROCERIAS] ?? v,
    transmision: (v) => TRANSMISIONES[v as keyof typeof TRANSMISIONES] ?? v,
    combustible: (v) => COMBUSTIBLES[v as keyof typeof COMBUSTIBLES] ?? v,
    precio_min: (v) => `Desde $${Number(v).toLocaleString('es-CL')}`,
    precio_max: (v) => `Hasta $${Number(v).toLocaleString('es-CL')}`,
    anio_min: (v) => `Desde ${v}`,
    anio_max: (v) => `Hasta ${v}`,
  };

  const activos = Object.keys(etiquetas)
    .filter((clave) => valor(clave))
    .map((clave) => ({ clave, texto: etiquetas[clave](valor(clave)) }));

  const selectClase =
    'w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition';

  return (
    <div className="space-y-4">
      {/* Buscador + orden */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            inputMode="search"
            placeholder="Busca por marca o modelo — ej: Toyota, Hilux"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            aria-label="Buscar vehículos"
          />
          {texto && (
            <button
              onClick={() => setTexto('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition"
              aria-label="Borrar búsqueda"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <select
          value={valor('orden')}
          onChange={(e) => actualizar({ orden: e.target.value })}
          className="sm:w-52 px-4 py-3.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          aria-label="Ordenar resultados"
        >
          <option value="">Más recientes</option>
          <option value="precio_asc">Menor precio</option>
          <option value="precio_desc">Mayor precio</option>
          <option value="anio_desc">Más nuevos</option>
        </select>
      </div>

      {/* Atajos de un toque */}
      <div className="flex flex-wrap gap-2">
        {ATAJOS.map(({ etiqueta, filtros }) => {
          const encendido = activo(filtros);
          return (
            <button
              key={etiqueta}
              onClick={() => alternarAtajo(filtros)}
              aria-pressed={encendido}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                encendido
                  ? 'bg-primary text-white border-primary'
                  : 'bg-background border-border hover:border-primary/60'
              }`}
            >
              {etiqueta}
            </button>
          );
        })}

        <button
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
          className="px-4 py-2 rounded-full text-sm font-medium border border-border hover:border-primary/60 transition flex items-center gap-2"
        >
          <SlidersHorizontal size={15} />
          Más filtros
        </button>
      </div>

      {/* Filtros detallados */}
      {abierto && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-surface border border-border rounded-2xl">
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Marca</span>
            <select
              value={valor('marca')}
              onChange={(e) => actualizar({ marca: e.target.value })}
              className={selectClase}
            >
              <option value="">Todas</option>
              {marcas.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Carrocería</span>
            <select
              value={valor('carroceria')}
              onChange={(e) => actualizar({ carroceria: e.target.value })}
              className={selectClase}
            >
              <option value="">Todas</option>
              {Object.entries(CARROCERIAS).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Transmisión</span>
            <select
              value={valor('transmision')}
              onChange={(e) => actualizar({ transmision: e.target.value })}
              className={selectClase}
            >
              <option value="">Todas</option>
              {Object.entries(TRANSMISIONES).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Combustible</span>
            <select
              value={valor('combustible')}
              onChange={(e) => actualizar({ combustible: e.target.value })}
              className={selectClase}
            >
              <option value="">Todos</option>
              {Object.entries(COMBUSTIBLES).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
          </label>

          {/* Precio y año como listas: escribir "15000000" a mano era el mayor
              punto de fricción del catálogo. */}
          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Precio desde</span>
            <select
              value={valor('precio_min')}
              onChange={(e) => actualizar({ precio_min: e.target.value })}
              className={selectClase}
            >
              <option value="">Sin mínimo</option>
              {PRECIOS.map(({ valor: v, etiqueta }) => (
                <option key={v} value={v}>{etiqueta}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Precio hasta</span>
            <select
              value={valor('precio_max')}
              onChange={(e) => actualizar({ precio_max: e.target.value })}
              className={selectClase}
            >
              <option value="">Sin máximo</option>
              {PRECIOS.map(({ valor: v, etiqueta }) => (
                <option key={v} value={v}>{etiqueta}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Año desde</span>
            <select
              value={valor('anio_min')}
              onChange={(e) => actualizar({ anio_min: e.target.value })}
              className={selectClase}
            >
              <option value="">Cualquiera</option>
              {ANIOS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-semibold text-muted-foreground mb-1.5">Año hasta</span>
            <select
              value={valor('anio_max')}
              onChange={(e) => actualizar({ anio_max: e.target.value })}
              className={selectClase}
            >
              <option value="">Cualquiera</option>
              {ANIOS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Resultado + filtros activos */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <p className="text-sm font-semibold mr-1">
          {total} {total === 1 ? 'vehículo' : 'vehículos'}
        </p>

        {activos.map(({ clave, texto: etiqueta }) => (
          <button
            key={clave}
            onClick={() => actualizar({ [clave]: '' })}
            className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-muted text-sm hover:bg-border transition"
            aria-label={`Quitar filtro ${etiqueta}`}
          >
            {etiqueta}
            <X size={14} className="text-muted-foreground" />
          </button>
        ))}

        {activos.length > 0 && (
          <button
            onClick={() => router.push('/catalogo', { scroll: false })}
            className="text-sm font-semibold text-primary hover:underline ml-1"
          >
            Limpiar todo
          </button>
        )}
      </div>
    </div>
  );
}
