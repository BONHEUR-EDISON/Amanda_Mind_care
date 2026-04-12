'use client';

export default function BookingConfirmModal({
  open,
  onClose,
  onConfirm,
  date,
  slot,
  loading,
}: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[400px] rounded-xl p-5 space-y-4">

        <h2 className="text-lg font-semibold">
          Confirmer le rendez-vous
        </h2>

        <div className="text-sm text-gray-600">
          <p>Date: {date?.toDateString()}</p>
          <p>Heure: {slot}</p>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm border rounded-lg"
          >
            Annuler
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg"
          >
            {loading ? 'Confirmation...' : 'Confirmer'}
          </button>
        </div>

      </div>
    </div>
  );
}