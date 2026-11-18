import api from './api';

export const dashboardService = {
  async getStatistics() {
    const res = await api.get('/dashboard/statistics');
    return res.data.data;
  }
};
