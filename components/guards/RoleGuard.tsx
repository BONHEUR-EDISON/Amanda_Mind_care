'use client';

import { useRoleGuard } from '@/hooks/useRoleGuard';

type Role = 'admin' | 'therapist' | 'patient' | 'staff';

export default function RoleGuard({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const status = useRoleGuard(role);

  // =========================
  // 🔒 LOADING → RIEN DU LAYOUT
  // =========================
  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 border-2 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  // =========================
  // 🚫 BLOCKED → RIEN
  // =========================
  if (status === 'blocked') {
    return null; // redirect déjà fait
  }

  // =========================
  // ✅ OK → RENDER LAYOUT
  // =========================
  return <>{children}</>;
}