import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  IdCard, 
  Download, 
  LayoutGrid, 
  List as ListIcon, 
  GraduationCap, 
  Calendar, 
  Mail, 
  Phone,
  ArrowUpDown
} from 'lucide-react';
import { Student, POPULAR_MAJORS, GRADUATION_YEARS } from '../types.ts';

interface StudentListProps {
  students: Student[];
  loading: boolean;
  onDeleteStudent: (id: string) => Promise<void>;
  onEditStudent: (student: Student) => void;
  onViewBadge: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  loading,
  onDeleteStudent,
  onEditStudent,
  onViewBadge,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter students
  const filtered = students.filter((s) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.id.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.major.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q);

    const matchesMajor = selectedMajor === 'All' || s.major === selectedMajor;
    const matchesYear = selectedYear === 'All' || s.graduationYear === Number(selectedYear);

    return matchesSearch && matchesMajor && matchesYear;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove student "${name}" (${id})?`)) return;
    setDeletingId(id);
    try {
      await onDeleteStudent(id);
    } finally {
      setDeletingId(null);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (students.length === 0) return;
    const headers = ['Student ID', 'Full Name', 'Email', 'Phone', 'Major', 'Graduation Year', 'Semester', 'Status', 'GPA', 'Registered Date'];
    const rows = filtered.map((s) => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      `"${s.major}"`,
      s.graduationYear,
      `"${s.semester || ''}"`,
      `"${s.status || 'Active'}"`,
      s.gpa || '',
      `"${new Date(s.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `students_data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Control Toolbar */}
      <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, name, email, major..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Major Filter */}
          <select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="All">All Majors</option>
            {POPULAR_MAJORS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Grad Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="All">All Grad Years</option>
            {GRADUATION_YEARS.map((yr) => (
              <option key={yr} value={yr}>
                Class of {yr}
              </option>
            ))}
          </select>

          {/* Export Dropdown / Buttons */}
          <button
            onClick={handleExportCsv}
            title="Export CSV"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            CSV
          </button>

          <button
            onClick={handleExportJson}
            title="Export JSON"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            JSON
          </button>

          {/* View toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-white">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
          <p className="text-sm">Loading registered students...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">No students found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedMajor !== 'All' || selectedYear !== 'All'
              ? 'Try adjusting your search criteria or filter options.'
              : 'No students have been registered yet. Use the form above to enroll a student.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Major</th>
                <th className="py-3.5 px-4">Graduation</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4 text-center">Status / GPA</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors group">
                  {/* Student ID */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-indigo-700 text-xs whitespace-nowrap">
                    {student.id}
                  </td>

                  {/* Student Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">{student.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{student.email}</span>
                    </div>
                  </td>

                  {/* Major */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <GraduationCap className="w-3 h-3" />
                      {student.major}
                    </span>
                  </td>

                  {/* Graduation Year */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Class of {student.graduationYear}</span>
                    </div>
                    {student.semester && (
                      <span className="text-[11px] text-slate-400 block">{student.semester}</span>
                    )}
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{student.phone}</span>
                    </div>
                  </td>

                  {/* Status & GPA */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 mr-2">
                      {student.status || 'Active'}
                    </span>
                    {student.gpa && (
                      <span className="text-xs font-mono font-medium text-slate-600">
                        GPA {student.gpa.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewBadge(student)}
                        title="View Digital Student ID Badge"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      >
                        <IdCard className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditStudent(student)}
                        title="Edit Student Info"
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, student.name)}
                        disabled={deletingId === student.id}
                        title="Delete Student Record"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card Grid View */
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <div
              key={student.id}
              className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {student.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {student.status || 'Active'}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-base mb-1">{student.name}</h4>

                <div className="space-y-1.5 text-xs text-slate-600 my-3">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{student.major}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Graduation: Class of {student.graduationYear}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{student.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  GPA: <strong className="text-slate-800">{student.gpa?.toFixed(2) || 'N/A'}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewBadge(student)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                    title="View Student ID Badge"
                  >
                    <IdCard className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditStudent(student)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id, student.name)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Summary */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>
          Showing <strong>{filtered.length}</strong> of <strong>{students.length}</strong> registered students
        </span>
        <span>
          Synchronized live with backend <code className="text-indigo-600">/api/students</code>
        </span>
      </div>
    </div>
  );
};
