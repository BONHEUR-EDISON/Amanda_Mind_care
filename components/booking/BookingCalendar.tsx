'use client';

import { useState } from 'react';

export default function BookingCalendar({
  selectedDate,
  onChange,
}: {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
}) {
  const today = new Date();

  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-2 gap-2">
      {days.map((day) => {
        const isSelected =
          selectedDate?.toDateString() === day.toDateString();

        return (
          <button
            key={day.toISOString()}
            onClick={() => onChange(day)}
            className={`
              p-2 rounded-lg border text-sm
              ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}
            `}
          >
            {day.toDateString().slice(0, 10)}
          </button>
        );
      })}
    </div>
  );
}