import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { marksService } from '../services/marksService';
import { studentService } from '../services/studentService';
import { departmentService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  Award,
  Plus,
  Search,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Loader2,
  X,
  CheckCircle2
} from 'lucide-react';

export const MarksPage = () => {
  const { handleViewStudentProfile } = useOutletContext();
  const { isAdmin, isTeacher } = useAuth();
  const { showToast } = useToast();

  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Student Result search
  const [searchRoll, setSearchRoll] = useState('22CS101');
  const [searchedResult, setSearchedResult] = useState(null);
  const [searching, setSearching] = useState(false);

  // Add Marks Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [markForm, setMarkForm] = useState({
    studentId: '',
    subjectId: 1,
    semester: 3,
    marksObtained: '',
    maxMarks: 100,
    examType: 'FINAL',
    examDate: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTopRankers();
    handleSearchStudentResult('22CS101');
    loadStudentsList();
  }, []);

  const loadTopRankers = async () => {
    try {
      const data = await marksService.getTopPerformers();
      setTopPerformers(data || []);
    } catch (err) {
      console.error("Failed to load top performers:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentsList = async () => {
    try {
      const res = await studentService.getStudents({ size: 100 });
      setStudents(res.content || []);
      if (res.content && res.content.length > 0) {
        setMarkForm(prev => ({ ...prev, studentId: res.content[0].id }));
      }
    } catch (err) {
      console.error("Failed to load students list:", err);
    }
  };

  const handleSearchStudentResult = async (roll) => {
    const targetRoll = (roll || searchRoll).trim();
    if (!targetRoll) return;

    setSearching(true);
    try {
      const student = await studentService.getStudentByRollNumber(targetRoll);
      const results = await marksService.getStudentMarks(student.id);
      setSearchedResult(results);
    } catch (err) {
      console.error("Failed to find results:", err);
      setSearchedResult(null);
      showToast(`No student found with roll number '${targetRoll}'`, "warning");
    } finally {
      setSearching(false);
    }
  };

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    if (!markForm.studentId || markForm.marksObtained === '') {
      showToast("Please fill all required marks fields", "warning");
      return;
    }

    setSubmitting(true);
    try {
      await marksService.addOrUpdateMarks({
        studentId: Number(markForm.studentId),
        subjectId: Number(markForm.subjectId),
        semester: Number(markForm.semester),
        marksObtained: Number(markForm.marksObtained),
        maxMarks: Number(markForm.maxMarks),
        examType: markForm.examType,
        examDate: markForm.examDate
      });
      showToast("Marks registered successfully!", "success");
      setModalOpen(false);
      loadTopRankers();
      if (searchedResult && searchedResult.studentId === Number(markForm.studentId)) {
        handleSearchStudentResult(searchedResult.rollNumber);
      }
    } catch (err) {
      console.error("Failed to submit marks:", err);
      showToast(err.response?.data?.message || "Error saving marks", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const canManageMarks = isAdmin || isTeacher;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Marks & Academic Results</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Exam System
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grade ledger, semester scorecard calculation, and top performance ranking.
          </p>
        </div>

        {canManageMarks && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Enter Subject Marks</span>
          </button>
        )}
      </div>

      {/* Top Section: Quick Roll Number Scorecard Inspection */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>Student Semester Grade Sheet Lookup</span>
            </h3>
            <p className="text-xs text-slate-400">Search by student roll number to view official semester transcript</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchStudentResult();
            }}
            className="flex gap-2 w-full sm:w-auto"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchRoll}
                onChange={(e) => setSearchRoll(e.target.value.toUpperCase())}
                placeholder="e.g. 22CS101"
                className="pl-9 pr-3 py-2 rounded-xl text-xs font-mono font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 w-44"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-brand-600 text-white font-semibold text-xs transition-colors"
            >
              {searching ? 'Loading...' : 'Lookup'}
            </button>
          </form>
        </div>

        {searchedResult ? (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {/* Student Score Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 via-indigo-50 to-purple-50 dark:from-slate-800/60 dark:to-brand-950/40 border border-brand-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                  {searchedResult.rollNumber}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {searchedResult.studentName}
                </h4>
                <p className="text-xs text-slate-500">{searchedResult.departmentName} • Semester {searchedResult.semester}</p>
              </div>

              <div className="flex items-center gap-4 text-center">
                <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Marks</span>
                  <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
                    {searchedResult.totalMarksObtained} / {searchedResult.totalMaxMarks}
                  </p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Percentage</span>
                  <p className="text-base font-black text-brand-600 dark:text-brand-400 mt-0.5">
                    {searchedResult.overallPercentage}%
                  </p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Grade</span>
                  <p className="text-base font-black text-purple-600 dark:text-purple-400 mt-0.5">
                    {searchedResult.overallGrade}
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Grade Sheet */}
            {searchedResult.subjectMarks && searchedResult.subjectMarks.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Subject Name</th>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Semester</th>
                      <th className="py-2.5 px-3">Exam Type</th>
                      <th className="py-2.5 px-3">Score Obtained</th>
                      <th className="py-2.5 px-3">Max</th>
                      <th className="py-2.5 px-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {searchedResult.subjectMarks.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{m.subjectName}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{m.subjectCode}</td>
                        <td className="py-2.5 px-3">Sem {m.semester}</td>
                        <td className="py-2.5 px-3">{m.examType}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800 dark:text-slate-100">{m.marksObtained}</td>
                        <td className="py-2.5 px-3 text-slate-400">{m.maxMarks}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded font-black text-[11px] bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300">
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
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            Enter roll number above to inspect marks.
          </div>
        )}
      </div>

      {/* Top 10 Performing Students Leaderboard */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Honor Roll (Top 10 Students)</h3>
              <p className="text-xs text-slate-400">Ranked by cumulative average marks percentage across university</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Attendance</th>
                <th className="py-3 px-4">Average Marks</th>
                <th className="py-3 px-4 text-right">View Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topPerformers.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className={`w-7 h-7 rounded-xl inline-flex items-center justify-center text-xs font-black shadow-sm ${
                      idx === 0 ? 'bg-gradient-to-tr from-amber-400 to-amber-500 text-amber-950 ring-2 ring-amber-400/30' :
                      idx === 1 ? 'bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-900' :
                      idx === 2 ? 'bg-gradient-to-tr from-amber-600 to-amber-800 text-white' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {student.rollNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {student.fullName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {student.departmentCode || student.departmentName}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {student.attendancePercentage}%
                  </td>
                  <td className="py-3 px-4 font-black text-brand-600 dark:text-brand-400 text-base">
                    {student.averageMarks}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleViewStudentProfile(student)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Marks Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Enter Subject Marks</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Student *
                </label>
                <select
                  value={markForm.studentId}
                  onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.rollNumber} - {s.fullName} ({s.departmentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <select
                    value={markForm.subjectId}
                    onChange={(e) => setMarkForm({ ...markForm, subjectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <option value="1">Data Structures &amp; Algorithms (CS301)</option>
                    <option value="2">Database Management Systems (CS302)</option>
                    <option value="3">Operating Systems (CS401)</option>
                    <option value="4">Computer Networks (CS402)</option>
                    <option value="5">Artificial Intelligence (CS501)</option>
                    <option value="6">Digital Signal Processing (EC301)</option>
                    <option value="9">Thermodynamics (ME301)</option>
                    <option value="11">Structural Analysis (CE301)</option>
                    <option value="13">Web Technologies (IT301)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester *
                  </label>
                  <select
                    value={markForm.semester}
                    onChange={(e) => setMarkForm({ ...markForm, semester: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marks Obtained *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={markForm.marksObtained}
                    onChange={(e) => setMarkForm({ ...markForm, marksObtained: e.target.value })}
                    placeholder="e.g. 88.5"
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Marks *
                  </label>
                  <input
                    type="number"
                    value={markForm.maxMarks}
                    onChange={(e) => setMarkForm({ ...markForm, maxMarks: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Subject Grade</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
