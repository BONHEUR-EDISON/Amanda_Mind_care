export async function impersonateUser(userId: string) {
  // ⚠️ production = edge function recommandé
  localStorage.setItem('impersonate', userId);
  window.location.href = '/patient';
}