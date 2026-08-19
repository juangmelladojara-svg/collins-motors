import { createClient } from '@supabase/supabase-js';

// TODO: Usar solo en route handlers y server actions con credenciales de service role
// NUNCA exponer el SUPABASE_SERVICE_ROLE_KEY al navegador

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
