import api from './api';

export const getAdminDashboard = async () => {
  const response = await api.get('/dashboard/admin');
  return response.data;
};

export const getCalendarEvents = async () => {
  const response = await api.get('/dashboard/calendar');
  return response.data;
};