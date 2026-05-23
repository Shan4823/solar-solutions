const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('ss_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => request('/auth/me'),

  // Applications
  submitApplication: (body) => request('/applications', { method: 'POST', body: JSON.stringify(body) }),
  myApplications:   ()     => request('/applications/mine'),
  allApplications:  (qs='') => request(`/applications${qs}`),
  updateAppStatus:  (id, body) => request(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  // Admin – users
  adminUsers:       (qs='') => request(`/admin/users${qs}`),
  adminStats:       ()      => request('/admin/stats'),
  deactivateUser:   (id)    => request(`/admin/users/${id}/deactivate`, { method: 'PATCH' }),
  activateUser:     (id)    => request(`/admin/users/${id}/activate`,   { method: 'PATCH' }),
  deleteUser:       (id)    => request(`/admin/users/${id}`,            { method: 'DELETE' }),
  createAdmin:      (body)  => request('/admin/create-admin',           { method: 'POST', body: JSON.stringify(body) }),

  // Public enquiries (no auth)
  submitEnquiry:    (body)  => request('/enquiries',                     { method: 'POST', body: JSON.stringify(body) }),
  adminEnquiries:   (qs='') => request(`/enquiries${qs}`),
  updateEnquiry:    (id, body) => request(`/enquiries/${id}/status`,     { method: 'PATCH', body: JSON.stringify(body) }),

  // Profile
  updateProfile:    (body)  => request('/auth/profile',  { method: 'PATCH',  body: JSON.stringify(body) }),
  changePassword:   (body)  => request('/auth/password', { method: 'PATCH',  body: JSON.stringify(body) }),
  deleteAccount:    (body)  => request('/auth/account',  { method: 'DELETE', body: JSON.stringify(body) }),
};

