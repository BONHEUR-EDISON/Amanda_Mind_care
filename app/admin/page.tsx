'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

import RoleGuard from '@/components/guards/RoleGuard';
import StatCard from '@/components/admin/StatCard';
import LoadingState from '@/components/admin/LoadingState';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type User = {
  id: string;
  role: string;
  full_name?: string;
};

type Appointment = {
  id: string;
  status: string;
  start_time: string;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA (SAFE + ANTI-CRASH)
  // =========================
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const [{ data: u }, { data: a }] = await Promise.all([
          supabase.from('profiles').select('id, role, full_name'),
          supabase.from('appointments').select('id, status, start_time'),
        ]);

        if (!mounted) return;

        setUsers(u ?? []);
        setAppointments(a ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================
  // KPIs (SAFE FILTERS)
  // =========================
  const patients = useMemo(
    () => users.filter((u) => u.role === 'patient'),
    [users]
  );

  const therapists = useMemo(() => {
  return users.filter((u) =>
    ['therapist', 'psy', 'psychologist', 'Therapist'].includes(
      u.role?.toLowerCase().trim()
    )
  );
}, [users]);

  const pending = useMemo(
    () => appointments.filter((a) => a.status === 'pending'),
    [appointments]
  );

  const completed = useMemo(
    () => appointments.filter((a) => a.status === 'completed'),
    [appointments]
  );

  const completionRate = useMemo(() => {
    if (appointments.length === 0) return 0;
    return Math.round((completed.length / appointments.length) * 100);
  }, [appointments, completed]);

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort(
        (a, b) =>
          new Date(b.start_time).getTime() -
          new Date(a.start_time).getTime()
      )
      .slice(0, 5);
  }, [appointments]);

  // =========================
  // CHART DATA (SAFE MAPS)
  // =========================
  const appointmentsByDay = useMemo(() => {
    const map: Record<string, number> = {};

    appointments.forEach((a) => {
      if (!a?.start_time) return;

      const day = new Date(a.start_time).toLocaleDateString();
      map[day] = (map[day] || 0) + 1;
    });

    return Object.entries(map).map(([date, count]) => ({
      date,
      count,
    }));
  }, [appointments]);

  const statusStats = useMemo(() => {
    const map: Record<string, number> = {};

    appointments.forEach((a) => {
      if (!a?.status) return;
      map[a.status] = (map[a.status] || 0) + 1;
    });

    return Object.entries(map).map(([status, count]) => ({
      status,
      count,
    }));
  }, [appointments]);

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <LoadingState label="Chargement dashboard admin..." />;
  }

  // =========================
  // UI
  // =========================
  return (
    <RoleGuard role="admin">
      <div className="space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold">
            Dashboard Admin
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Vue globale de la clinique
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          <StatCard label="Patients" value={patients.length} />
          <StatCard label="Psychologues" value={therapists.length} />
          <StatCard label="Rendez-vous" value={appointments.length} />
          <StatCard label="En attente" value={pending.length} />
          <StatCard label="Complétion" value={`${completionRate}%`} />

        </div>

        {/* ================= CHARTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LINE */}
          <div className="bg-white border rounded-xl p-5">
            <h2 className="font-semibold mb-4">
              Activité des rendez-vous
            </h2>

            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentsByDay}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PIE */}
          <div className="bg-white border rounded-xl p-5">
            <h2 className="font-semibold mb-4">
              Statut des rendez-vous
            </h2>

            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusStats}
                    dataKey="count"
                    nameKey="status"
                    outerRadius={90}
                  >
                    {statusStats.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ================= RECENTS ================= */}
        <div className="bg-white border rounded-xl p-5">

          <h2 className="font-semibold mb-4">
            Rendez-vous récents
          </h2>

          {recentAppointments.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucun rendez-vous
            </p>
          ) : (
            <div className="space-y-3">

              {recentAppointments.map((a) => (
                <div
                  key={a.id}
                  className="flex justify-between text-sm border-b pb-2"
                >
                  <div>
                    <p className="font-medium">
                      Rendez-vous
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(a.start_time).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-md ${
                      a.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : a.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {a.status}
                  </span>

                </div>
              ))}

            </div>
          )}
        </div>

        {/* ================= ALERT ================= */}
        {pending.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm font-medium text-yellow-700">
              ⚠ {pending.length} rendez-vous en attente
            </p>
          </div>
        )}

      </div>
    </RoleGuard>
  );
}