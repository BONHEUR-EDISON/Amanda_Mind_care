'use client';

import { useAdminData } from '@/hooks/useAdminData';
import { supabase } from '@/lib/supabase';
import StatusBadge from '../components/StatusBadge';

export default function AppointmentsPage() {
  const { appointments } = useAdminData();

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-5">
        Rendez-vous
      </h1>

      <div className="space-y-3">

        {appointments.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-[var(--border)] p-4 rounded-xl flex justify-between items-center"
          >

            <div>
              <p className="font-medium">{a.therapist}</p>
              <p className="text-sm text-[var(--muted)]">
                {new Date(a.appointment_date).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">

              <StatusBadge status={a.status} />

              <button
                onClick={() => updateStatus(a.id, 'confirmed')}
                className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-md"
              >
                Confirmer
              </button>

              <button
                onClick={() => updateStatus(a.id, 'cancelled')}
                className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-md"
              >
                Annuler
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}