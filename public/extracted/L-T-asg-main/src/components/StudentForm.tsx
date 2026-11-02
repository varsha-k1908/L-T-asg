import React, { useState } from 'react';
import { 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  IdCard, 
  Mail, 
  Phone, 
  BookOpen, 
  Calendar,
  RotateCcw
} from 'lucide-react';
import { Student, POPULAR_MAJORS, GRADUATION_YEARS } from '../types.ts';

interface StudentFormProps {
  onStudentAdded: (student: Student) => void;
  nextSuggestedId?: string;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onStudentAdded, nextSuggestedId }) => {
  const [formData, setFormData] = useState({
    id: nextSuggestedId || 'STU-1006',
    name: '',
    email: '',
    phone: '',
    major: 'Computer Science',
    graduationYear: 2027,
    semester: 'Fall 2026',
    status: 'Active' as const,
    gpa: '3.80',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCustomMajor, setIsCustomMajor] = useState(false);

  // Quick prefill sample
  const handlePrefill = () => {
    const randomIdNum = Math.floor(1000 + Math.random() * 9000);
    const sampleNames = [
      { name: 'Jordan Taylor', email: 'jordan.t@university.edu', phone: '+1 (555) 321-9844', major: 'Computer Science', grad: 2027 },
      { name: 'Maya Patel', email: 'maya.patel@university.edu', phone: '+1 (555) 745-1209', major: 'Data Science & AI', grad: 2026 },
      { name: 'Ethan Wright', email: 'ethan.w@university.edu', phone: '+1 (555) 890-4412', major: 'Electrical Engineering', grad: 2028 },
      { name: 'Chloe Dubois', email: 'chloe.d@university.edu', phone: '+1 (555) 623-8871', major: 'Business Administration', grad: 2026 },
    ];
    const picked = sampleNames[Math.floor(Math.random() * sampleNames.length)];

    setFormData({
      id: `STU-${randomIdNum}`,
      name: picked.name,
      email: picked.email,
      phone: picked.phone,
      major: picked.major,
      graduationYear: picked.grad,
      semester: 'Fall 2026',
      status: 'Active',
      gpa: (3.2 + Math.random() * 0.75).toFixed(2),
      notes: 'Registered via web student onboarding portal.',
    });
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleGenerateId = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, id: `STU-${num}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation checks
    if (!formData.id.trim()) {
      setErrorMsg('Please enter a valid Student ID');
      return;
    }
    if (!formData.name.trim()) {
      setErrorMsg('Please enter the student\'s full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Please enter a contact phone number');
      return;
    }
    if (!formData.major.trim()) {
      setErrorMsg('Please select or specify a major');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          graduationYear: Number(formData.graduationYear),
          gpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || (data.errors ? data.errors.join(', ') : 'Registration failed'));
      }

      setSuccessMsg(`Student "${data.data.name}" (ID: ${data.data.id}) registered successfully!`);
      onStudentAdded(data.data);

      // Reset form with next generated ID
      const nextNum = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        id: `STU-${nextNum}`,
        name: '',
        email: '',
        phone: '',
        major: 'Computer Science',
        graduationYear: 2027,
        semester: 'Fall 2026',
        status: 'Active',
        gpa: '3.80',
        notes: '',
      });
      setIsCustomMajor(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while connecting to the server API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl backdrop-blur-sm">
            <GraduationCap className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Student Registration Form</h2>
            <p className="text-indigo-200/80 text-xs mt-0.5">
              Converted from legacy Java Servlet to modern React &amp; Node.js API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrefill}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-700/60 hover:bg-indigo-700 text-indigo-100 border border-indigo-500/40 transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Quick Prefill Sample
          </button>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Registration Error</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Registration Successful</span>
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        {/* Section 1: Core Identification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
            <IdCard className="w-4 h-4 text-indigo-600" />
            <span>Student Identification &amp; Contact Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Student ID <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateId}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Auto-Gen ID
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g. STU-1001"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Unique institutional student identifier.</p>
            </div>

            {/* Student Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">Legal name as shown on official records.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. alex.rivera@university.edu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">Used for student portal notifications &amp; credentials.</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
              />
              <p className="text-[11px] text-slate-500 mt-1">Contact for emergency and campus verification alerts.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Academic Program Information (The Core Requested Additions) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Academic Program &amp; Cohort Information</span>
            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              New Requested Fields
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Major */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  Major / Degree Program <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomMajor(!isCustomMajor)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                >
                  {isCustomMajor ? 'Choose from list' : 'Custom major'}
                </button>
              </div>

              {isCustomMajor ? (
                <input
                  type="text"
                  required
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  placeholder="Enter custom major..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              ) : (
                <select
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
                >
                  {POPULAR_MAJORS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-[11px] text-slate-500 mt-1">Primary declared undergraduate or graduate major.</p>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Graduation Year <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
              >
                {GRADUATION_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    Class of {yr}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">Anticipated convocation or completion year.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Enrollment Term */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Starting Term
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
              >
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
                <option value="Summer 2027">Summer 2027</option>
                <option value="Fall 2027">Fall 2027</option>
              </select>
            </div>

            {/* GPA */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Current / Target GPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                placeholder="3.80"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Enrollment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition cursor-pointer"
              >
                <option value="Active">Active Student</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Pending">Pending Review</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Form submits via REST API <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded font-mono">POST /api/students</code>
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
                  name: '',
                  email: '',
                  phone: '',
                  major: 'Computer Science',
                  graduationYear: 2027,
                  semester: 'Fall 2026',
                  status: 'Active',
                  gpa: '3.80',
                  notes: '',
                });
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
