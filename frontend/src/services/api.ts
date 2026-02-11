import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

export const doctorAPI = {
  getMyProfile: () => api.get('/doctors/my-profile'),
  getAll: () => api.get('/doctors'),
  getById: (id: string) => api.get(`/doctors/${id}`),
  create: (data: any) => api.post('/doctors', data),
  update: (id: string, data: any) => api.put(`/doctors/${id}`, data),
  delete: (id: string) => api.delete(`/doctors/${id}`)
};

export const patientAPI = {
  getMyProfile: () => api.get('/patients/my-profile'),
  getAll: () => api.get('/patients'),
  getById: (id: string) => api.get(`/patients/${id}`),
  update: (id: string, data: any) => api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`)
};

export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id: string) => api.get(`/appointments/${id}`),
  create: (data: any) => api.post('/appointments', data),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`)
};

export const recordAPI = {
  getAll: () => api.get('/records'),
  getById: (id: string) => api.get(`/records/${id}`),
  create: (data: any) => api.post('/records', data),
  update: (id: string, data: any) => api.put(`/records/${id}`, data),
  delete: (id: string) => api.delete(`/records/${id}`)
};

export const billingAPI = {
  getAll: () => api.get('/billing'),
  getById: (id: string) => api.get(`/billing/${id}`),
  create: (data: any) => api.post('/billing', data),
  update: (id: string, data: any) => api.put(`/billing/${id}`, data),
  delete: (id: string) => api.delete(`/billing/${id}`)
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: (id: string) => api.get(`/departments/${id}`),
  create: (data: any) => api.post('/departments', data),
  update: (id: string, data: any) => api.put(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`)
};

export const prescriptionAPI = {
  getAll: () => api.get('/prescriptions'),
  getById: (id: string) => api.get(`/prescriptions/${id}`),
  create: (data: any) => api.post('/prescriptions', data),
  update: (id: string, data: any) => api.put(`/prescriptions/${id}`, data),
  delete: (id: string) => api.delete(`/prescriptions/${id}`)
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  getById: (id: string) => api.get(`/inventory/${id}`),
  create: (data: any) => api.post('/inventory', data),
  update: (id: string, data: any) => api.put(`/inventory/${id}`, data),
  delete: (id: string) => api.delete(`/inventory/${id}`)
};

export const queueAPI = {
  getAll: () => api.get('/queue'),
  getActive: () => api.get('/queue/active'),
  getById: (id: string) => api.get(`/queue/${id}`),
  create: (data: any) => api.post('/queue', data),
  callNext: (doctorId: string) => api.post('/queue/call-next', { doctorId }),
  complete: (id: string) => api.put(`/queue/${id}/complete`),
  update: (id: string, data: any) => api.put(`/queue/${id}`, data),
  delete: (id: string) => api.delete(`/queue/${id}`)
};

export default api;
