import api from './axios';

export const parkingAPI = {
  getLots: async () => {
    const response = await api.get('/parking/lots');
    return response.data;
  },

  getLotDetails: async (lotId) => {
    const response = await api.get(`/parking/lots/${lotId}`);
    return response.data;
  },
};

