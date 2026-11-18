import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { departmentService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StudentModal } from '../components/StudentModal';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  Users,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';

export const StudentsPage = () => {
  const { handleViewStudentProfile, handleOpenAiSearch } = useOutletContext();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Sorting
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('fullName');
  const [sortDir, setSortDir] = useState('asc');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [attendanceRange, setAttendanceRange] = useState(''); // 'below75', 'above85', ''
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size,
        sortBy,
        sortDir,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedDept) params.departmentId = selectedDept;
      if (selectedYear) params.academicYear = selectedYear;
      if (selectedSemester) params.semester = selectedSemester;
      if (selectedStatus) params.status = selectedStatus;

      if (attendanceRange === 'below75') {
        params.maxAttendance = 74.9;
      } else if (attendanceRange === 'above85') {
        params.minAttendance = 85.0;
      }

      const res = await studentService.getStudents(params);
      setStudents(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      showToast("Error loading student records", "error");
    } finally {
      setLoading(false);
    }
  }, [page, size, sortBy, sortDir, search, selectedDept, selectedYear, selectedSemester, selectedStatus, attendanceRange, showToast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    departmentService.getAllDepartments().then(setDepartments).catch(console.error);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchStudents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedDept('');
    setSelectedYear('');
    setSelectedSemester('');
    setSelectedStatus('');
    setAttendanceRange('');
    setSortBy('fullName');
    setSortDir('asc');
    setPage(0);
  };

  const handleAddStudent = () => {
    setStudentToEdit(null);
    setModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    setModalOpen(true);
  };

  const handleDeletePrompt = (student) => {
    setStudentToDelete(student);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    setDeleting(true);
    try {
      await studentService.deleteStudent(studentToDelete.id);
      showToast(`Student ${studentToDelete.fullName} deleted successfully`, "success");
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (err) {
      console.error("Delete failed:", err);
      showToast(err.response?.data?.message || "Failed to delete student", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
    setPage(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Student Management</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              {totalElements} Total
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, enroll, and manage university student profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAiSearch}
            className="px-3.5 py-2.5 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>AI Search</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleAddStudent}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Roll number (e.g. 22CS101), student name, or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Toggle filter drawer button */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showFilters || selectedDept || selectedYear || selectedSemester || selectedStatus || attendanceRange
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {(selectedDept || selectedYear || selectedSemester || selectedStatus || attendanceRange) && (
              <span className="w-2 h-2 rounded-full bg-brand-600" />
            )}
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                setSortBy(sb);
                setSortDir(sd);
                setPage(0);
              }}
              className="w-full md:w-auto px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="fullName-asc">Sort: Name (A-Z)</option>
              <option value="fullName-desc">Sort: Name (Z-A)</option>
              <option value="rollNumber-asc">Sort: Roll No (Asc)</option>
              <option value="attendancePercentage-desc">Sort: Highest Attendance</option>
              <option value="attendancePercentage-asc">Sort: Lowest Attendance</option>
              <option value="averageMarks-desc">Sort: Highest Marks</option>
              <option value="admissionDate-desc">Sort: Newest Admissions</option>
            </select>

            <button
              onClick={fetchStudents}
              title="Refresh"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 animate-slide-in">
            {/* Department Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setPage(0); }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.departmentCode} - {d.departmentName}</option>
                ))}
              </select>
            </div>

            {/* Academic Year Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Batch Year</label>
              <select
                value={selectedYear}
                onChange={(e) => { setSelectedYear(e.target.value); setPage(0); }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="">All Years</option>
                <option value="2025">2025 Batch</option>
                <option value="2024">2024 Batch</option>
                <option value="2023">2023 Batch</option>
                <option value="2022">2022 Batch</option>
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => { setSelectedSemester(e.target.value); setPage(0); }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            {/* Attendance Filter */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Attendance</label>
              <select
                value={attendanceRange}
                onChange={(e) => { setAttendanceRange(e.target.value); setPage(0); }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="">Any Attendance</option>
                <option value="below75">&lt; 75% (Critical Warning)</option>
                <option value="above85">&gt; 85% (Excellent)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Student Data Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-2" />
            <p className="text-xs font-semibold">Loading student directory...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th
                    onClick={() => handleSortToggle('rollNumber')}
                    className="py-3.5 px-4 cursor-pointer hover:text-brand-600 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Roll Number</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortToggle('fullName')}
                    className="py-3.5 px-4 cursor-pointer hover:text-brand-600 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Full Name</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Batch / Sem</th>
                  <th
                    onClick={() => handleSortToggle('attendancePercentage')}
                    className="py-3.5 px-4 cursor-pointer hover:text-brand-600 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Attendance</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSortToggle('averageMarks')}
                    className="py-3.5 px-4 cursor-pointer hover:text-brand-600 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Avg Score</span>
                      <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                      {student.rollNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {student.fullName}
                      </div>
                      <div className="text-xs text-slate-400">{student.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {student.departmentCode || student.departmentName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                      Batch {student.academicYear} • Sem {student.semester}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                        student.attendancePercentage < 75
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : student.attendancePercentage >= 85
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {student.averageMarks ? `${student.averageMarks}%` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        student.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewStudentProfile(student)}
                          title="View Profile"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEditStudent(student)}
                              title="Edit Student"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePrompt(student)}
                              title="Delete Student"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No students matched criteria</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or adjusting search keyword.</p>
            <button
              onClick={handleResetFilters}
              className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={size}
              onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span>Showing {students.length} of {totalElements} students</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-300 px-2">
              Page {page + 1} of {Math.max(1, totalPages)}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        student={studentToEdit}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchStudents}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Student Record"
        message={`Are you sure you want to delete ${studentToDelete?.fullName} (${studentToDelete?.rollNumber})? This will also remove their attendance and mark records.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};
