import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  Code2, 
  ArrowLeftRight, 
  Download, 
  RotateCcw,
  PlusCircle,
  BarChart3,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Student, StatsData } from './types.ts';
import { StudentForm } from './components/StudentForm.tsx';
import { StudentList } from './components/StudentList.tsx';
import { StudentCardModal } from './components/StudentCardModal.tsx';
import { EditStudentModal } from './components/EditStudentModal.tsx';
import { CodeExportModal } from './components/CodeExportModal.tsx';
import { MigrationCompareModal } from './components/MigrationCompareModal.tsx';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'form' | 'directory' | 'analytics'>('form');

  // Modals state
  const [selectedBadgeStudent, setSelectedBadgeStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setStudents(data.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Student operations
  const handleStudentAdded = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`Registered "${newStudent.name}" with ID: ${newStudent.id}`);
  };

  const handleStudentUpdated = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Updated student profile: ${updated.name}`);
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        showToast(`Student record ${id} removed successfully.`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete student');
    }
  };

  const handleResetData = async () => {
    if (!confirm('Reset students database to starter sample records?')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
        showToast('Database reset to starter student records.');
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  // Analytics derivations
  const totalStudents = students.length;
  const majorCounts: Record<string, number> = {};
  const gradYearCounts: Record<number, number> = {};
  let totalGpa = 0;
  let gpaCount = 0;

  students.forEach((s) => {
    majorCounts[s.major] = (majorCounts[s.major] || 0) + 1;
    gradYearCounts[s.graduationYear] = (gradYearCounts[s.graduationYear] || 0) + 1;
    if (s.gpa) {
      totalGpa += s.gpa;
      gpaCount++;
    }
  });

  const avgGpa = gpaCount > 0 ? (totalGpa / gpaCount).toFixed(2) : '3.80';
  const uniqueMajorsCount = Object.keys(majorCounts).length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation & Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 leading-tight">
                    Student Registration Portal
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-md">
                    Full-Stack React + Node
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Converted from legacy Tomcat Java Servlet to React &amp; Express API
                </p>
              </div>
            </div>

            {/* Quick Actions (Export code, Compare, Reset) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompareModal(true)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
                title="View Java vs Node/React architecture differences"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-500" />
                <span>Migration Comparison</span>
              </button>

              <button
                onClick={() => setShowCodeModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
                title="View and download source files"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Download / View Files</span>
              </button>

              <button
                onClick={handleResetData}
                title="Reset sample records"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Bar & Tabs */}
          <div className="flex items-center space-x-1 border-t border-slate-100 py-1">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Registration Form</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student Directory ({students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Academic Analytics</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{totalStudents}</div>
              <div className="text-[11px] font-medium text-slate-500 uppercase">Enrolled Students</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{uniqueMajorsCount}</div>
              <div className="text-[11px] font-medium text-slate-500 uppercase">Active Majors</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">
                {Object.keys(gradYearCounts).length} Cohorts
              </div>
              <div className="text-[11px] font-medium text-slate-500 uppercase">Graduation Years</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{avgGpa}</div>
              <div className="text-[11px] font-medium text-slate-500 uppercase">Cohort Mean GPA</div>
            </div>
          </div>
        </div>

        {/* Dynamic Views */}
        {activeTab === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <StudentForm onStudentAdded={handleStudentAdded} />
            </div>

            {/* Quick Live Preview Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Recently Registered
                  </h3>
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {students.slice(0, 4).map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/60 transition group cursor-pointer flex items-center justify-between"
                      onClick={() => setSelectedBadgeStudent(s)}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900 truncate">
                            {s.name}
                          </span>
                          <span className="text-[10px] font-mono text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                            {s.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {s.major} &bull; Class of {s.graduationYear}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-600 group-hover:underline">
                        Badge &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Converted Fields Card */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-2">
                  Specification Conversion Note
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Converted from the Java Tomcat project:
                </p>
                <ul className="text-xs text-slate-200 space-y-1.5 list-disc list-inside">
                  <li><strong>Student ID</strong> (id)</li>
                  <li><strong>Major</strong> (academic program)</li>
                  <li><strong>Graduation Year</strong> (cohort year)</li>
                  <li><strong>Full Name, Email &amp; Phone</strong> preserved</li>
                  <li><strong>React 19 SPA</strong> frontend</li>
                  <li><strong>Node.js Express</strong> REST backend</li>
                </ul>
                <button
                  onClick={() => setShowCodeModal(true)}
                  className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Inspect Backend &amp; Frontend Files
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'directory' && (
          <StudentList
            students={students}
            loading={loading}
            onDeleteStudent={handleDeleteStudent}
            onEditStudent={(st) => setEditingStudent(st)}
            onViewBadge={(st) => setSelectedBadgeStudent(st)}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Majors Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Distribution by Major
              </h3>
              <div className="space-y-3">
                {Object.entries(majorCounts).map(([major, count]) => {
                  const pct = Math.round((count / (totalStudents || 1)) * 100);
                  return (
                    <div key={major}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{major}</span>
                        <span className="font-semibold text-slate-900">
                          {count} student{count > 1 ? 's' : ''} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cohorts Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Graduation Year Cohorts
              </h3>
              <div className="space-y-3">
                {Object.entries(gradYearCounts).map(([yr, count]) => {
                  const pct = Math.round((count / (totalStudents || 1)) * 100);
                  return (
                    <div key={yr}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">Class of {yr}</span>
                        <span className="font-semibold text-slate-900">
                          {count} candidate{count > 1 ? 's' : ''} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>Student Registration System &bull; React Frontend + Node.js REST API</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCompareModal(true)}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Migration Notes
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setShowCodeModal(true)}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Download Source Code
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentCardModal
        student={selectedBadgeStudent}
        onClose={() => setSelectedBadgeStudent(null)}
      />

      <EditStudentModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onStudentUpdated={handleStudentUpdated}
      />

      {showCodeModal && <CodeExportModal onClose={() => setShowCodeModal(false)} />}

      {showCompareModal && <MigrationCompareModal onClose={() => setShowCompareModal(false)} />}
    </div>
  );
}
