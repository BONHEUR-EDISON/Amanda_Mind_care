'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const generateSlots = () => {
  const slots = [];
  for (let h = 9; h <= 17; h++) {
    slots.push(`${h}:00`);
    slots.push(`${h}:30`);
  }
  return slots;
};

export default function CalendarBooking({ therapistId }: { therapistId: string }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const slots = generateSlots();

  const bookAppointment = async () => {
    if (!selectedSlot) return;

    setLoading(true);

    const now = new Date();
    const [hour, minute] = selectedSlot.split(':');

    const start = new Date();
    start.setHours(Number(hour), Number(minute), 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 60);

    const user = await supabase.auth.getUser();

    const { error } = await supabase.from('appointments').insert({
      patient_id: user.data.user?.id,
      therapist_id: therapistId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      status: 'confirmed',
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert('Rendez-vous confirmé ✅');
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-4">

      {/* GRID SLOTS */}
      <div className="grid grid-cols-4 gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            className={`p-2 text-sm rounded-lg border ${
              selectedSlot === slot
                ? 'bg-[#6B9AC4] text-white'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* ACTION */}
      <button
        onClick={bookAppointment}
        disabled={!selectedSlot || loading}
        className="w-full bg-[#6B9AC4] text-white py-2 rounded-lg text-sm disabled:opacity-50"
      >
        {loading ? 'Réservation...' : 'Confirmer le rendez-vous'}
      </button>
    </div>
  );
}