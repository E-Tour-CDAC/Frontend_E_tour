import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  getTourDetails: (catId) => api.get(`http://localhost:8080/api/tours/details/${catId}`),
  

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
  
  getTourId: (categoryId, departureId) => api.get(`http://localhost:8080/api/tours/tour-id?categoryId=${categoryId}&departureId=${departureId}`),
  createBooking: (data) => api.post('http://localhost:8080/api/bookings', data),
  getBooking: (id) => api.get(`http://localhost:8080/api/bookings/${id}`),
  getBookings: () => api.get('http://localhost:8080/api/bookings/'),
  getBookingsByCustomer: (customerId) => api.get(`http://localhost:8080/api/bookings/customer/${customerId}`),
  updateBooking: (id, data) => Promise.resolve({ data: {} }),
  cancelBooking: (id) => Promise.resolve({ data: {} }),

  addPassenger: (bookingId, data) => Promise.resolve({ data: {} }),
  updatePassenger: (bookingId, passengerId, data) => Promise.resolve({ data: {} }),
  removePassenger: (bookingId, passengerId) => Promise.resolve({ data: {} }),

  processPayment: (bookingId, data) => Promise.resolve({ data: {} }),
  createOrder: (data) => api.post('http://localhost:8080/payment-gateway/create-order', data),
  verifyPayment: (params) => api.post('http://localhost:8080/payment-gateway/confirm-payment', null, { params }),
  getPaymentStatus: (bookingId) => api.get(`http://localhost:8080/api/bookings/status/${bookingId}`),
};

export const customerAPI = {
  register: (data) => api.post('http://localhost:8080/auth/register', data),
  login: (credentials) => api.post('http://localhost:8080/auth/login', credentials),
  getProfile: () => api.get('http://localhost:8080/api/customer/id'),
  updateProfile: (data) => api.put('http://localhost:8080/api/customer/profile', data),
  changePassword: (data) => api.post('/api/customer/change-password', data),
};

export const searchAPI = {
  searchByDuration: (minDays, maxDays) => api.get(`/api/search/duration`, { params: { minDays, maxDays } }),
  searchByCost: (minCost, maxCost) => api.get(`/api/search/cost`, { params: { minCost, maxCost } }),
  searchByDate: (fromDate, toDate) => api.get(`/api/search/date`, { params: { fromDate, toDate } }),
};

export default api;
