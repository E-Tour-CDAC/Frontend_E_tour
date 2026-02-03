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
  getTours: () => api.get('https://localhost:7213/api/tours'),
  getTour: (id) => api.get(`https://localhost:7213/api/tours/${id}`),
  getTourDetails: (catId) => api.get(`https://localhost:7213/api/tours/details/${catId}`),


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


  getInvoice: (bookingId) => api.get(`http://localhost:8080/api/bookings/invoice/${bookingId}`),
  addPassenger: (data) => api.post('http://localhost:8080/api/passengers/add', data),


  createOrder: (data) => api.post('http://localhost:8080/payment-gateway/create-order', data),
  verifyPayment: (params) => api.post('http://localhost:8080/payment-gateway/confirm-payment', null, { params }),
  getPaymentStatus: (bookingId) => api.get(`http://localhost:8080/api/bookings/status/${bookingId}`),
  getPassengersByBooking: (bookingId) => api.get(`http://localhost:8080/api/passengers/booking/${bookingId}`),
  downloadInvoice: (bookingId) => api.get(`http://localhost:8080/api/invoices/${bookingId}/download`, { responseType: 'blob' }),
  sendInvoiceEmail: (paymentId) => api.post(`http://localhost:8080/api/email/invoice?paymentId=${paymentId}`),
};

export const customerAPI = {
  register: (data) => api.post('https://localhost:7213/api/auth/register', data),
  login: (credentials) => api.post('https://localhost:7213/api/auth/login', credentials),
  getProfile: () => api.get('http://localhost:8080/api/customer/profile'),
  getProfileId: () => api.get('http://localhost:8080/api/customer/id'),
  updateProfile: (data) => api.put('http://localhost:8080/api/customer/profile', data),
  changePassword: (data) => api.post('http://localhost:8080/api/customer/change-password', data),
  forgotPassword: (email) => api.post('http://localhost:8080/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('http://localhost:8080/auth/reset-password', data),
};

export const searchAPI = {
  searchByDuration: (minDays, maxDays) =>
    api.get('http://localhost:8080/search/by-duration', {
      params: { minDays, maxDays },
    }),

  searchByCost: (minCost, maxCost) =>
    api.get('http://localhost:8080/search/by-cost', {
      params: { minCost, maxCost },
    }),

  searchByLocation: (keyword) =>
    api.get('http://localhost:8080/search/by-location', {
      params: { keyword },
    }),

  searchByDate: (fromDate, toDate) =>
    api.get('http://localhost:8080/search/by-date', {
      params: { fromDate, toDate },
    }),
};

export const healthAPI = {
  getHealth: () => api.get('http://localhost:8080/actuator/health'),
};

export default api;
