import api from './api';

export const marksService = {
  async addOrUpdateMarks(data) {
    const res = await api.post('/marks', data);
    return res.data.data;
  },

  async getStudentMarks(studentId, semester) {
    const res = await api.get(`/marks/student/${studentId}`, {
      params: semester ? { semester } : {}
    });
    return res.data.data;
  },

  async getTopPerformers() {
    const res = await api.get('/marks/top-performers');
    return res.data.data;
  }
};
