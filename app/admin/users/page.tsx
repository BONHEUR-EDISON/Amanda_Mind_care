'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

import RoleGuard from '@/components/guards/RoleGuard';
import LoadingState from '@/components/admin/LoadingState';
import EditUserModal from '@/components/admin/EditUserModal';

type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_blocked: boolean;
};

const ROLES = ['all', 'admin', 'therapist', 'patient'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [page, setPage] = useState(1);
  const limit = 8;

  // 🔥 FIX MODAL STATE
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // =========================
  // FETCH USERS
  // =========================
  useEffect(() => {
    let mounted = true;

    const load = async () => {
  setLoading(true);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, role, is_active, is_blocked')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (roleFilter !== 'all') {
    query = query.eq('role', roleFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    setUsers([]);
  } else {
    setUsers(data ?? []);
  }

  setLoading(false);
};

    load();

    return () => {
      mounted = false;
    };
  }, [page, roleFilter]);

  // =========================
  // SEARCH
  // =========================
  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.full_name} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  // =========================
  // UPDATE USER
  // =========================
  const handleUpdateUser = (updated: User) => {
    setUsers((prev) => {
      const exists = prev.find((u) => u.id === updated.id);

      if (exists) {
        return prev.map((u) =>
          u.id === updated.id ? updated : u
        );
      }

      return [updated, ...prev];
    });
  };

  // =========================
  // TOGGLE BLOCK
  // =========================
  const toggleBlock = async (user: User) => {
    await supabase
      .from('profiles')
      .update({ is_blocked: !user.is_blocked })
      .eq('id', user.id);

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, is_blocked: !u.is_blocked }
          : u
      )
    );
  };

  // =========================
  // MODAL CONTROL
  // =========================
  const openCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // =========================
  // UI
  // =========================
  if (loading) {
    return <LoadingState label="Chargement utilisateurs..." />;
  }

  return (
    <RoleGuard role="admin">
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Utilisateurs
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Gestion complète des comptes
            </p>
          </div>

          <button
            onClick={openCreate}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm"
          >
            + Ajouter utilisateur
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="border px-3 py-2 rounded-lg w-full md:w-80"
          />

          <div className="flex gap-2 flex-wrap">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRoleFilter(r);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  roleFilter === r
                    ? 'bg-[var(--primary)] text-white'
                    : ''
                }`}
              >
                {r}
              </button>
            ))}
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Rôle</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3 font-medium">
                    {u.full_name || '—'}
                  </td>

                  <td className="p-3 text-gray-500">
                    {u.email}
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3">
                    {u.is_blocked ? (
                      <span className="text-red-600 text-xs">
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
                      onClick={() => openEdit(u)}
                      className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleBlock(u)}
                      className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
                    >
                      {u.is_blocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {page}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <EditUserModal
            user={selectedUser}
            onClose={closeModal}
            onUpdated={handleUpdateUser}
          />
        )}

      </div>
    </RoleGuard>
  );
}