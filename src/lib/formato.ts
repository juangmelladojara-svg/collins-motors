/** Deja solo los dígitos de lo que el usuario escribió. */
export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

/**
 * Formatea un número con separador de miles chileno (punto).
 * 16490000 -> "16.490.000". Devuelve '' para 0 o vacío, así el campo
 * no arranca con un "0" que el encargado tenga que borrar.
 */
export function formatearMiles(valor: number | string): string {
  const digitos = soloDigitos(String(valor ?? ''));
  if (!digitos) return '';
  return Number(digitos).toLocaleString('es-CL');
}
