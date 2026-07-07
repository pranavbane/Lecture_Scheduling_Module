import api from './api';

export const getInstructors = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.availability) queryParams.append('availability', params.availability);
    if (params.department) queryParams.append('department', params.department);
    
    const queryString = queryParams.toString();
    const url = `/instructors${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};

export const getInstructor = async (id) => {
  try {
    const response = await api.get(`/instructors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor:', error);
    throw error;
  }
};

export const createInstructor = async (data) => {
  try {
    const response = await api.post('/instructors', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating instructor:', error);
    throw error;
  }
};

export const updateInstructor = async (id, data) => {
  try {
    const response = await api.put(`/instructors/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating instructor:', error);
    throw error;
  }
};

export const deleteInstructor = async (id) => {
  try {
    const response = await api.delete(`/instructors/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting instructor:', error);
    throw error;
  }
};


export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/dashboard/admin');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    throw error;
  }
};

// Get calendar events
export const getCalendarEvents = async () => {
  try {
    const response = await api.get('/dashboard/calendar');
    return response.data;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

// Default export for convenience
const dashboardService = {
  getAdminDashboard,
  getCalendarEvents,
};


export const getInstructorDashboard = async (id) => {
  try {
    const response = await api.get(`/instructors/dashboard/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error);
    // Return a fallback response
    return {
      success: true,
      data: {
        totalLectures: 0,
        todayLectures: 0,
        upcomingLectures: 0,
        pastLectures: 0,
        todayLecturesList: [],
        upcomingLecturesList: [],
        pastLecturesList: [],
      }
    };
  }
};