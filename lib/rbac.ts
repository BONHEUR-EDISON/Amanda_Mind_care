export const permissions = {
  admin: [
    'users.read',
    'users.write',
    'users.block',
    'appointments.read',
    'appointments.write',
    'analytics.read',
  ],
  therapist: [
    'appointments.read',
    'appointments.write',
  ],
  patient: [
    'appointments.read',
  ],
};

export function can(role: string, action: string) {
  return permissions[role as keyof typeof permissions]?.includes(action);
}