export default function StatsCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4">

      <div className="bg-white p-5 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-500">Séances</p>
        <h3 className="text-xl font-semibold">0</h3>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-500">Rendez-vous</p>
        <h3 className="text-xl font-semibold">0</h3>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-100">
        <p className="text-sm text-gray-500">Progression</p>
        <h3 className="text-xl font-semibold">Stable</h3>
      </div>

    </div>
  );
}