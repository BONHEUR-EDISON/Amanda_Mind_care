export default function DataTable({
  columns,
  data,
}: {
  columns: string[];
  data: any[];
}) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="grid grid-cols-3 bg-gray-50 text-sm font-medium p-3">
        {columns.map((col) => (
          <div key={col}>{col}</div>
        ))}
      </div>

      {/* ROWS */}
      {data.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-3 p-3 border-t text-sm"
        >
          {Object.values(row).slice(0, 3).map((val: any, idx) => (
            <div key={idx}>{String(val)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}