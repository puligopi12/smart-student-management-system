import api from './api';

export const studentService = {
  async getStudents(params = {}) {
    const res = await api.get('/students', { params });
    return res.data.data;
  },

  async getStudentById(id) {
    const res = await api.get(`/students/${id}`);
    return res.data.data;
  },

  async getStudentByRollNumber(rollNumber) {
    const res = await api.get(`/students/roll-number/${encodeURIComponent(rollNumber)}`);
    return res.data.data;
  },

  async searchStudents(params = {}) {
    const res = await api.get('/students/search', { params });
    return res.data.data;
  },

  async createStudent(studentData) {
    const res = await api.post('/students', studentData);
    return res.data.data;
  },

  async updateStudent(id, studentData) {
    const res = await api.put(`/students/${id}`, studentData);
    return res.data.data;
  },

  async deleteStudent(id) {
    const res = await api.delete(`/students/${id}`);
    return res.data;
  }
};
