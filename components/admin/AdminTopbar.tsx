'use client';

import { useState } from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminTopbar() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <header className="w-full h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-6">

      {/* SEARCH */}
      <div className="flex items-center gap-2 w-full max-w-md bg-gray-50 px-3 rounded-lg border border-[var(--border)]">
        <Search size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full h-10 bg-transparent text-sm outline-none"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">

        {/* NOTIF */}
        <button className="relative w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center hover:bg-gray-50">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* USER */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-semibold">
            A
          </div>

          <div className="text-sm">
            <p className="font-medium leading-none">Admin</p>
            <p className="text-xs text-[var(--muted)]">Clinic</p>
          </div>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-14 w-48 bg-white border border-[var(--border)] rounded-xl shadow-lg p-2">

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"
            >
              <LogOut size={16} />
              Déconnexion
            </button>

          </div>
        )}

      </div>
    </header>
  );
}