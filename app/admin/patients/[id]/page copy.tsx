'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import RoleGuard from '@/components/guards/RoleGuard';
import LoadingState from '@/components/admin/LoadingState';
import StatusBadge from '@/components/admin/StatusBadge';

type Patient = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  created_at?: string;
};

type Appointment = {
  id: string;
  status: string;
  start_time: string;
  therapist_id: string;
};

type Note = {
  id: string;
  content: string;
  mood?: string;
  created_at: string;
};

export default function PatientDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      const [profileRes, apptRes, notesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, email, phone, is_active, created_at')
          .eq('id', id)
          .single(),

        supabase
          .from('appointments')
          .select('id, status, start_time, therapist_id')
          .eq('patient_id', id)
          .order('start_time', { ascending: false }),

        supabase
          .from('session_notes')
          .select('id, content, mood, created_at')
          .eq('patient_id', id)
          .order('created_at', { ascending: false }),
      ]);

      if (!mounted) return;

      setPatient(profileRes.data || null);
      setAppointments(apptRes.data || []);
      setNotes(notesRes.data || []);

      setLoading(false);
    };

    if (id) load();

    return () => {
      mounted = false;
    };
  }, [id]);

  // =========================
  // KPIs
  // =========================
  const stats = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter(
      (a) => a.status === 'completed'
    ).length;

    const pending = appointments.filter(
      (a) => a.status === 'pending'
    ).length;

    return {
      total,
      completed,
      pending,
      rate:
        total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [appointments]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <LoadingState label="Chargement dossier patient..." />
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-sm text-red-500">
        Patient introuvable
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <RoleGuard role="admin">
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          <div>
            <h1 className="text-2xl font-semibold">
              {patient.full_name}
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Dossier patient
            </p>
          </div>

          <StatusBadge
            status={patient.is_active ? 'active' : 'inactive'}
          />

        </div>

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white border rounded-xl p-5 grid md:grid-cols-3 gap-4">

          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm font-medium">
              {patient.email}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Téléphone</p>
            <p className="text-sm font-medium">
              {patient.phone || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Créé le</p>
            <p className="text-sm font-medium">
              {patient.created_at
                ? new Date(
                    patient.created_at
                  ).toLocaleDateString()
                : '—'}
            </p>
          </div>

        </div>

        {/* ================= KPI ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-400">
              Total RDV
            </p>
            <p className="text-xl font-semibold">
              {stats.total}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-400">
              Complétés
            </p>
            <p className="text-xl font-semibold text-green-600">
              {stats.completed}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-400">
              En attente
            </p>
            <p className="text-xl font-semibold text-yellow-600">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-4">
            <p className="text-xs text-gray-400">
              Taux complétion
            </p>
            <p className="text-xl font-semibold text-indigo-600">
              {stats.rate}%
            </p>
          </div>

        </div>

        {/* ================= APPOINTMENTS ================= */}
        <div className="bg-white border rounded-xl p-5">

          <h2 className="font-semibold mb-4">
            Rendez-vous
          </h2>

          {appointments.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun rendez-vous
            </p>
          ) : (
            <div className="space-y-3">

              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between border-b pb-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      RDV
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(
                        a.start_time
                      ).toLocaleString()}
                    </p>
                  </div>

                  <StatusBadge status={a.status} />

                </div>
              ))}

            </div>
          )}

        </div>

        {/* ================= NOTES ================= */}
        <div className="bg-white border rounded-xl p-5">

          <h2 className="font-semibold mb-4">
            Notes cliniques
          </h2>

          {notes.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucune note
            </p>
          ) : (
            <div className="space-y-3">

              {notes.map((n) => (
                <div
                  key={n.id}
                  className="border-b pb-3"
                >
                  <p className="text-sm">
                    {n.content}
                  </p>

                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{n.mood || '—'}</span>
                    <span>
                      {new Date(
                        n.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </RoleGuard>
  );
}