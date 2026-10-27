import React from 'react';
import { X, GraduationCap, Printer, ShieldCheck, QrCode } from 'lucide-react';
import { Student } from '../types.ts';

interface StudentCardModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({ student, onClose }) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  // Deterministic color/avatar based on name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800 text-sm">Official Student ID Badge</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Card Visual */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-indigo-500/30">
            {/* Background design elements */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* University Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/30 border border-indigo-400/30 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h4 className="font-bold text-xs tracking-wider uppercase text-white">University Institute</h4>
                  <p className="text-[10px] text-indigo-300 tracking-wide">Student Identification Pass</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {student.status || 'Active'}
              </span>
            </div>

            {/* Student Photo & Details */}
            <div className="flex gap-4 items-center mb-5">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-2xl flex items-center justify-center shadow-inner border-2 border-white/20 shrink-0">
                {getInitials(student.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-bold text-white truncate">{student.name}</div>
                <div className="text-xs font-mono text-indigo-200 mt-0.5 tracking-wider font-semibold">
                  {student.id}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-indigo-100">
                  <GraduationCap className="w-3 h-3 text-indigo-300" />
                  {student.major}
                </div>
              </div>
            </div>

            {/* Cohort & Contacts Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/25 p-3 rounded-xl border border-white/5 mb-4">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Graduation Year</span>
                <span className="font-semibold text-white">Class of {student.graduationYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Starting Term</span>
                <span className="font-semibold text-white">{student.semester || 'Fall 2026'}</span>
              </div>
              <div className="col-span-2 truncate">
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Email</span>
                <span className="font-mono text-indigo-200 truncate">{student.email}</span>
              </div>
            </div>

            {/* Card Barcode simulation footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="space-y-1">
                <div className="font-mono text-[9px] tracking-widest text-slate-400">
                  ||| | | |||| || | || ||| || ||||
                </div>
                <p className="text-[9px] text-slate-400">Valid throughout academic enrollment</p>
              </div>
              <QrCode className="w-7 h-7 text-indigo-300 opacity-80" />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Badge
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
