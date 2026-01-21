import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const tourAPI = {
  getCategories: () => api.get('/categories'),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  getTours: (params) => api.get('/tours', { params }),
  getTour: (id) => api.get(`/tours/${id}`),
  createTour: (data) => api.post('/tours', data),
  updateTour: (id, data) => api.put(`/tours/${id}`, data),
  deleteTour: (id) => api.delete(`/tours/${id}`),

  getDepartures: (tourId) => api.get(`/tours/${tourId}/departures`),
  getItinerary: (tourId) => api.get(`/tours/${tourId}/itinerary`),
  getPricing: (tourId) => api.get(`/tours/${tourId}/pricing`),
  getGuides: (tourId) => api.get(`/tours/${tourId}/guides`),
};

export const bookingAPI = {
  createBooking: (data) => api.post('/bookings', data),
  getBooking: (id) => api.get(`/bookings/${id}`),
  getBookings: (params) => api.get('/bookings', { params }),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`),

  addPassenger: (bookingId, data) => api.post(`/bookings/${bookingId}/passengers`, data),
  updatePassenger: (bookingId, passengerId, data) => api.put(`/bookings/${bookingId}/passengers/${passengerId}`, data),
  removePassenger: (bookingId, passengerId) => api.delete(`/bookings/${bookingId}/passengers/${passengerId}`),

  processPayment: (bookingId, data) => api.post(`/bookings/${bookingId}/payment`, data),
};

export const customerAPI = {
  register: (data) => api.post('/customers/register', data),
  login: (credentials) => api.post('/customers/login', credentials),
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (data) => api.put('/customers/profile', data),
  changePassword: (data) => api.post('/customers/change-password', data),
};

export default api;
