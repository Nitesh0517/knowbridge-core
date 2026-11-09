/**
 * Axios API Client for KnowBridge AI
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// Request interceptor: attach auth token and custom settings
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('knowbridge_token') || 'demo-token';
  config.headers.Authorization = `Bearer ${token}`;

  const customGeminiKey = localStorage.getItem('knowbridge_gemini_key');
  if (customGeminiKey) {
    config.headers['x-gemini-api-key'] = customGeminiKey;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (id, member) => api.post(`/projects/${id}/members`, member),
};

export const sourcesApi = {
  getAll: (projectId) => api.get('/sources', { params: { projectId } }),
  getById: (id) => api.get(`/sources/${id}`),
  uploadDocument: (formData) => api.post('/sources/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  createMeeting: (data) => api.post('/sources/meeting', data),
  createDecision: (data) => api.post('/sources/decision', data),
  connectGitHub: (data) => api.post('/sources/github', data),
  delete: (id) => api.delete(`/sources/${id}`),
};

export const reconstructionApi = {
  trigger: (data) => api.post('/reconstruction/trigger', data),
  getLatest: (projectId) => api.get(`/reconstruction/project/${projectId}`),
};

export const evidenceApi = {
  getClaims: (params) => api.get('/evidence', { params }),
  getById: (id) => api.get(`/evidence/${id}`),
  verify: (id, status, notes) => api.put(`/evidence/${id}/verify`, { status, notes }),
};

export const handoversApi = {
  getAll: (projectId) => api.get('/handovers', { params: { projectId } }),
  getById: (id) => api.get(`/handovers/${id}`),
  getPublic: (shareToken) => api.get(`/handovers/public/${shareToken}`),
  generate: (data) => api.post('/handovers/generate', data),
  update: (id, data) => api.put(`/handovers/${id}`, data),
  updateStatus: (id, status, comment) => api.put(`/handovers/${id}/status`, { status, comment }),
};

export const analyticsApi = {
  getStats: () => api.get('/analytics/stats'),
};

export const authApi = {
  syncUser: (userData) => api.post('/auth/sync-user', userData),
};

export default api;
