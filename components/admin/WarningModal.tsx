

export default function WarningModal({
  countdown,
  onStayConnected,
  onLogout
}: {
  countdown: number;
  onStayConnected: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl w-[350px] text-center">
        <h2 className="text-xl font-semibold mb-2">
          ⚠️ Session expirante
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Vous serez déconnecté dans <b>{countdown}s</b>
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onStayConnected}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Rester connecté
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}