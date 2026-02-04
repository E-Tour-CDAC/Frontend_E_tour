import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
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
      sessionStorage.removeItem('token');
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
};

export const bookingAPI = {

  getTourId: (categoryId, departureId) => api.get(`http://localhost:8080/api/tours/tour-id?categoryId=${categoryId}&departureId=${departureId}`),
  createBooking: (data) => api.post('http://localhost:8080/api/Booking', data),
  getBooking: (id) => api.get(`http://localhost:8080/api/bookings/${id}`),
  getBookings: () => api.get('http://localhost:8080/api/bookings/'),
  getBookingsByCustomer: (customerId) => api.get(`http://localhost:8080/api/bookings/customer/${customerId}`),


  getInvoice: (bookingId) => api.get(`/api/bookings/invoice/${bookingId}`),
  addPassenger: (data) => api.post('/api/passengers/add', data),


  createOrder: (data) => api.post('http://localhost:8080/payment-gateway/create-order', data),
  verifyPayment: (params) => api.post('http://localhost:8080/payment-gateway/confirm-payment', null, { params }),
  savePayment: (params) => api.post('http ://localhost:8080/api/payment/pay', null, { params }),
  getPaymentStatus: (bookingId) => api.get(`http://localhost:8080/api/bookings/status/${bookingId}`),
  getPassengersByBooking: (bookingId) => api.get(`http://localhost:8080/api/passengers/booking/${bookingId}`),
  downloadInvoice: (bookingId) => api.get(`http://localhost:8080/api/invoices/${bookingId}/download`, { responseType: 'blob' }),
  sendInvoiceEmail: (paymentId) => api.post(`http://localhost:8080/api/email/invoice?paymentId=${paymentId}`),
};

export const customerAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getProfile: () => api.get('/api/customer/profile'),
  getProfileId: () => api.get('/api/customer/id'),
  updateProfile: (data) => api.put('/api/customer/profile', data),
  changePassword: (data) => api.post('/api/customer/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const searchAPI = {
  searchByDuration: (minDays, maxDays) =>
    api.get('/search/by-duration', {
      params: { minDays, maxDays },
    }),

  searchByCost: (minCost, maxCost) =>
    api.get('/search/by-cost', {
      params: { minCost, maxCost },
    }),

  searchByLocation: (keyword) =>
    api.get('/search/by-location', {
      params: { keyword },
    }),

  searchByDate: (fromDate, toDate) =>
    api.get('/search/by-date', {
      params: { fromDate, toDate },
    }),
};

export const healthAPI = {
  getHealth: () => api.get('/actuator/health'),
};

export default api;
