import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';
import { studentService } from '../services/studentService';
import { departmentService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  CalendarCheck2,
  Calendar,
  Check,
  X as CloseIcon,
  Filter,
  Save,
  Users,
  AlertCircle,
  Loader2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

export const AttendancePage = () => {
  const { handleViewStudentProfile } = useOutletContext();
  const { isAdmin, isTeacher, user } = useAuth();
  const { showToast } = useToast();

  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // { [studentId]: 'PRESENT' | 'ABSENT' | 'LATE' }
  const [remarksMap, setRemarksMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    departmentService.getAllDepartments().then((data) => {
      setDepartments(data || []);
      if (data && data.length > 0) {
        setSelectedDept(data[0].id);
      }
    }).catch(console.error);
  }, []);

  const loadAttendanceRoster = useCallback(async () => {
    if (!selectedDept) return;
    setLoading(true);
    try {
      // 1. Fetch students for the department
      const studentRes = await studentService.getStudents({
        departmentId: selectedDept,
        size: 100,
        sortBy: 'rollNumber',
        sortDir: 'asc'
      });
      const studentList = studentRes.content || [];
      setStudents(studentList);

      // 2. Fetch recorded attendance for this department and date
      const existingRecords = await attendanceService.getDepartmentAttendance(selectedDept, selectedDate).catch(() => []);
      
      const newMap = {};
      const newRemarks = {};
      studentList.forEach(s => {
        newMap[s.id] = 'PRESENT'; // default
      });

      if (Array.isArray(existingRecords)) {
        existingRecords.forEach(r => {
          if (r.studentId) {
            newMap[r.studentId] = r.status;
            if (r.remarks) newRemarks[r.studentId] = r.remarks;
          }
        });
      }

      setAttendanceMap(newMap);
      setRemarksMap(newRemarks);
    } catch (err) {
      console.error("Failed to load attendance roster:", err);
      showToast("Error loading attendance data", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedDept, selectedDate, showToast]);

  useEffect(() => {
    if (selectedDept) {
      loadAttendanceRoster();
    }
  }, [selectedDept, selectedDate, loadAttendanceRoster]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    if (!canEditAttendance) return;
    setSaving(true);
    try {
      const requests = students.map(s => ({
        studentId: s.id,
        attendanceDate: selectedDate,
        status: attendanceMap[s.id] || 'PRESENT',
        remarks: remarksMap[s.id] || ''
      }));

      await attendanceService.markBatchAttendance(requests, user?.teacherId);
      showToast(`Daily attendance saved for ${requests.length} students!`, "success");
      loadAttendanceRoster();
    } catch (err) {
      console.error("Failed to save attendance:", err);
      showToast(err.response?.data?.message || "Failed to submit attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  const canEditAttendance = isAdmin || isTeacher;

  const presentCount = Object.values(attendanceMap).filter(st => st === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter(st => st === 'ABSENT').length;
  const attendanceRate = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Attendance Management</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Daily Ledger
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track daily student presence, calculate percentage, and record classroom compliance.
          </p>
        </div>

        {canEditAttendance && (
          <button
            onClick={handleSaveAttendance}
            disabled={saving || students.length === 0}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Attendance Sheet</span>
          </button>
        )}
      </div>

      {/* Date & Department Filter Ribbon */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Department */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Select Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.departmentName} ({d.departmentCode})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Attendance Date</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Batch Actions */}
        {canEditAttendance && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 mr-1 font-medium">Batch:</span>
            <button
              onClick={() => handleMarkAll('PRESENT')}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold transition-colors"
            >
              All Present
            </button>
            <button
              onClick={() => handleMarkAll('ABSENT')}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-bold transition-colors"
            >
              All Absent
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Class Size</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{students.length} Students</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Present Today</span>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{presentCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Absent Today</span>
          <p className="text-xl font-bold text-rose-700 dark:text-rose-300 mt-1">{absentCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900">
          <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold">Day Attendance</span>
          <p className="text-xl font-bold text-brand-700 dark:text-brand-300 mt-1">{attendanceRate}%</p>
        </div>
      </div>

      {/* Attendance Roster Sheet */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-2" />
            <p className="text-xs font-semibold">Loading class roster...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Cumulative %</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Remarks</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((student) => {
                  const currentStatus = attendanceMap[student.id] || 'PRESENT';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                        {student.rollNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {student.fullName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          student.attendancePercentage < 75
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {student.attendancePercentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {canEditAttendance ? (
                          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'PRESENT')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                currentStatus === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'text-slate-500 hover:text-emerald-600'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'ABSENT')}
                              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                currentStatus === 'ABSENT'
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'text-slate-500 hover:text-rose-600'
                              }`}
                            >
                              <CloseIcon className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </button>
                          </div>
                        ) : (
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {currentStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {canEditAttendance ? (
                          <input
                            type="text"
                            value={remarksMap[student.id] || ''}
                            onChange={(e) => setRemarksMap({ ...remarksMap, [student.id]: e.target.value })}
                            placeholder="Optional remark..."
                            className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                        ) : (
                          <span className="text-xs text-slate-500">{remarksMap[student.id] || '—'}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleViewStudentProfile(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">No students in this department roster.</p>
          </div>
        )}
      </div>
    </div>
  );
};
