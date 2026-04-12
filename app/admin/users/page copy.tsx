'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type User = {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_blocked?: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATE
  const [open, setOpen] = useState(false);

  // FORM STATE
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('patient');
  const [password, setPassword] = useState('Temp1234!');

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setUsers([]);
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // CREATE USER (AUTH + PROFILE)
  // =========================
  const createUser = async () => {
  const res = await fetch('/api/admin/users/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      role,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(data.error);
    return;
  }

  setOpen(false);
  fetchUsers();
};
  // =========================
  // BLOCK USER
  // =========================
  const toggleBlock = async (id: string, current: boolean) => {
    await supabase
      .from('profiles')
      .update({ is_blocked: !current })
      .eq('id', id);

    fetchUsers();
  };

  // =========================
  // CHANGE ROLE
  // =========================
  const changeRole = async (id: string, newRole: string) => {
    await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id);

    fetchUsers();
  };

  // =========================
  // RESET PASSWORD
  // =========================
  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    alert('Email de reset envoyé');
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-semibold">
            Gestion des utilisateurs
          </h1>
          <p className="text-sm text-gray-500">
            Patients, psy et admins
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
        >
          + Ajouter utilisateur
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-6 text-sm text-gray-500">
            Chargement...
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            Aucun utilisateur
          </div>
        ) : (
          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Utilisateur</th>
                <th className="p-3">Rôle</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Actions</th>
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

                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        changeRole(u.id, e.target.value)
                      }
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="patient">Patient</option>
                      <option value="psy">Psychologue</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="p-3">
                    {u.is_blocked ? (
                      <span className="text-red-500 text-xs">
                        Bloqué
                      </span>
                    ) : (
                      <span className="text-green-600 text-xs">
                        Actif
                      </span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      onClick={() =>
                        toggleBlock(u.id, u.is_blocked || false)
                      }
                      className="text-xs px-2 py-1 border rounded"
                    >
                      {u.is_blocked ? 'Débloquer' : 'Bloquer'}
                    </button>

                    <button
                      onClick={() => resetPassword(u.email)}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      Reset
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">

            <h2 className="text-lg font-semibold">
              Ajouter utilisateur
            </h2>

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="patient">Patient</option>
              <option value="psy">Psychologue</option>
              <option value="admin">Admin</option>
            </select>

            <input
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm border rounded"
              >
                Annuler
              </button>

              <button
                onClick={createUser}
                className="px-3 py-2 text-sm bg-indigo-600 text-white rounded"
              >
                Créer
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}