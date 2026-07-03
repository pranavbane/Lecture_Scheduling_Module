import api from './api';

export const getInstructors = async (params = {}) => {
  const response = await api.get('/instructors', { params });
  return response.data;
};

export const getInstructor = async (id) => {
  const response = await api.get(`/instructors/${id}`);
  return response.data;
};

export const createInstructor = async (data) => {
  const response = await api.post('/instructors', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateInstructor = async (id, data) => {
  const response = await api.put(`/instructors/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteInstructor = async (id) => {
  const response = await api.delete(`/instructors/${id}`);
  return response.data;
};

export const getInstructorDashboard = async (id) => {
  const response = await api.get(`/instructors/dashboard/${id}`);
  return response.data;
};