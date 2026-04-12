'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      const { data } = await supabase.auth.getUser();

      const user = data.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = profile?.role;

      if (role === 'admin') router.push('/admin');
      else if (role === 'psy') router.push('/psy');
      else router.push('/patient');
    };

    handle();
  }, []);

  return <div>Connexion en cours...</div>;
}