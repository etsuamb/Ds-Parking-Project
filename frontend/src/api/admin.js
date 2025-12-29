import api from './axios';

export const adminAPI = {
  // Get all bookings (admin only)
  getAllBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  // Cancel any booking (admin only)
  cancelBooking: async (bookingId) => {
    const response = await api.delete(`/admin/bookings/${bookingId}`);
    return response.data;
  },

  // Get all parking lots with detailed stats (admin only)
  getAllParkingLots: async () => {
    const response = await api.get('/admin/lots');
    return response.data;
  },
};

