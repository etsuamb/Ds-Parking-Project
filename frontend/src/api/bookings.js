import api from './axios';

export const bookingsAPI = {
  createBooking: async (lotId, spotId) => {
    const response = await api.post('/bookings', { lotId, spotId });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/me');
    return response.data;
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

