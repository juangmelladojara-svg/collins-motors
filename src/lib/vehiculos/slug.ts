import crypto from 'crypto';

export function generarSlug(marca: string, modelo: string, anio: number): string {
  const base = `${marca}-${modelo}-${anio}`.toLowerCase().replace(/\s+/g, '-');
  const hash = crypto.randomBytes(3).toString('hex');
  return `${base}-${hash}`;
}

export function validarSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}
