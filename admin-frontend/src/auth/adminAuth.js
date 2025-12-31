import adminApi from '../api/adminApi';

export const adminAuth = {
  login: async (email, password) => {
    const response = await adminApi.post('/auth/login', { email, password });
    const { token } = response.data;
    
    // Verify token contains ADMIN role
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'ADMIN') {
      throw new Error('Access denied. Admin role required.');
    }
    
    localStorage.setItem('adminToken', token);
    return token;
  },

  register: async (username, email, password, adminSecret) => {
    const response = await adminApi.post('/auth/register-admin', {
      username,
      email,
      password,
      adminSecret,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
  },

  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check if token is expired
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('adminToken');
        return false;
      }
      // Check if user is admin
      return payload.role === 'ADMIN';
    } catch (error) {
      localStorage.removeItem('adminToken');
      return false;
    }
  },

  getUser: () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      return null;
    }
  },
};

