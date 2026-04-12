'use client';

import { useRoleGuard } from '@/hooks/useRoleGuard';

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = useRoleGuard('admin');

  // =========================
  // LOADING SCREEN
  // =========================
  if (status === 'loading') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-4" />
        <p className="text-sm text-gray-500">
          Vérification sécurité admin...
        </p>
      </div>
    );
  }

  // =========================
  // BLOCKED (REDIRECT déjà fait)
  // =========================
  if (status === 'blocked') {
    return null;
  }

  return <>{children}</>;
}