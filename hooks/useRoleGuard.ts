'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUserSafe } from '@/lib/auth/getUserSafe';

type Status = 'loading' | 'ok' | 'blocked';

export function useRoleGuard(requiredRole: string) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');

  const running = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const check = async () => {
      if (running.current) return;
      running.current = true;

      try {
        setStatus('loading');

        // ✅ SAFE USER FETCH (anti lock)
        const user = await getUserSafe();

        if (!user) {
          if (mounted.current) {
            setStatus('blocked');
            router.replace('/login');
          }
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, is_active')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          if (mounted.current) {
            setStatus('blocked');
            router.replace('/unauthorized');
          }
          return;
        }

        const isValid =
          profile.role === requiredRole &&
          profile.is_active === true;

        if (!isValid) {
          if (mounted.current) {
            setStatus('blocked');
            router.replace('/unauthorized');
          }
          return;
        }

        if (mounted.current) {
          setStatus('ok');
        }
      } finally {
        running.current = false;
      }
    };

    check();

    // ✅ SAFE AUTH LISTENER (no spam calls)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      setTimeout(() => {
        check();
      }, 200); // 🔥 anti collision
    });

    return () => {
      mounted.current = false;
      listener.subscription.unsubscribe();
    };
  }, [router, requiredRole]);

  return status;
}