/**
 * Datos de contacto de Collins Motors.
 *
 * El número de WhatsApp estaba hardcodeado como 56912345678 (inventado) en cinco
 * archivos distintos, así que ningún botón de contacto del sitio llegaba a nadie.
 *
 * PENDIENTE DE CONFIRMAR con Collins Motors: el número general y el email de
 * abajo son los únicos datos reales disponibles al centralizar esto.
 */
export const CONTACTO = {
  /** Número general, en formato wa.me (solo dígitos, con código de país). */
  whatsapp: '56961511074',
  telefono: '+56 9 6151 1074',
  email: 'info@collinsmotors.cl',
  direccion: "Bernardo O'Higgins 252, Temuco",
  ciudad: 'Temuco, La Araucanía',
} as const;

/**
 * Normaliza un teléfono chileno al formato que espera wa.me: solo dígitos y con
 * el 56 delante. Si viene vacío, cae al número general.
 */
export function aWhatsApp(telefono?: string | null): string {
  const digitos = (telefono ?? '').replace(/\D/g, '');
  if (!digitos) return CONTACTO.whatsapp;
  if (digitos.startsWith('56')) return digitos;
  return `56${digitos}`;
}

/** Arma un link de WhatsApp con el mensaje ya escrito, para que el cliente solo envíe. */
export function linkWhatsApp(mensaje: string, telefono?: string | null): string {
  return `https://wa.me/${aWhatsApp(telefono)}?text=${encodeURIComponent(mensaje)}`;
}

/** Link a Google Maps para una dirección escrita a mano. */
export function linkMapa(direccion: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
}
