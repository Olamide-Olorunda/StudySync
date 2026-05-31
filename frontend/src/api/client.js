const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const parseJson = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }
  return response.json();
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message = data?.error || data?.message || 'Request failed';
    throw new Error(message);
  }

  return data ?? {};
};

export const getSession = () => request('/auth/session.php', { method: 'GET' });
export const login = (payload) =>
  request('/auth/login.php', { method: 'POST', body: JSON.stringify(payload) });
export const register = (payload) =>
  request('/auth/register.php', { method: 'POST', body: JSON.stringify(payload) });
export const logout = () => request('/auth/logout.php', { method: 'POST' });

export const getDashboard = () => request('/dashboard.php', { method: 'GET' });
export const listGroups = () => request('/groups/list.php', { method: 'GET' });
export const getGroupDetails = (groupId) =>
  request(`/groups/details.php?group_id=${groupId}`, { method: 'GET' });
export const joinGroup = (groupId) =>
  request('/groups/join.php', { method: 'POST', body: JSON.stringify({ group_id: groupId }) });
export const leaveGroup = (groupId) =>
  request('/groups/leave.php', { method: 'POST', body: JSON.stringify({ group_id: groupId }) });
