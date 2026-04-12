'use client';

export default function ConfirmModal({
  open,
  title = "Confirmation",
  description = "Êtes-vous sûr ?",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-lg">

        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <p className="text-sm text-[var(--muted)] mt-2">
          {description}
        </p>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Confirmer
          </button>

        </div>

      </div>
    </div>
  );
}