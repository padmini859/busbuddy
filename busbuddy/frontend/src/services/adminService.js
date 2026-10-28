import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  // Stops
  createStop: async (data) => {
    const res = await api.post('/admin/stops', data);
    return res.data;
  },
  updateStop: async (id, data) => {
    const res = await api.put(`/admin/stops/${id}`, data);
    return res.data;
  },
  deleteStop: async (id) => {
    const res = await api.delete(`/admin/stops/${id}`);
    return res.data;
  },

  // Routes
  createRoute: async (data) => {
    const res = await api.post('/admin/routes', data);
    return res.data;
  },
  updateRoute: async (id, data) => {
    const res = await api.put(`/admin/routes/${id}`, data);
    return res.data;
  },
  deleteRoute: async (id) => {
    const res = await api.delete(`/admin/routes/${id}`);
    return res.data;
  },

  // Buses
  createBus: async (data) => {
    const res = await api.post('/admin/buses', data);
    return res.data;
  },
  updateBus: async (id, data) => {
    const res = await api.put(`/admin/buses/${id}`, data);
    return res.data;
  },
  deleteBus: async (id) => {
    const res = await api.delete(`/admin/buses/${id}`);
    return res.data;
  },

  // Schedules
  getAllSchedules: async () => {
    const res = await api.get('/admin/schedules');
    return res.data;
  },
  createSchedule: async (data) => {
    const res = await api.post('/admin/schedules', data);
    return res.data;
  },
  updateSchedule: async (id, data) => {
    const res = await api.put(`/admin/schedules/${id}`, data);
    return res.data;
  },
  deleteSchedule: async (id) => {
    const res = await api.delete(`/admin/schedules/${id}`);
    return res.data;
  },

  // Fares
  getAllFares: async () => {
    const res = await api.get('/admin/fares');
    return res.data;
  },
  createFare: async (data) => {
    const res = await api.post('/admin/fares', data);
    return res.data;
  },
  updateFare: async (id, data) => {
    const res = await api.put(`/admin/fares/${id}`, data);
    return res.data;
  },
  deleteFare: async (id) => {
    const res = await api.delete(`/admin/fares/${id}`);
    return res.data;
  },

  // Feedback
  getAllFeedback: async (status) => {
    const url = status ? `/admin/feedback?status=${status}` : '/admin/feedback';
    const res = await api.get(url);
    return res.data;
  },
  updateFeedbackStatus: async (id, status) => {
    const res = await api.put(`/admin/feedback/${id}/status?status=${status}`);
    return res.data;
  },
  deleteFeedback: async (id) => {
    const res = await api.delete(`/admin/feedback/${id}`);
    return res.data;
  },
};
