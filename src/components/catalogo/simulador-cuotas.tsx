'use client';

import { useState } from 'react';
import { DollarSign, Calendar, Percent } from 'lucide-react';
import { formatCLP } from '@/lib/utils/formato';

interface SimuladorCuotasProps {
  precioVehiculo: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SimuladorCuotas({ precioVehiculo, isOpen = true, onClose }: SimuladorCuotasProps) {
  const [cuotaInicial, setCuotaInicial] = useState(30); // porcentaje
  const [meses, setMeses] = useState(60);
  const [tasa, setTasa] = useState(8.5); // porcentaje anual

  // Cálculos
  const montoInicial = (precioVehiculo * cuotaInicial) / 100;
  const montoFinanciar = precioVehiculo - montoInicial;
  const tasaMensual = tasa / 12 / 100;
  const cuotaMensual =
    montoFinanciar *
    (tasaMensual * Math.pow(1 + tasaMensual, meses)) /
    (Math.pow(1 + tasaMensual, meses) - 1);
  const totalIntereses = cuotaMensual * meses - montoFinanciar;
  const totalAPagar = precioVehiculo + totalIntereses;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Simulador de Financiamiento</h2>
            <p className="text-sm text-muted-foreground mt-1">Calcula tu cuota mensual</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-2xl font-bold text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {/* Precio del vehículo */}
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Valor del vehículo</p>
          <p className="text-2xl font-bold text-primary">{formatCLP(precioVehiculo)}</p>
        </div>

        {/* Controles */}
        <div className="space-y-6">
          {/* Cuota Inicial */}
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <DollarSign size={18} className="text-primary" />
                Cuota Inicial
              </span>
              <span className="text-lg font-bold text-primary">{cuotaInicial}%</span>
            </label>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={cuotaInicial}
              onChange={(e) => setCuotaInicial(Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="text-sm text-muted-foreground mt-2">{formatCLP(montoInicial)}</p>
          </div>

          {/* Plazo */}
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Plazo
              </span>
              <span className="text-lg font-bold text-primary">{meses} meses</span>
            </label>
            <input
              type="range"
              min="12"
              max="84"
              step="6"
              value={meses}
              onChange={(e) => setMeses(Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {(meses / 12).toFixed(1)} años aprox.
            </p>
          </div>

          {/* Tasa de interés */}
          <div>
            <label className="flex items-center justify-between mb-3">
              <span className="font-semibold text-foreground flex items-center gap-2">
                <Percent size={18} className="text-primary" />
                Tasa de interés anual
              </span>
              <span className="text-lg font-bold text-primary">{tasa.toFixed(1)}%</span>
            </label>
            <input
              type="range"
              min="4"
              max="15"
              step="0.5"
              value={tasa}
              onChange={(e) => setTasa(Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Tasa referencial. Consulta con nuestro equipo para tasa actual.
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div className="space-y-3 bg-muted p-6 rounded-lg">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monto a financiar:</span>
            <span className="font-semibold">{formatCLP(montoFinanciar)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Intereses totales:</span>
            <span className="font-semibold text-accent">{formatCLP(totalIntereses)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="text-muted-foreground">Total a pagar:</span>
            <span className="text-lg font-bold text-primary">{formatCLP(totalAPagar)}</span>
          </div>
        </div>

        {/* Cuota destacada */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-6 rounded-xl text-center">
          <p className="text-sm text-muted-foreground mb-2">Cuota mensual estimada</p>
          <p className="text-4xl font-bold text-primary">{formatCLP(cuotaMensual)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Por {meses} meses aprox.
          </p>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
            >
              Cerrar
            </button>
          )}
          <a
            href="https://wa.me/56912345678?text=Hola%2C%20me%20gustar%C3%ADa%20conocer%20las%20opciones%20de%20financiamiento"
            className={`${onClose ? '' : 'col-span-2'} px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover active:scale-[0.98] transition text-center`}
          >
            Consultar financiamiento
          </a>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          *Este simulador es orientativo. Las condiciones finales dependerán de tu situación crediticia.
        </p>
      </div>
    </div>
  );
}
