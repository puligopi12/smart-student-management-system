import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { attendanceService } from '../services/attendanceService';
import { marksService } from '../services/marksService';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Building,
  CalendarCheck2,
  GraduationCap,
  Award,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, isStudent } = useAuth();
  const [studentRecord, setStudentRecord] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [marksResult, setMarksResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      if (isStudent && (user.studentId || user.email)) {
        let student = null;
        if (user.studentId) {
          student = await studentService.getStudentById(user.studentId).catch(() => null);
        }
        if (!student && user.email) {
          const list = await studentService.getStudents({ search: user.email });
          if (list.content && list.content.length > 0) {
            student = list.content[0];
          }
        }

        if (student) {
          setStudentRecord(student);
          const [att, marks] = await Promise.all([
            attendanceService.getStudentAttendance(student.id).catch(() => null),
            marksService.getStudentMarks(student.id).catch(() => null)
          ]);
          setAttendanceSummary(att);
          setMarksResult(marks);
        }
      }
    } catch (err) {
      console.error("Failed to load user profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Top Profile Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl font-black shadow-inner border border-white/25">
            {user?.fullName?.charAt(0) || 'U'}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold">{user?.fullName || user?.username}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
                {user?.role?.replace('ROLE_', '')}
              </span>
            </div>
            <p className="text-white/80 text-xs mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
              <span>•</span>
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Campus Credential</span>
            </p>
          </div>
        </div>

        {studentRecord && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/15 text-xs">
            <div>
              <span className="text-white/70 block">Roll Number</span>
              <span className="font-mono font-bold text-white text-sm">{studentRecord.rollNumber}</span>
            </div>
            <div>
              <span className="text-white/70 block">Department</span>
              <span className="font-bold text-white text-sm">{studentRecord.departmentCode || studentRecord.departmentName}</span>
            </div>
            <div>
              <span className="text-white/70 block">Attendance Rate</span>
              <span className="font-bold text-white text-sm">{studentRecord.attendancePercentage}%</span>
            </div>
            <div>
              <span className="text-white/70 block">Academic Average</span>
              <span className="font-bold text-white text-sm">{studentRecord.averageMarks}%</span>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="py-12 flex justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-brand-600 mr-2" />
          <span className="text-sm">Loading student academic records...</span>
        </div>
      )}

      {/* Student Academic Specific Cards */}
      {isStudent && studentRecord && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Ledger */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
                <span>My Attendance Record</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600">
                {attendanceSummary?.attendancePercentage}% Overall
              </span>
            </div>

            {attendanceSummary?.recentRecords && attendanceSummary.recentRecords.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {attendanceSummary.recentRecords.slice(0, 8).map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 px-3 font-mono">{r.attendanceDate}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            r.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-400">{r.remarks || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No attendance history logged.</p>
            )}
          </div>

          {/* Marks Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>My Semester Transcript</span>
              </h3>
              <span className="text-xs font-bold text-purple-600">
                Grade: {marksResult?.overallGrade || 'N/A'} ({marksResult?.overallPercentage}%)
              </span>
            </div>

            {marksResult?.subjectMarks && marksResult.subjectMarks.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Marks</th>
                      <th className="py-2.5 px-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {marksResult.subjectMarks.map((m) => (
                      <tr key={m.id}>
                        <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{m.subjectName}</td>
                        <td className="py-2 px-3 font-semibold">{m.marksObtained} / {m.maxMarks}</td>
                        <td className="py-2 px-3 font-bold text-brand-600">{m.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No marks registered yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Account Details Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Security &amp; Account Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400">Account Username</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{user?.username}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400">Security Clearance</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{user?.role}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-slate-400">Session Status</span>
            <p className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active JWT Session</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
