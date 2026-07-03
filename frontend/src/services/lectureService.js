import api from './api';

export const getLectures = async (params = {}) => {
  const response = await api.get('/lectures', { params });
  return response.data;
};

export const getLecture = async (id) => {
  const response = await api.get(`/lectures/${id}`);
  return response.data;
};

export const createLecture = async (data) => {
  const response = await api.post('/lectures', data);
  return response.data;
};

export const updateLecture = async (id, data) => {
  const response = await api.put(`/lectures/${id}`, data);
  return response.data;
};

export const cancelLecture = async (id) => {
  const response = await api.put(`/lectures/${id}/cancel`);
  return response.data;
};

export const deleteLecture = async (id) => {
  const response = await api.delete(`/lectures/${id}`);
  return response.data;
};