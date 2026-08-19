import { type NextRequest } from 'next/server';

// TODO: En Fase 2, importar updateSession desde lib/supabase/middleware
// import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  // TODO: Implementar protección de rutas en Fase 2
  // return await updateSession(request);

  // Por ahora, permitir acceso para desarrollo
  return request;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*))',
  ],
};
