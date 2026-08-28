/**
 * URL base del sitio.
 *
 * Open Graph resuelve las rutas relativas contra esto, así que si apunta a un
 * dominio que todavía no sirve la página, el link compartido queda roto. En
 * Vercel se toma sola la URL de producción; para el dominio definitivo basta
 * con definir NEXT_PUBLIC_SITE_URL.
 */
function resolverBase(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export const SITE_URL = resolverBase();
export const SITE_NAME = 'Collins Motors';
