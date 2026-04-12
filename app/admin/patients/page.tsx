'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import RoleGuard from '@/components/guards/RoleGuard';
import LoadingState from '@/components/admin/LoadingState';
import PatientModal from '@/components/admin/PatientModal';

type Patient = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
};

export default function PatientsPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // UI STATE
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // MODAL
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // =========================
  // FETCH PATIENTS
  // =========================
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, role, is_active')
        .eq('role', 'patient')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!mounted) return;

      if (!error) {
        setPatients(data || []);
      }

      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [page]);

  // =========================
  // SEARCH FILTER
  // =========================
  const filtered = useMemo(() => {
    return patients.filter((p) =>
      `${p.full_name} ${p.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [patients, search]);

  // =========================
  // CREATE / EDIT
  // =========================
  const openCreate = () => {
    setSelectedPatient(null);
    setOpenModal(true);
  };

  const openEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenModal(true);
  };

  const handleSaved = (patient: Patient) => {
    setPatients((prev) => {
      const exists = prev.find((p) => p.id === patient.id);

      if (exists) {
        return prev.map((p) =>
          p.id === patient.id ? patient : p
        );
      }

      return [patient, ...prev];
    });
  };

  // =========================
  // TOGGLE ACTIVE
  // =========================
  const toggleActive = async (patient: Patient) => {
    await supabase
      .from('profiles')
      .update({ is_active: !patient.is_active })
      .eq('id', patient.id);

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patient.id
          ? { ...p, is_active: !p.is_active }
          : p
      )
    );
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <LoadingState label="Chargement des patients..." />
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <RoleGuard role="admin">
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Patients
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Gestion des dossiers patients
            </p>
          </div>

          <button
            onClick={openCreate}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm"
          >
            + Nouveau patient
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher patient..."
            className="border px-3 py-2 rounded-lg w-full md:w-80"
          />

          <span className="text-sm text-gray-500">
            Total: {filtered.length}
          </span>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">

            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Téléphone</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/patients/${p.id}`)}
                >
                  <td className="p-3 font-medium">
                    {p.full_name || '—'}
                  </td>

                  <td className="p-3 text-gray-500">
                    {p.email}
                  </td>

                  <td className="p-3 text-gray-500">
                    {p.phone || '—'}
                  </td>

                  <td className="p-3">
                    {p.is_active ? (
                      <span className="text-green-600 text-xs">
                        Actif
                      </span>
                    ) : (
                      <span className="text-red-600 text-xs">
                        Inactif
                      </span>
                    )}
                  </td>

                  <td
                    className="p-3 flex gap-2"
                    onClick={(e) => e.stopPropagation()} // empêche clic ligne
                  >
                    <button
                      onClick={() => openEdit(p)}
                      className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleActive(p)}
                      className="px-2 py-1 border rounded text-xs hover:bg-gray-50"
                    >
                      {p.is_active ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => router.push(`/admin/patients/${p.id}`)}
                      className="px-2 py-1 border rounded text-xs bg-blue-50 hover:bg-blue-100"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {page}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>

        {/* MODAL */}
        {openModal && (
          <PatientModal
            patient={selectedPatient}
            onClose={() => setOpenModal(false)}
            onSaved={handleSaved}
          />
        )}

      </div>
    </RoleGuard>
  );
}