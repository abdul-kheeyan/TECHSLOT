import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL.endsWith('/api')
    ? BASE_URL
    : `${BASE_URL.replace(/\/$/, '')}/api`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('techslot_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('techslot_token');
      localStorage.removeItem('techslot_user');

      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ===== AUTH =====
export const loginUser = (credentials) =>
  api.post('/auth/login', credentials);

export const getMe = () =>
  api.get('/auth/me');

// ===== PROJECTS =====
export const getProjects = (params) =>
  api.get('/projects', { params });

export const getProjectById = (id) =>
  api.get(`/projects/${id}`);

export const createProject = (data) =>
  api.post('/projects', data);

export const updateProject = (id, data) =>
  api.put(`/projects/${id}`, data);

export const deleteProject = (id) =>
  api.delete(`/projects/${id}`);

// ===== SERVICES =====
export const getServices = () =>
  api.get('/services');

export const createService = (data) =>
  api.post('/services', data);

export const updateService = (id, data) =>
  api.put(`/services/${id}`, data);

export const deleteService = (id) =>
  api.delete(`/services/${id}`);

// ===== TESTIMONIALS =====
export const getTestimonials = () =>
  api.get('/testimonials');

export const createTestimonial = (data) =>
  api.post('/testimonials', data);

export const updateTestimonial = (id, data) =>
  api.put(`/testimonials/${id}`, data);

export const deleteTestimonial = (id) =>
  api.delete(`/testimonials/${id}`);

// ===== CONTACT =====
export const submitContact = (data) =>
  api.post('/contact', data);

export const getContacts = (params) =>
  api.get('/contact', { params });

export const updateContactStatus = (id, status) =>
  api.put(`/contact/${id}`, { status });

export const deleteContact = (id) =>
  api.delete(`/contact/${id}`);

export default api;