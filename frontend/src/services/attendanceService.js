import api from './api';

export const attendanceService = {
  async markAttendance(data, teacherId) {
    const res = await api.post('/attendance', data, {
      params: teacherId ? { teacherId } : {}
    });
    return res.data.data;
  },

  async markBatchAttendance(requests, teacherId) {
    const res = await api.post('/attendance/batch', requests, {
      params: teacherId ? { teacherId } : {}
    });
    return res.data.data;
  },

  async getStudentAttendance(studentId) {
    const res = await api.get(`/attendance/student/${studentId}`);
    return res.data.data;
  },

  async getDepartmentAttendance(departmentId, date) {
    const res = await api.get('/attendance/department', {
      params: { departmentId, date }
    });
    return res.data.data;
  }
};
