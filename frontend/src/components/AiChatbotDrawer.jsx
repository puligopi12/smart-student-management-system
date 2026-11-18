import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import {
  Sparkles,
  X,
  Search,
  Loader2,
  ExternalLink,
  Bot,
  Zap,
  CheckCircle,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export const AiChatbotDrawer = ({ isOpen, onClose, onViewStudentProfile }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState(null);
  const [error, setError] = useState(null);

  const samplePrompts = [
    "Find student with roll number 22CS101",
    "Search for students named Rahul",
    "Show all CSE department students",
    "Find students from the 2025 batch",
    "Show students with attendance below 75%",
    "Find students who scored more than 80 marks",
    "Show the top 10 students based on marks",
    "Sort students by name alphabetically",
    "Find students who belong to the ECE department",
    "Find a student using their email address rahul.sharma@student.edu"
  ];

  const handleSearch = async (queryString) => {
    const q = (queryString || query).trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    try {
      const data = await aiService.searchWithNaturalLanguage(q);
      setSearchResponse(data);
    } catch (err) {
      console.error("AI Search failed:", err);
      setError(err.response?.data?.message || err.message || "Failed to process AI search query.");
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (prompt) => {
    setQuery(prompt);
    handleSearch(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-brand-50 to-indigo-50/50 dark:from-brand-950/40 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Student Search Assistant</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                  Secure NLP
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Type normal English questions to find, filter, and inspect student records.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input container */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask e.g. 'Find student 22CS101' or 'Show attendance below 75%'..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-md shadow-brand-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </form>

          {/* Quick example prompt chips */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Try:</span>
            {samplePrompts.slice(0, 6).map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(prompt)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 border border-slate-200 dark:border-slate-700 transition-all font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Content area: results or empty guide */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3">
              <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <span className="font-semibold">Query Error:</span> {error}
              </div>
            </div>
          )}

          {searchResponse && (
            <div className="space-y-4">
              {/* Interpretation capsule */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950/50 dark:to-indigo-950/50 border border-brand-200 dark:border-brand-800/60">
                <div className="flex items-center justify-between text-xs text-brand-800 dark:text-brand-300 font-semibold mb-1">
                  <div className="flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span>AI Interpretation & Reasoning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-brand-200/60 dark:bg-brand-900 text-brand-800 dark:text-brand-200 text-[10px] font-mono">
                      Engine: {searchResponse.aiProvider}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {searchResponse.executionTimeMs}ms
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {searchResponse.explanation}
                </p>

                {searchResponse.matchedRollNumber && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-300 dark:border-amber-800">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Matched Roll Number: <strong className="font-mono">{searchResponse.matchedRollNumber}</strong></span>
                  </div>
                )}
              </div>

              {/* Result header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Results</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {searchResponse.totalResults} found
                  </span>
                </h3>
              </div>

              {/* Results table */}
              {searchResponse.results && searchResponse.results.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Roll Number</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Semester</th>
                        <th className="py-3 px-4">Attendance</th>
                        <th className="py-3 px-4">Avg Marks</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {searchResponse.results.map((student) => {
                        const isHighlighted = searchResponse.matchedRollNumber &&
                          student.rollNumber.toUpperCase() === searchResponse.matchedRollNumber.toUpperCase();

                        return (
                          <tr
                            key={student.id}
                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                              isHighlighted ? 'bg-amber-50/70 dark:bg-amber-950/30' : ''
                            }`}
                          >
                            <td className="py-3 px-4 font-mono font-semibold">
                              {isHighlighted ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-700">
                                  {student.rollNumber}
                                </span>
                              ) : (
                                <span className="text-slate-700 dark:text-slate-300">{student.rollNumber}</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                              {student.fullName}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {student.departmentCode || student.departmentName}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                              Sem {student.semester}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-semibold ${
                                student.attendancePercentage < 75
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : student.attendancePercentage >= 85
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-amber-600 dark:text-amber-400'
                              }`}>
                                {student.attendancePercentage}%
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                              {student.averageMarks ? `${student.averageMarks}%` : 'N/A'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                student.status === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {student.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => onViewStudentProfile(student)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
                              >
                                <span>Profile</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No matching students found</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Try refining your natural language query or test with roll number, department name (e.g. CSE), or name.
                  </p>
                </div>
              )}
            </div>
          )}

          {!searchResponse && !loading && (
            <div className="py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-brand-500/25">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Student Query System</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Antigravity AI connects normal conversational queries directly to parameterized SQL database searches without executing arbitrary code.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-6 text-left max-w-xl mx-auto">
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleChipClick(p)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-white dark:bg-slate-800 hover:bg-brand-50/30 dark:hover:bg-brand-950/30 text-xs text-slate-700 dark:text-slate-300 font-medium transition-all flex items-center gap-2 group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-500 shrink-0 group-hover:scale-120 transition-transform" />
                    <span className="truncate">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
