import api from './api';

export const feedbackService = {
  submitFeedback: async (feedbackData) => {
    const res = await api.post('/feedback', feedbackData);
    return res.data;
  },
};
