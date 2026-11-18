import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  GraduationCap,
  Building2,
  UserCheck,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const Sidebar = ({ onOpenAiSearch }) => {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();

  const links = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      show: isAdmin || isTeacher,
    },
    {
      to: '/students',
      label: 'Students',
      icon: Users,
      show: true,
    },
    {
      to: '/attendance',
      label: 'Attendance',
      icon: CalendarCheck2,
      show: true,
    },
    {
      to: '/marks',
      label: 'Marks & Results',
      icon: GraduationCap,
      show: true,
    },
    {
      to: '/departments',
      label: 'Departments',
      icon: Building2,
      show: isAdmin || isTeacher,
    },
    {
      to: '/profile',
      label: isStudent ? 'My Academic Record' : 'My Profile',
      icon: isStudent ? UserCheck : BookOpen,
      show: true,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 transition-colors">
      {/* Brand logo header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">SmartEdu</span>
          <span className="ml-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">AI</span>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
          Management
        </div>

        {links.filter(l => l.show).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* AI Assistant Quick Banner inside sidebar */}
        <div className="pt-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-brand-500/10 to-purple-500/10 border border-brand-200/50 dark:border-brand-800/40 relative overflow-hidden">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Search Engine</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Query students in natural English: roll numbers, batches, low attendance, or top rankers.
            </p>
            <button
              onClick={onOpenAiSearch}
              className="w-full py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Search</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Role Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
        <div className="flex justify-between items-center">
          <span>Active Role</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {user?.role?.replace('ROLE_', '') || 'GUEST'}
          </span>
        </div>
      </div>
    </aside>
  );
};
