const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, body: { error?: string; code?: string }) {
    super(body.error || 'Unknown error');
    this.status = status;
    this.code = body.code || 'UNKNOWN';
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Network error' }));
    throw new ApiError(res.status, body);
  }

  return res.json();
}

export const api = {
  auth: {
    register: (data: { username: string; email: string; password: string }) =>
      request<any>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),

    login: (data: { email: string; password: string }) =>
      request<any>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },

  works: {
    list: (params?: Record<string, string | number>) => {
      const qs = params ? '?' + new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString() : '';
      return request<any>(`/api/works${qs}`);
    },

    get: (id: number) => request<any>(`/api/works/${id}`),

    create: (data: any) =>
      request<any>('/api/works', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: any) =>
      request<any>(`/api/works/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request<any>(`/api/works/${id}`, { method: 'DELETE' }),
  },

  upload: {
    file: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new ApiError(res.status, body);
      }
      return res.json();
    },
  },

  users: {
    get: (id: number) => request<any>(`/api/users/${id}`),
    me: () => request<any>('/api/users/me'),
  },

  revenue: {
    list: () => request<any[]>('/api/revenue'),
  },

  verify: {
    sendCode: (email: string) =>
      request<any>('/api/verify/send-code', { method: 'POST', body: JSON.stringify({ email }) }),

    checkCode: (email: string, code: string) =>
      request<any>('/api/verify/check-code', { method: 'POST', body: JSON.stringify({ email, code }) }),
  },
};

export { ApiError };
export default api;
