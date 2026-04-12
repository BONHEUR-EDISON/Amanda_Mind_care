'use client';

export default function EmptyState({
  title = "Aucune donnée",
  description = "Rien à afficher pour le moment.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="w-full py-12 text-center">

      {/* icon */}
      <div className="w-12 h-12 mx-auto rounded-full bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] text-lg">
        ⊘
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
        {title}
      </h3>

      <p className="mt-1 text-sm text-[var(--muted)]">
        {description}
      </p>

    </div>
  );
}