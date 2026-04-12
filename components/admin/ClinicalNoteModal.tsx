'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  patientId: string;
  therapistId?: string | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function ClinicalNoteModal({
  patientId,
  therapistId,
  onClose,
  onSaved,
}: Props) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase.from('session_notes').insert({
        patient_id: patientId,
        therapist_id: therapistId || null,
        content,
        mood,
      });

      if (error) throw error;

      onSaved();
      onClose();
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4">

        {/* TITLE */}
        <h2 className="text-lg font-semibold">
          Ajouter une note clinique
        </h2>

        {/* MOOD */}
        <div>
          <label className="text-xs text-gray-500">
            Humeur
          </label>

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
          >
            <option value="stable">Stable</option>
            <option value="improving">Amélioration</option>
            <option value="critical">Critique</option>
            <option value="neutral">Neutre</option>
          </select>
        </div>

        {/* CONTENT */}
        <div>
          <label className="text-xs text-gray-500">
            Note clinique
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Observation clinique..."
            className="w-full border p-2 rounded-lg mt-1"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-3 py-2 bg-[var(--primary)] text-white rounded-lg text-sm"
          >
            {loading ? 'Sauvegarde...' : 'Enregistrer'}
          </button>

        </div>

      </div>

    </div>
  );
}