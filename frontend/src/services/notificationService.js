import api from './api';

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    // Return empty data instead of throwing error
    if (error.response?.status === 404) {
      return { data: [], unreadCount: 0 };
    }
    throw error;
  }
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};