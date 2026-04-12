'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Patient = {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'patient';
  is_active: boolean;
};

type Props = {
  patient: Patient | null; // null = create
  onClose: () => void;
  onSaved: (patient: Patient) => void;
};

export default function PatientModal({
  patient,
  onClose,
  onSaved,
}: Props) {
  const isEdit = !!patient?.id;

  const [form, setForm] = useState<Patient>({
    full_name: '',
    email: '',
    phone: '',
    role: 'patient',
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // INIT FORM
  // =========================
  useEffect(() => {
    if (patient) {
      setForm(patient);
    }
  }, [patient]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT (CREATE / UPDATE)
  // =========================
  const handleSubmit = async () => {
    setLoading(true);

    try {
      // =========================
      // UPDATE
      // =========================
      if (isEdit && patient?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            full_name: form.full_name,
            phone: form.phone,
            is_active: form.is_active,
          })
          .eq('id', patient.id)
          .select()
          .single();

        if (error) throw error;

        onSaved(data);
      }

      // =========================
      // CREATE (IMPORTANT)
      // =========================
      else {
        /**
         * IMPORTANT LOGIQUE :
         * - Supabase Auth doit créer USER
         * - puis trigger crée profile automatiquement
         *
         * Ici on suppose admin crée user via invite
         */

        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: 'TempPassword123!', // tu peux améliorer après
          options: {
            data: {
              full_name: form.full_name,
              role: 'patient',
            },
          },
        });

        if (error) throw error;

        // profile sera créé automatiquement via trigger
        if (data.user) {
          const newPatient = {
            id: data.user.id,
            ...form,
          };

          onSaved(newPatient);
        }
      }

      onClose();
    } catch (err) {
      console.error('Patient save error:', err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">

        {/* TITLE */}
        <h2 className="text-lg font-semibold">
          {isEdit ? 'Modifier patient' : 'Créer patient'}
        </h2>

        {/* FULL NAME */}
        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          placeholder="Nom complet"
          className="w-full border p-2 rounded-lg"
        />

        {/* EMAIL */}
        {!isEdit && (
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded-lg"
          />
        )}

        {/* PHONE */}
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Téléphone"
          className="w-full border p-2 rounded-lg"
        />

        {/* ACTIVE */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                is_active: e.target.checked,
              }))
            }
          />
          Actif
        </label>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-3">

          <button
            onClick={onClose}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-2 bg-[var(--primary)] text-white rounded-lg text-sm"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>

        </div>

      </div>
    </div>
  );
}