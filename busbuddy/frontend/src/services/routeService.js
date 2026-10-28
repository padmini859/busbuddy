import api from './api';

export const routeService = {
  searchRoutes: async (sourceId, destinationId) => {
    const res = await api.get(`/routes/search?sourceId=${sourceId}&destinationId=${destinationId}`);
    return res.data;
  },

  getAllRoutes: async () => {
    const res = await api.get('/routes');
    return res.data;
  },

  getRouteById: async (id) => {
    const res = await api.get(`/routes/${id}`);
    return res.data;
  },

  getRouteStops: async (id) => {
    const res = await api.get(`/routes/${id}/stops`);
    return res.data;
  },

  getRouteSchedules: async (id) => {
    const res = await api.get(`/routes/${id}/schedules`);
    return res.data;
  },
};
