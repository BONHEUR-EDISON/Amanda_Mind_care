'use client';

import { useMemo } from 'react';

type Appointment = {
  id: string;
  start_time: string;
  status: string;
};

type Note = {
  id: string;
  created_at: string;
  content?: string;
  mood?: string;
  risk_assessment?: string;
};

type Event =
  | {
      type: 'appointment';
      date: string;
      data: Appointment;
    }
  | {
      type: 'note';
      date: string;
      data: Note;
    };

export default function PatientTimelineProMax({
  appointments = [],
  notes = [],
}: {
  appointments: Appointment[];
  notes: Note[];
}) {
  const events: Event[] = useMemo(() => {
    return [
      ...appointments.map((a) => ({
        type: 'appointment' as const,
        date: a.start_time,
        data: a,
      })),
      ...notes.map((n) => ({
        type: 'note' as const,
        date: n.created_at,
        data: n,
      })),
    ]
      .filter((e) => e.date)
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
      );
  }, [appointments, notes]);

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'happy':
        return 'text-green-600';
      case 'sad':
        return 'text-blue-600';
      case 'anxious':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const isRisk = (text?: string) => {
    if (!text) return false;
    const keywords = ['suicide', 'crisis', 'self-harm', 'panic'];
    return keywords.some((k) =>
      text.toLowerCase().includes(k)
    );
  };

  return (
    <div className="space-y-3">

      {events.length === 0 ? (
        <div className="text-sm text-gray-500">
          Aucun événement clinique
        </div>
      ) : (
        events.map((e) => (
          <div
            key={`${e.type}-${e.data.id}`}
            className="border rounded-xl p-4 bg-white hover:shadow-sm transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold">
                  {e.type === 'appointment'
                    ? '📅 Rendez-vous'
                    : '🧠 Note clinique'}
                </p>

                <p className="text-xs text-gray-400">
                  {new Date(e.date).toLocaleString()}
                </p>
              </div>

              {e.type === 'appointment' ? (
                <span className="text-xs px-2 py-1 rounded bg-gray-100">
                  {e.data.status}
                </span>
              ) : (
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    isRisk(e.data.content)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100'
                  }`}
                >
                  {isRisk(e.data.content)
                    ? '⚠ Risk'
                    : e.data.mood || 'neutral'}
                </span>
              )}
            </div>

            {/* BODY */}
            <div className="mt-2 text-sm text-gray-700">
              {e.type === 'appointment' ? (
                <p>
                  Appointment scheduled / completed session
                </p>
              ) : (
                <p className="line-clamp-2">
                  {e.data.content || '—'}
                </p>
              )}
            </div>

            {/* FOOTER INSIGHT */}
            {e.type === 'note' && (
              <div className="mt-2 text-xs flex justify-between text-gray-400">
                <span>
                  Mood:{' '}
                  <span
                    className={getMoodColor(e.data.mood)}
                  >
                    {e.data.mood || '—'}
                  </span>
                </span>

                {isRisk(e.data.content) && (
                  <span className="text-red-500 font-medium">
                    High risk detected
                  </span>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}