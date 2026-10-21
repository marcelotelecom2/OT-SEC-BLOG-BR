import type { Article, RadarPublication } from '../types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const payload = await response.json().catch(() => ({})) as { error?: string } & T;
  if (!response.ok) throw new Error(payload.error || `Falha no painel (${response.status}).`);
  return payload;
}

export const adminApi = {
  radar: () => request<{ entries: RadarPublication[] }>('/api/admin/radar'),
  saveRadar: (entry: RadarPublication) => request<{ entry: RadarPublication; commit: string }>('/api/admin/radar', {
    method: 'PUT', body: JSON.stringify({ entry }),
  }),
  unpublishRadar: (id: string) => request<{ commit: string }>('/api/admin/radar', {
    method: 'DELETE', body: JSON.stringify({ id }),
  }),
  session: () => request<{ authenticated: boolean }>('/api/admin/session'),
  login: (password: string) => request<{ authenticated: true }>('/api/admin/login', {
    method: 'POST', body: JSON.stringify({ password }),
  }),
  logout: () => request<{ authenticated: false }>('/api/admin/logout', { method: 'POST' }),
  saveArticle: (article: Article) => request<{ commit: string; message: string }>('/api/admin/articles', {
    method: 'PUT', body: JSON.stringify({ article }),
  }),
  deleteArticle: (id: string) => request<{ commit: string; message: string }>('/api/admin/articles', {
    method: 'DELETE', body: JSON.stringify({ id }),
  }),
};
