import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { MarksPage } from './pages/MarksPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500 mr-2" />
        <span className="text-sm font-semibold">Validating session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If student attempts to access dashboard, redirect to profile
    if (user.role === 'ROLE_STUDENT') {
      return <Navigate to="/profile" replace />;
    }
    return <Navigate to="/students" replace />;
  }

  return children;
};

const RootRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'ROLE_STUDENT') {
    return <Navigate to="/profile" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

export const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected App Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<RootRedirect />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_TEACHER']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="students" element={<StudentsPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="marks" element={<MarksPage />} />
                <Route
                  path="departments"
                  element={
                    <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_TEACHER']}>
                      <DepartmentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
