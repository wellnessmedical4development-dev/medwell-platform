import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  registerLegacy: (data) => api.post('/auth/register/legacy', data),
  login: (data) => api.post('/auth/login', data),
  loginRequest: (data) => api.post('/auth/login-request', data),
  loginOtp: (data) => api.post('/auth/login-otp', data),
  checkPhone: (phone) => api.get(`/auth/check-phone/${encodeURIComponent(phone)}`),
  profile: () => api.get('/auth/profile'),
  refresh: () => api.post('/auth/refresh'),
  sendOtp: (phone, purpose = 'registration') => api.post('/auth/otp/send', { phone, purpose }),
  verifyOtp: (phone, code, purpose = 'registration') => api.post('/auth/otp/verify', { phone, code, purpose }),
  forgotPassword: (phone) => api.post('/auth/forgot-password', { phone }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const servicesAPI = {
  list: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
};

export const subscriptionsAPI = {
  list: () => api.get('/subscriptions'),
  create: (data) => api.post('/subscriptions', data),
  cancel: (id, reason) => api.post(`/subscriptions/${id}/cancel`, { cancel_reason: reason }),
  renew: (id) => api.post(`/subscriptions/${id}/renew`),
  financialOverview: () => api.get('/subscriptions/financial-overview'),
};

export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  clients: (params) => api.get('/admin/clients', { params }),
  clientDetail: (id) => api.get(`/admin/clients/${id}`),
  adjustCoins: (id, data) => api.post(`/admin/clients/${id}/wellness-coins`, data),
  updateUser: (id, data) => api.patch(`/admin/clients/${id}`, data),
  searchUsers: (params) => api.get('/admin/users/search', { params }),
  importLegacy: (formData) => api.post('/admin/legacy/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  previewLegacy: (formData) => api.post('/admin/legacy/preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  legacyStats: () => api.get('/admin/legacy/stats'),
  legacyUnlinked: () => api.get('/admin/legacy/unlinked'),
  appointments: (params) => api.get('/admin/appointments', { params }),
};

export const whatsappAPI = {
  link: (serviceId) => api.get(`/whatsapp/link/${serviceId || ''}`),
  inquiry: (data) => api.post('/whatsapp/inquiry', data),
};

export const wellnessCoinAPI = {
  myBalance: () => api.get('/wellness-coins/my-balance'),
  leaderboard: () => api.get('/wellness-coins/leaderboard'),
  searchRecipients: (q) => api.get('/wellness-coins/transfer/search', { params: { q } }),
  sendTransfer: (data) => api.post('/wellness-coins/transfer/send', data),
  transferHistory: () => api.get('/wellness-coins/transfer/history'),
};

export const leadsAPI = {
  preorder: (data) => api.post('/leads', data),
};

export const prospectsAPI = {
  stats: () => api.get('/prospects/stats'),
  list: (params) => api.get('/prospects', { params }),
  updateStatus: (id, data) => api.patch(`/prospects/${id}/status`, data),
};

export const paymentsAPI = {
  initiate: (data) => api.post('/payments/initiate', data),
  list: (params) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
};

export const appointmentsAPI = {
  my: () => api.get('/appointments/my'),
  book: (data) => api.post('/appointments', data),
  cancel: (id) => api.post(`/appointments/${id}/cancel`),
  slots: (params) => api.get('/appointments/slots', { params }),
};

export const referralAPI = {
  myInfo: () => api.get('/referrals/my-info'),
  claim: (referralCode) => api.post('/referrals/claim', { referral_code: referralCode }),
};

export const quickRequestsAPI = {
  create: (data) => api.post('/quick-requests', data),
  my: () => api.get('/quick-requests/my'),
  list: (params) => api.get('/quick-requests', { params }),
  updateStatus: (id, data) => api.patch(`/quick-requests/${id}/status`, data),
};

export const messagesAPI = {
  my: () => api.get('/messages'),
  unreadCount: () => api.get('/messages/unread-count'),
  markRead: (id) => api.patch(`/messages/${id}/read`),
};

export const adminMessagesAPI = {
  broadcast: (data) => api.post('/admin/messages/broadcast', data),
  sent: () => api.get('/admin/messages'),
};
