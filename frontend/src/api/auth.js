import api from './axios';

export const authAPI = {
  register: async (username, email, password, role = 'USER') => {
    const response = await api.post('/auth/register', { username, email, password, role });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

