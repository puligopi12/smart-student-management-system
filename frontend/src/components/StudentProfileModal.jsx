import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import { marksService } from '../services/marksService';
import {
  X,
  User,
  CalendarCheck2,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  BookOpen,
  Award,
  Clock,
  Loader2
} from 'lucide-react';

export const StudentProfileModal = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'attendance' | 'marks'
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [marksResult, setMarksResult] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    if (student && isOpen) {
      setActiveTab('overview');
      loadStudentMetrics(student.id);
    }
  }, [student, isOpen]);

  const loadStudentMetrics = async (id) => {
    setLoadingMetrics(true);
    try {
      const [att, marks] = await Promise.all([
        attendanceService.getStudentAttendance(id).catch(() => null),
        marksService.getStudentMarks(id).catch(() => null)
      ]);
      setAttendanceSummary(att);
      setMarksResult(marks);
    } catch (err) {
      console.error("Failed to load student profile metrics:", err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 transition-colors">
        {/* Modal Top Header Banner */}
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-black shadow-inner border border-white/20">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{student.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
                  {student.status}
                </span>
              </div>
              <p className="text-white/80 font-mono text-xs mt-1">
                Roll No: <strong className="font-bold text-white tracking-wider">{student.rollNumber}</strong> | {student.departmentName || student.departmentCode}
              </p>
            </div>
          </div>

          {/* Quick Metrics Capsule in Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
            <div>
              <span className="text-white/70 block">Academic Year</span>
              <span className="font-semibold text-white text-sm">{student.academicYear}</span>
            </div>
            <div>
              <span className="text-white/70 block">Current Semester</span>
              <span className="font-semibold text-white text-sm">Semester {student.semester}</span>
            </div>
            <div>
              <span className="text-white/70 block">Attendance Rate</span>
              <span className="font-semibold text-white text-sm">
                {student.attendancePercentage != null ? `${student.attendancePercentage}%` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-white/70 block">Overall Score</span>
              <span className="font-semibold text-white text-sm">
                {student.averageMarks != null ? `${student.averageMarks}%` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Bio</span>
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`py-3.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'attendance'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Attendance Records</span>
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`py-3.5 px-4 font-semibold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'marks'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Marks & Grades</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loadingMetrics && (
            <div className="flex items-center justify-center py-6 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-sm">Fetching student telemetry...</span>
            </div>
          )}

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Personal Information</h4>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-xs break-all">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-xs">{student.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-xs">DOB: {student.dateOfBirth} ({student.gender})</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-xs leading-relaxed">{student.address}</span>
                </div>
              </div>

              <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Academic Placement</h4>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-xs">{student.departmentName} ({student.departmentCode})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-xs">{student.courseName || 'B.Tech Program'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-xs">Admitted on: {student.admissionDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Award className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-xs">Batch: {student.academicYear} | Semester {student.semester}</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              {attendanceSummary ? (
                <>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-400">Total Classes</span>
                      <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{attendanceSummary.totalClasses}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">Present</span>
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">{attendanceSummary.presentCount}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                      <span className="text-xs text-rose-600 dark:text-rose-400">Absent</span>
                      <p className="text-lg font-bold text-rose-700 dark:text-rose-300 mt-0.5">{attendanceSummary.absentCount}</p>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider pt-2">Recent Attendance Logs</h4>
                  {attendanceSummary.recentRecords && attendanceSummary.recentRecords.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {attendanceSummary.recentRecords.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 px-3 font-mono">{r.attendanceDate}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded font-bold ${
                                  r.status === 'PRESENT'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500">{r.remarks || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No attendance records logged yet.</p>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400">Loading attendance data...</p>
              )}
            </div>
          )}

          {/* 3. MARKS TAB */}
          {activeTab === 'marks' && (
            <div className="space-y-4">
              {marksResult ? (
                <>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                      <span className="text-xs text-slate-400">Total Marks</span>
                      <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                        {marksResult.totalMarksObtained} / {marksResult.totalMaxMarks}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800">
                      <span className="text-xs text-brand-600 dark:text-brand-400">Percentage</span>
                      <p className="text-lg font-bold text-brand-700 dark:text-brand-300 mt-0.5">
                        {marksResult.overallPercentage}%
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                      <span className="text-xs text-purple-600 dark:text-purple-400">Grade</span>
                      <p className="text-lg font-bold text-purple-700 dark:text-purple-300 mt-0.5">
                        {marksResult.overallGrade}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider pt-2">Subject Grade Sheet</h4>
                  {marksResult.subjectMarks && marksResult.subjectMarks.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="py-2.5 px-3">Subject</th>
                            <th className="py-2.5 px-3">Code</th>
                            <th className="py-2.5 px-3">Sem</th>
                            <th className="py-2.5 px-3">Marks</th>
                            <th className="py-2.5 px-3">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {marksResult.subjectMarks.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">{m.subjectName}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-500">{m.subjectCode}</td>
                              <td className="py-2.5 px-3">Sem {m.semester}</td>
                              <td className="py-2.5 px-3 font-semibold">{m.marksObtained} / {m.maxMarks}</td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded font-bold bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
                                  {m.grade}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No subject marks registered for this student yet.</p>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400">Loading academic marks...</p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
