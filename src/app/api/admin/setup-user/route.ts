import { createClient } from '@supabase/supabase-js';

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return Response.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'juangmelladojara@gmail.com',
      password: 'Collins#2026Motors!',
      email_confirm: true,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, user: data.user });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Error creating user' }, { status: 500 });
  }
}
