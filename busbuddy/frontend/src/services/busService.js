import api from './api';

export const busService = {
  getAllBuses: async () => {
    const res = await api.get('/buses');
    return res.data;
  },

  searchBuses: async (number) => {
    const res = await api.get(`/buses/search?number=${encodeURIComponent(number || '')}`);
    return res.data;
  },

  getBusById: async (id) => {
    const res = await api.get(`/buses/${id}`);
    return res.data;
  },
};
