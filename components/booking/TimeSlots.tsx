'use client';

export default function TimeSlots({
  date,
  appointments,
  selectedSlot,
  onSelect
}: any) {
  if (!date) {
    return <p className="text-sm text-gray-500">Choisissez une date</p>;
  }

  const slots = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00'
  ];

  const isTaken = (slot: string) => {
    return appointments.some((a: any) =>
      new Date(a.start_time).toLocaleTimeString().startsWith(slot)
    );
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => {
        const taken = isTaken(slot);

        return (
          <button
            key={slot}
            disabled={taken}
            onClick={() => onSelect(slot)}
            className={`
              text-sm p-2 rounded-lg border
              ${taken ? 'bg-gray-100 text-gray-400' : 'hover:bg-blue-50'}
              ${selectedSlot === slot ? 'bg-blue-600 text-white' : ''}
            `}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}