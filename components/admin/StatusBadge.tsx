'use client';

type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const map: Record<
    string,
    { label: string; className: string }
  > = {
    active: {
      label: 'Actif',
      className: 'bg-green-100 text-green-700',
    },
    inactive: {
      label: 'Inactif',
      className: 'bg-gray-100 text-gray-600',
    },
    pending: {
      label: 'En attente',
      className: 'bg-yellow-100 text-yellow-700',
    },
    confirmed: {
      label: 'Confirmé',
      className: 'bg-blue-100 text-blue-700',
    },
    completed: {
      label: 'Complété',
      className: 'bg-green-100 text-green-700',
    },
    cancelled: {
      label: 'Annulé',
      className: 'bg-red-100 text-red-700',
    },
    no_show: {
      label: 'Absent',
      className: 'bg-red-100 text-red-700',
    },
  };

  const current =
    map[status] || {
      label: status,
      className: 'bg-gray-100 text-gray-600',
    };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${current.className}`}
    >
      {current.label}
    </span>
  );
}