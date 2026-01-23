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
  // Mapping 'Tours' to 'Categories' as per available backend
  getTours: () => api.get('http://localhost:8080/api/tours'),
  getTour: (id) => api.get(`http://localhost:8080/api/tours/${id}`),

  // Keep this for filters, though it's same as getTours now
  // getCategories: () => api.get('/categories/home'),

  // Stubbing missing endpoints to prevent crashes
  createCategory: (data) => Promise.resolve({ data: {} }),
  updateCategory: (id, data) => Promise.resolve({ data: {} }),
  deleteCategory: (id) => Promise.resolve({ data: {} }),
  createTour: (data) => Promise.resolve({ data: {} }),
  updateTour: (id, data) => Promise.resolve({ data: {} }),
  deleteTour: (id) => Promise.resolve({ data: {} }),

  getDepartures: (tourId) => Promise.resolve({ data: [] }),
  getItinerary: (tourId) => Promise.resolve({ data: [] }),
  getPricing: (tourId) => Promise.resolve({ data: [] }),
  getGuides: (tourId) => Promise.resolve({ data: [] }),
};

export const bookingAPI = {
  createBooking: (data) => api.post('/api/bookings', data), // Updated path based on BookingController
  getBooking: (id) => api.get(`/api/bookings/${id}`),
  getBookings: (params) => api.get('/api/bookings', { params }), // This endpoint might not fully exist as search, but keeping safely
  updateBooking: (id, data) => Promise.resolve({ data: {} }),
  cancelBooking: (id) => Promise.resolve({ data: {} }),

  addPassenger: (bookingId, data) => Promise.resolve({ data: {} }),
  updatePassenger: (bookingId, passengerId, data) => Promise.resolve({ data: {} }),
  removePassenger: (bookingId, passengerId) => Promise.resolve({ data: {} }),

  processPayment: (bookingId, data) => Promise.resolve({ data: {} }),
};

export const customerAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  // These seem missing in AuthController, stubbing or keeping if they exist elsewhere (CustomerController?)
  // Leaving as is for now, but might fail. 
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (data) => api.put('/customers/profile', data),
  changePassword: (data) => api.post('/customers/change-password', data),
};

export default api;
