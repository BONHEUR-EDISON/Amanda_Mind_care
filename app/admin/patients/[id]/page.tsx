'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import RoleGuard from '@/components/guards/RoleGuard';
import LoadingState from '@/components/admin/LoadingState';
import StatusBadge from '@/components/admin/StatusBadge';
import ClinicalNoteModal from '@/components/admin/ClinicalNoteModal';
import PatientTimeline from '@/components/admin/PatientTimeline';

// ================= TYPES =================
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
};

type Note = {
  id: string;
  content?: string;
  mood?: string;
  created_at?: string;
};

type AIInsight = {
  summary: string;
  riskScore: number;
  dominantMood: string;
  recommendation: string;
};

// ================= PAGE =================
export default function PatientDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNote, setOpenNote] = useState(false);

  // ================= LOAD =================
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);

      const [p, a, n] = await Promise.all([
        supabase
          .from('profiles')
          .select(
            'id, full_name, email, phone, is_active, created_at'
          )
          .eq('id', id)
          .maybeSingle(),

        supabase
          .from('appointments')
          .select('id, status, start_time')
          .eq('patient_id', id),

        supabase
          .from('session_notes')
          .select('id, content, mood, created_at')
          .eq('patient_id', id),
      ]);

      setPatient(p.data ?? null);
      setAppointments((a.data || []).filter(Boolean));
      setNotes((n.data || []).filter(Boolean));

      setLoading(false);
    };

    load();
  }, [id]);

  // ================= AI =================
  const ai = useMemo<AIInsight>(() => {
    const moodCount: Record<string, number> = {};

    notes.forEach((n) => {
      if (n.mood) {
        moodCount[n.mood] =
          (moodCount[n.mood] || 0) + 1;
      }
    });

    const dominantMood =
      Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      'neutral';

    const riskWords = [
      'suicide',
      'panic',
      'crisis',
      'self-harm',
    ];

    const riskHits = notes.filter((n) =>
      riskWords.some((w) =>
        (n.content || '').toLowerCase().includes(w)
      )
    ).length;

    const riskScore = Math.min(
      100,
      riskHits * 40 + notes.length * 2
    );

    return {
      summary: `${notes.length} notes • Mood: ${dominantMood}`,
      riskScore,
      dominantMood,
      recommendation:
        riskScore > 60
          ? '⚠️ Suivi urgent recommandé'
          : 'Suivi normal',
    };
  }, [notes]);

  // ================= LOADING =================
  if (loading) {
    return <LoadingState label="Chargement..." />;
  }

  if (!patient) {
    return <div>Patient introuvable</div>;
  }

  // ================= UI =================
  return (
    <RoleGuard role="admin">
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">
              {patient.full_name}
            </h1>
            <p className="text-sm text-gray-500">
              Dossier patient
            </p>
          </div>

          <StatusBadge
            status={
              patient.is_active ? 'active' : 'inactive'
            }
          />
        </div>

        {/* AI CARD */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl border">
          <h2 className="font-semibold mb-2">
            🧠 AI Insight
          </h2>

          <p className="text-sm">{ai.summary}</p>

          <div className="flex gap-6 mt-3">
            <div>
              <p className="text-xs text-gray-400">
                Risk
              </p>
              <p
                className={`font-bold ${
                  ai.riskScore > 60
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {ai.riskScore}/100
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Mood
              </p>
              <p className="font-medium">
                {ai.dominantMood}
              </p>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600">
            💡 {ai.recommendation}
          </p>
        </div>

        {/* PROFILE */}
        <div className="grid md:grid-cols-3 gap-4 bg-white p-4 border rounded-xl">
          <div>
            <p className="text-xs text-gray-400">
              Email
            </p>
            <p>{patient.email}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Téléphone
            </p>
            <p>{patient.phone || '—'}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              Créé le
            </p>
            <p>
              {patient.created_at
                ? new Date(
                    patient.created_at
                  ).toLocaleDateString()
                : '—'}
            </p>
          </div>
        </div>

        {/* TIMELINE */}
        <PatientTimeline
          appointments={appointments}
          notes={notes}
        />

        {/* NOTES */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex justify-between mb-3">
            <h2 className="font-semibold">
              Notes cliniques
            </h2>

            <button
              onClick={() => setOpenNote(true)}
              className="bg-indigo-600 text-white px-3 py-1 rounded"
            >
              + Ajouter
            </button>
          </div>

          {notes.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucune note
            </p>
          ) : (
            notes.map((n) => (
              <div key={n.id} className="border-b py-2">
                <p>{n.content || '—'}</p>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {openNote && (
          <ClinicalNoteModal
            patientId={patient.id}
            onClose={() => setOpenNote(false)}
            onSaved={(newNote: Note) =>
              setNotes((prev) => [newNote, ...prev])
            }
          />
        )}

      </div>
    </RoleGuard>
  );
}
