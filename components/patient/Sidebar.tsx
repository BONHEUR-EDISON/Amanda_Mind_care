'use client';

import { Home, Calendar, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-100 p-5 hidden md:flex flex-col">

      <div className="text-xl font-semibold mb-10">
        AMC
      </div>

      <nav className="space-y-4 text-sm">

        <Link href="/patient" className="flex items-center gap-3 text-gray-700 hover:text-black">
          <Home size={18} /> Dashboard
        </Link>

        <Link href="/patient/appointments" className="flex items-center gap-3 text-gray-700 hover:text-black">
          <Calendar size={18} /> Rendez-vous
        </Link>
        <Link href="/patient/messages" className="flex items-center gap-3 text-gray-700 hover:text-black">
          <MessageSquare size={18} /> Messages
        </Link>

        <Link href="/patient/profile" className="flex items-center gap-3 text-gray-700 hover:text-black">
          <User size={18} /> Profil
        </Link>

      </nav>

    </div>
  );
}