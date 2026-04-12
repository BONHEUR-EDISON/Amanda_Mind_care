'use client';

export default function LoadingState({
  label = 'Chargement...',
}: {
  label?: string;
}) {
  return (
    <div
      className="
        w-full min-h-[220px]
        flex flex-col items-center justify-center
        px-4
      "
      role="status"
      aria-live="polite"
    >
      {/* SPINNER */}
      <div
        className="
          w-8 h-8
          border-2 border-gray-200
          border-t-[var(--primary)]
          rounded-full
          animate-spin
        "
      />

      {/* DOT ANIMATION */}
      <div className="flex gap-1 mt-3">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>

      <p className="mt-3 text-sm text-[var(--muted)]">
        {label}
      </p>
    </div>
  );
}