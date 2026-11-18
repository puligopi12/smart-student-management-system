import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { AiChatbotDrawer } from '../components/AiChatbotDrawer';
import { StudentProfileModal } from '../components/StudentProfileModal';
import { Sparkles } from 'lucide-react';

export const MainLayout = () => {
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);

  const handleOpenAiSearch = () => {
    setAiDrawerOpen(true);
  };

  const handleCloseAiSearch = () => {
    setAiDrawerOpen(false);
  };

  const handleViewStudentProfile = (student) => {
    setSelectedStudentForProfile(student);
  };

  const handleCloseProfileModal = () => {
    setSelectedStudentForProfile(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Sidebar */}
      <Sidebar onOpenAiSearch={handleOpenAiSearch} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenAiSearch={handleOpenAiSearch} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet context={{ handleViewStudentProfile, handleOpenAiSearch }} />
        </main>
      </div>

      {/* Floating AI Chatbot Action Button (Bottom Right) */}
      <div className="fixed bottom-7 right-7 z-40">
        <button
          onClick={handleOpenAiSearch}
          className="ai-floating-pulse group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-brand-500/30 transition-all transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-5 h-5 animate-spin-slow" />
          <span className="hidden sm:inline tracking-wide">AI Student Search</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        </button>
      </div>

      {/* Slide-over AI Assistant Drawer */}
      <AiChatbotDrawer
        isOpen={aiDrawerOpen}
        onClose={handleCloseAiSearch}
        onViewStudentProfile={handleViewStudentProfile}
      />

      {/* Global Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudentForProfile}
        isOpen={!!selectedStudentForProfile}
        onClose={handleCloseProfileModal}
      />
    </div>
  );
};
