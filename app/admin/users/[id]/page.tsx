'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import RoleGuard from '@/components/guards/RoleGuard';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      setUser(data);
    };

    load();
  }, [id]);

  if (!user) return <p>Chargement...</p>;

  return (
    <RoleGuard role="admin">
      <div className="space-y-6">

        <h1 className="text-2xl font-semibold">
          Profil utilisateur
        </h1>

        <div className="bg-white border rounded-xl p-6 space-y-3">

          <p><b>Nom:</b> {user.full_name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Rôle:</b> {user.role}</p>
          <p><b>Statut:</b> {user.is_active ? 'Actif' : 'Inactif'}</p>

        </div>

      </div>
    </RoleGuard>
  );
}