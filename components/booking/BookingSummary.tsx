'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function BookingSummary({
  therapistId,
  date,
  slot
}: any) {
  const [loading, setLoading] = useState(false);

  const createBooking = async () => {
    if (!date || !slot) return;

    setLoading(true);

    const start = new Date(date);
    const [h, m] = slot.split(':');

    start.setHours(Number(h), Number(m));

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 60);

    const { error } = await supabase.from('appointments').insert({
      therapist_id: therapistId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      status: 'pending'
    });

    setLoading(false);

    if (error) {
      alert('Erreur réservation');
      return;
    }

    alert('Rendez-vous confirmé ✅');
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        <p>Date: {date?.toDateString()}</p>
        <p>Heure: {slot || '-'}</p>
      </div>

      <button
        onClick={createBooking}
        disabled={!date || !slot || loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Réservation...' : 'Confirmer le rendez-vous'}
      </button>
    </div>
  );
}