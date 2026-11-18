import React, { useState, useEffect } from 'react';
import { departmentService } from '../services/aiService';
import { Building2, BookOpen, Layers, Award, Users, Loader2 } from 'lucide-react';

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deptList, courseList] = await Promise.all([
        departmentService.getAllDepartments(),
        departmentService.getAllCourses()
      ]);
      setDepartments(deptList || []);
      setCourses(courseList || []);
    } catch (err) {
      console.error("Failed to load departments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-2" />
        <p className="text-xs font-semibold">Loading departments catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>Academic Departments &amp; Courses</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            {departments.length} Faculties
          </span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          University engineering faculties, department codes, curriculum tracks, and affiliated undergraduate programs.
        </p>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptCourses = courses.filter(c => c.departmentId === dept.id);

          return (
            <div
              key={dept.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                    {dept.departmentCode}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {dept.departmentName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {dept.description || 'Undergraduate engineering and research curriculum.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                  Degree Programs ({deptCourses.length})
                </span>
                <div className="space-y-1.5">
                  {deptCourses.map((c) => (
                    <div key={c.id} className="text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
                      <span className="font-medium truncate">{c.courseName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{c.totalCredits} Cr</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
