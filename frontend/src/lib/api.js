/**
 * API helper - ready for JWT backend integration.
 * When backend is available, set BASE_URL and use getAuthHeaders() for protected routes.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '';

export function getAuthHeaders() {
  const token = localStorage.getItem('coderelay_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data; // { user, token }
}
