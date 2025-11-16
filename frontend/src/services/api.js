import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const publicAPI = {
  searchFlights: (data) => api.post('/public/flights/search', data),
  getFlightById: (id) => api.get(`/public/flights/${id}`),
  getAllAirports: () => api.get('/public/airports'),
  getAllFlights: () => api.get('/public/flights'),
};

export const customerAPI = {
  createBooking: (data) => api.post('/customer/bookings', data),
  getMyBookings: () => api.get('/customer/bookings'),
  downloadTicket: (id) => api.get(`/customer/bookings/${id}/ticket`, { responseType: 'blob' }),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleUserLock: (id) => api.put(`/admin/users/${id}/toggle-lock`),
  
  getAllAirports: () => api.get('/admin/airports'),
  createAirport: (data) => api.post('/admin/airports', data),
  updateAirport: (id, data) => api.put(`/admin/airports/${id}`, data),
  deleteAirport: (id) => api.delete(`/admin/airports/${id}`),
  
  getAllFlights: () => api.get('/admin/flights'),
  createFlight: (data) => api.post('/admin/flights', data),
  updateFlight: (id, data) => api.put(`/admin/flights/${id}`, data),
  deleteFlight: (id) => api.delete(`/admin/flights/${id}`),
  
  getAllBookings: () => api.get('/admin/bookings'),
  deleteBooking: (id) => api.delete(`/admin/bookings/${id}`),
};

export default api;
