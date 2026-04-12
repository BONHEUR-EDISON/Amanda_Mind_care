import { supabase } from '@/lib/supabase';

let cachedUser: any = null;
let cachedAt = 0;
let pending: Promise<any> | null = null;

export async function getUserSafe() {
  const now = Date.now();

  // ✅ cache 10s
  if (cachedUser && now - cachedAt < 10000) {
    return cachedUser;
  }

  // ✅ évite double requête parallèle
  if (pending) return pending;

  pending = supabase.auth.getUser().then(({ data }) => {
    cachedUser = data.user;
    cachedAt = Date.now();
    pending = null;
    return cachedUser;
  });

  return pending;
}