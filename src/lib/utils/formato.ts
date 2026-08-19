export function formatCLP(monto: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(monto);
}

export function formatKm(km: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
  }).format(km);
}

export function calcularDescuento(original: number, actual: number): number {
  return Math.round(((original - actual) / original) * 100);
}
