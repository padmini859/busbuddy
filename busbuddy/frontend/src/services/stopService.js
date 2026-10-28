import api from './api';

export const stopService = {
  getAllStops: async () => {
    const res = await api.get('/stops');
    return res.data;
  },

  getPopularStops: async () => {
    const res = await api.get('/stops/popular');
    return res.data;
  },

  searchStops: async (query) => {
    const res = await api.get(`/stops/search?query=${encodeURIComponent(query || '')}`);
    return res.data;
  },

  getStopById: async (id) => {
    const res = await api.get(`/stops/${id}`);
    return res.data;
  },
};
