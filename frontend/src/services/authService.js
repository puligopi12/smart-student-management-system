import api from './api';

export const authService = {
  async login(username, password) {
    const res = await api.post('/auth/login', { username, password });
    if (res.data && res.data.success) {
      const { token, ...userInfo } = res.data.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      return res.data.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  },

  async register(userData) {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  },

  getSavedUser() {
    const raw = localStorage.getItem('user_info');
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
};
