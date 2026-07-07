import api from './api';

// Get current user profile
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Update user profile
export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Update user profile (without file upload)
export const updateUserProfile = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

// Change password
export const changePassword = async (data) => {
  const response = await api.put('/auth/change-password', data);
  return response.data;
};

// Get user by ID (admin only)
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Get all users (admin only)
export const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

// Delete user (admin only)
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Update user role (admin only)
export const updateUserRole = async (id, role) => {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data;
};

// Toggle user active status (admin only)
export const toggleUserStatus = async (id) => {
  const response = await api.put(`/users/${id}/toggle-status`);
  return response.data;
};