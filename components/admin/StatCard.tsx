export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div
      className="
        bg-white 
        border border-[var(--border)] 
        rounded-xl 
        p-4 sm:p-5 lg:p-6
        transition
        hover:shadow-sm
      "
    >
      {/* LABEL */}
      <p className="text-xs sm:text-sm text-[var(--muted)]">
        {label}
      </p>

      {/* VALUE */}
      <p className="text-xl sm:text-2xl lg:text-3xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}