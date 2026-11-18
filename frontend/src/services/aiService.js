import api from './api';

export const aiService = {
  async searchWithNaturalLanguage(query) {
    const res = await api.post('/ai/student-search', { query });
    return res.data.data;
  }
};

export const departmentService = {
  async getAllDepartments() {
    const res = await api.get('/departments');
    return res.data.data;
  },

  async getAllCourses() {
    const res = await api.get('/departments/courses');
    return res.data.data;
  },

  async getCoursesByDepartment(departmentId) {
    const res = await api.get(`/departments/${departmentId}/courses`);
    return res.data.data;
  }
};
