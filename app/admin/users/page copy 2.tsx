'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD USERS
  // =========================
  const loadUsers = async () => {
    setLoading(true);

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================
  // UPDATE ROLE
  // =========================
  const updateRole = async (id: string, role: string) => {
    await supabase.from('profiles').update({ role }).eq('id', id);
    loadUsers();
  };

  // =========================
  // BLOCK USER
  // =========================
  const toggleBlock = async (id: string, current: boolean) => {
    await supabase
      .from('profiles')
      .update({ is_blocked: !current })
      .eq('id', id);

    loadUsers();
  };

  // =========================
  // RESET PASSWORD
  // =========================
  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    alert('Email envoyé');
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="space-y-6">

      <h1 className="text-xl font-semibold">
        Gestion utilisateurs
      </h1>

      <div className="bg-white border rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((u) => (
              <tr key={u.id} className="border-t">

                <td className="p-3">
                  <p className="font-medium">
                    {u.full_name || u.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    {u.email}
                  </p>
                </td>

                <td>
                  <select
                    value={u.role}
                    onChange={(e) =>
                      updateRole(u.id, e.target.value)
                    }
                  >
                    <option value="patient">Patient</option>
                    <option value="therapist">Therapist</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td>
                  {u.is_blocked ? (
                    <span className="text-red-500">Blocked</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>

                <td className="flex gap-2">

                  <button
                    onClick={() =>
                      toggleBlock(u.id, u.is_blocked)
                    }
                  >
                    Block
                  </button>

                  <button
                    onClick={() => resetPassword(u.email)}
                  >
                    Reset
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}