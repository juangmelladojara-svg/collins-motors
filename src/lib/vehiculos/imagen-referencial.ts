/**
 * Imagen referencial para vehículos que todavía no tienen fotos cargadas.
 *
 * No intenta dibujar un auto: un auto mal dibujado se lee como error. Es una
 * pieza tipográfica con la identidad del vehículo, que se reconoce como
 * "pendiente de fotos" sin romper la grilla. En cuanto el admin sube fotos
 * reales, esto deja de usarse.
 */

interface Identidad {
  marca: string;
  modelo: string;
  anio: number;
  slug: string;
}

/** Hash estable a partir del slug, para que cada auto tenga su propio tono. */
function tono(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) % 360;
  }
  return h;
}

function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function imagenReferencial({ marca, modelo, anio, slug }: Identidad): string {
  const h = tono(slug);
  // Grises apenas teñidos: seis placeholders idénticos se ven peor que seis
  // variados, pero saturarlos competiría con las fotos reales de al lado.
  const claro = `hsl(${h}, 12%, 26%)`;
  const oscuro = `hsl(${h}, 16%, 13%)`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <defs>
    <linearGradient id="f" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${claro}"/>
      <stop offset="100%" stop-color="${oscuro}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#f)"/>
  <g fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1">
    <path d="M0 720 H1600"/>
    <path d="M0 721 H1600" stroke-opacity="0.03"/>
  </g>
  <rect x="120" y="150" width="56" height="3" fill="#c2202e"/>
  <text x="120" y="235" font-family="Outfit, Helvetica, Arial, sans-serif" font-size="34" letter-spacing="10" fill="#ffffff" fill-opacity="0.55">${escapar(
    marca.toUpperCase()
  )}</text>
  <text x="120" y="380" font-family="Outfit, Helvetica, Arial, sans-serif" font-size="122" font-weight="600" letter-spacing="-4" fill="#ffffff" fill-opacity="0.92">${escapar(
    modelo
  )}</text>
  <text x="120" y="470" font-family="Outfit, Helvetica, Arial, sans-serif" font-size="46" fill="#ffffff" fill-opacity="0.4">${anio}</text>
  <text x="120" y="830" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="6" fill="#ffffff" fill-opacity="0.3">FOTOS PRÓXIMAMENTE</text>
  <text x="1480" y="830" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="4" fill="#ffffff" fill-opacity="0.25">COLLINS MOTORS</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
