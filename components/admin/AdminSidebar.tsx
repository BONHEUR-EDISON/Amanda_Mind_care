'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  Settings,
  User,
} from 'lucide-react';

const menu = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Patients', href: '/admin/patients', icon: User },
  { name: 'Rendez-vous', href: '/admin/appointments', icon: Calendar },
  { name: 'Analytics', href: '/admin/analytics', icon: Activity },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        w-[260px]
        h-screen
        flex flex-col
        bg-white
        border-r border-[var(--border)]
        p-5
        sticky top-0
      "
    >

      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-lg font-semibold tracking-tight">
          Admin Clinic
        </h1>
        <p className="text-xs text-[var(--muted)]">
          Management Panel
        </p>
      </div>

      {/* NAV */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3
                px-3 py-2 rounded-lg text-sm
                transition
                ${
                  active
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="pt-6 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--muted)]">
          © Clinic SaaS
        </p>
      </div>

    </aside>
  );
}