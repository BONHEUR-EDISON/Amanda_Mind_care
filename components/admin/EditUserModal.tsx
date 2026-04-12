'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type User = {
  id?: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  is_blocked: boolean;
};

export default function EditUserModal({
  user,
  onClose,
  onUpdated,
}: {
  user?: User | null;
  onClose: () => void;
  onUpdated: (user: User) => void;
}) {
  const isEdit = !!user?.id;

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'patient');
  const [isActive, setIsActive] = useState(user?.is_active ?? true);
  const [isBlocked, setIsBlocked] = useState(user?.is_blocked ?? false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    try {
      // =========================
      // CREATE
      // =========================
      if (!isEdit) {
        const res = await fetch('/api/admin/create-user', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            role,
            full_name: fullName,
          }),
        });

        const data = await res.json();

        if (data.error) throw new Error(data.error);

        onUpdated({
          id: data.user.id,
          full_name: fullName,
          email,
          role,
          is_active: true,
          is_blocked: false,
        });

        onClose();
        return;
      }

      // =========================
      // UPDATE
      // =========================
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          role,
          is_active: isActive,
          is_blocked: isBlocked,
        })
        .eq('id', user.id);

      if (error) throw error;

      onUpdated({
        ...user,
        full_name: fullName,
        role,
        is_active: isActive,
        is_blocked: isBlocked,
      });

      onClose();

    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 space-y-5">

        <h2 className="text-lg font-semibold">
          {isEdit ? 'Modifier utilisateur' : 'Créer utilisateur'}
        </h2>

        {/* NAME */}
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nom complet"
          className="w-full border px-3 py-2 rounded-lg"
        />

        {/* EMAIL */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded-lg"
          disabled={isEdit}
        />

        {/* PASSWORD (CREATE ONLY) */}
        {!isEdit && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full border px-3 py-2 rounded-lg"
          />
        )}

        {/* ROLE */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="admin">Admin</option>
          <option value="therapist">Therapist</option>
          <option value="patient">Patient</option>
        </select>

        {/* EDIT ONLY */}
        {isEdit && (
          <>
            <div className="flex justify-between">
              <span>Actif</span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
            </div>

            <div className="flex justify-between">
              <span className="text-red-600">Bloqué</span>
              <input
                type="checkbox"
                checked={isBlocked}
                onChange={() => setIsBlocked(!isBlocked)}
              />
            </div>
          </>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">

          <button onClick={onClose} className="border px-4 py-2 rounded-lg">
            Annuler
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg"
          >
            {loading
              ? 'Processing...'
              : isEdit
              ? 'Mettre à jour'
              : 'Créer'}
          </button>

        </div>

      </div>
    </div>
  );
}