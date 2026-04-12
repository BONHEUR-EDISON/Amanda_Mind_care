'use client';

export default function Header() {
  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">

      <div className="text-sm text-gray-500">
        Espace patient sécurisé
      </div>

      <div className="w-8 h-8 rounded-full bg-[#6B9AC4] text-white flex items-center justify-center text-sm">
        U
      </div>

    </div>
  );
}