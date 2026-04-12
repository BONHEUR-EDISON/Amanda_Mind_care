'use client';

import RoleGuard from '@/components/guards/RoleGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role="admin">
      <div className="h-screen flex bg-[var(--background)] text-[var(--foreground)] overflow-hidden">

        {/* SIDEBAR */}
        <div className="h-screen w-[260px] flex-shrink-0 border-r border-[var(--border)]">
          <AdminSidebar />
        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* TOPBAR */}
          <div className="flex-shrink-0 border-b border-[var(--border)]">
            <AdminTopbar />
          </div>

          {/* CONTENT */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>

        </div>

      </div>
    </RoleGuard>
  );
}