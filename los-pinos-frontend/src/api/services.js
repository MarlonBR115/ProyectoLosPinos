import apiClient from './index';

export const getMenuItems = () => {
  return apiClient.get('/menu-items');
};

export const createReservation = (reservationData) => {
  return apiClient.post('/reservations', reservationData);
};

export const getAdminReservations = () => {
  return apiClient.get('/admin/reservations');
};

export const updateReservation = (id, data) => {
  return apiClient.put(`/admin/reservations/${id}`, data);
};

export const deleteReservation = (id) => {
  return apiClient.delete(`/admin/reservations/${id}`);
};

export const confirmReservation = (id) => {
  return apiClient.patch(`/admin/reservations/${id}/confirm`);
};

export const getAdminMenuItems = () => {
  return apiClient.get('/admin/menu-items');
};

export const createMenuItem = (data) => {
  return apiClient.post('/admin/menu-items', data);
};

export const updateMenuItem = (id, formData) => {
  return apiClient.post(`/admin/menu-items/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteMenuItem = (id) => {
  return apiClient.delete(`/admin/menu-items/${id}`);
};

export const getAllTables = () => {
  return apiClient.get('/tables');
};

export const bulkUpdateTables = (tablesData) => api.post('/admin/tables/bulk-update', tablesData);

export const createTable = (tableData) => api.post('/admin/tables', tableData);

export const updateTable = (id, tableData) => api.put(`/admin/tables/${id}`, tableData);

export const deleteTable = (id) => api.delete(`/admin/tables/${id}`);

export const getActiveSuggestions = () => {
  return apiClient.get('/suggestions/active');
};

export const getAdminSuggestions = () => {
  return apiClient.get('/admin/suggestions');
};

export const createSuggestion = (suggestionData) => {
  return apiClient.post('/admin/suggestions', suggestionData);
};

export const updateSuggestion = (id, suggestionData) => {
  return apiClient.put(`/admin/suggestions/${id}`, suggestionData);
};

export const deleteSuggestion = (id) => {
  return apiClient.delete(`/admin/suggestions/${id}`);
};

// --- NUEVAS FUNCIONES PARA TESTIMONIOS Y CONTACTO ---

export const getPublicTestimonials = () => {
  return apiClient.get('/testimonials');
};

export const createTestimonial = (testimonialData) => {
  return apiClient.post('/testimonials', testimonialData);
};

export const sendContactMessage = (messageData) => {
  return apiClient.post('/contact', messageData);
};

// Admin
export const getAdminTestimonials = () => {
  return apiClient.get('/admin/testimonials');
};

export const updateTestimonial = (id, testimonialData) => {
  return apiClient.put(`/admin/testimonials/${id}`, testimonialData);
};

export const deleteTestimonial = (id) => {
  return apiClient.delete(`/admin/testimonials/${id}`);
};

export const changePassword = (passwordData) => {
  return apiClient.post('/auth/change-password', passwordData);
};

export const getAdminUsers = () => {
  return apiClient.get('/admin/users');
};

export const createUser = (userData) => {
  return apiClient.post('/admin/users', userData);
};

export const updateUser = (id, userData) => {
  return apiClient.put(`/admin/users/${id}`, userData);
};

export const deleteUser = (id) => {
  return apiClient.delete(`/admin/users/${id}`);
};