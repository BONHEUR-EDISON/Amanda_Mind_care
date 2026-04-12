import { supabase } from '@/lib/supabase';

export async function logAction(
  action: string,
  table: string,
  record_id?: string,
  metadata?: any
) {
  const { data } = await supabase.auth.getUser();

  if (!data.user) return;

  await supabase.from('audit_logs').insert({
    user_id: data.user.id,
    action,
    table_name: table,
    record_id,
    metadata,
  });
}