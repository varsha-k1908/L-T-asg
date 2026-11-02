import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, FileText, Code2, Sparkles } from 'lucide-react';

interface MigrationCompareModalProps {
  onClose: () => void;
}

export const MigrationCompareModal: React.FC<MigrationCompareModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'backend' | 'frontend'>('fields');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Migration &amp; Architecture Comparison</h3>
              <p className="text-xs text-slate-400">
                Legacy Java Servlet (customer registration) ➡️ Modern React + Node.js (student registration)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('fields')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'fields'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Field Mapping &amp; Enhancements
          </button>
          <button
            onClick={() => setActiveTab('backend')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'backend'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Backend: Java Servlet vs. Node.js API
          </button>
          <button
            onClick={() => setActiveTab('frontend')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'frontend'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Frontend: Static HTML vs. React SPA
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'fields' && (
            <div className="space-y-6">
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 leading-relaxed">
                <strong>Migration Overview:</strong> The legacy customer registration form captured 4 fields via HTTP GET to a MySQL table. The converted student registration system includes all core contact fields plus the requested <strong>Student ID</strong>, <strong>Major</strong>, and <strong>Graduation Year</strong>, with full input validation and REST API support.
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-1/3">Original Customer Field</th>
                      <th className="p-3 w-1/12 text-center">Transform</th>
                      <th className="p-3 w-1/3">New Student Field</th>
                      <th className="p-3">Type &amp; Enhancement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-700">Customer Id (id: int)</td>
                      <td className="p-3 text-center text-indigo-600"><ArrowRight className="w-3.5 h-3.5 mx-auto" /></td>
                      <td className="p-3 font-mono font-semibold text-indigo-700">Student ID (id)</td>
                      <td className="p-3 text-slate-600">Alphanumeric string (e.g. STU-1001) with auto-generation and duplicate checking</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-700">Customer Name (name: varchar)</td>
                      <td className="p-3 text-center text-indigo-600"><ArrowRight className="w-3.5 h-3.5 mx-auto" /></td>
                      <td className="p-3 font-mono font-semibold text-indigo-700">Student Name (name)</td>
                      <td className="p-3 text-slate-600">Full legal name with trimming and whitespace sanitization</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-700">Customer Email (email: varchar)</td>
                      <td className="p-3 text-center text-indigo-600"><ArrowRight className="w-3.5 h-3.5 mx-auto" /></td>
                      <td className="p-3 font-mono font-semibold text-indigo-700">Student Email (email)</td>
                      <td className="p-3 text-slate-600">University domain validation and unique email constraint</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-700">Customer Number (number: varchar)</td>
                      <td className="p-3 text-center text-indigo-600"><ArrowRight className="w-3.5 h-3.5 mx-auto" /></td>
                      <td className="p-3 font-mono font-semibold text-indigo-700">Phone Number (phone)</td>
                      <td className="p-3 text-slate-600">Emergency &amp; verification contact with format handling</td>
                    </tr>
                    <tr className="bg-emerald-50/50 hover:bg-emerald-50">
                      <td className="p-3 text-slate-400 italic">None (New)</td>
                      <td className="p-3 text-center text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5 mx-auto" /></td>
                      <td className="p-3 font-mono font-bold text-emerald-700">Major (major)</td>
                      <td className="p-3 text-slate-700 font-medium">Undergraduate / Graduate degree program with dropdown &amp; custom major support</td>
                    </tr>
                    <tr className="bg-emerald-50/50 hover:bg-emerald-50">
                      <td className="p-3 text-slate-400 italic">None (New)</td>
                      <td className="p-3 text-center text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5 mx-auto" /></td>
                      <td className="p-3 font-mono font-bold text-emerald-700">Graduation Year (graduationYear)</td>
                      <td className="p-3 text-slate-700 font-medium">Expected convocation year (e.g. 2026, 2027) with cohort grouping</td>
                    </tr>
                    <tr className="bg-emerald-50/30 hover:bg-emerald-50/60">
                      <td className="p-3 text-slate-400 italic">None (New)</td>
                      <td className="p-3 text-center text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5 mx-auto" /></td>
                      <td className="p-3 font-mono text-slate-800">Term, GPA &amp; Status</td>
                      <td className="p-3 text-slate-600">Semester enrollment, GPA tracking, and status badge generator</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'backend' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-3 font-semibold text-xs text-slate-700 border-b flex items-center justify-between">
                  <span>Legacy Java Servlet (customerservlet.java)</span>
                  <span className="text-[10px] text-amber-600 font-mono">Tomcat / JDBC</span>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-300 font-mono text-[11px] overflow-auto h-[400px]">
{`@WebServlet("/addcustomer")
public class customerservlet extends HttpServlet {
  @Override
  protected void doGet(HttpServletRequest req,
                       HttpServletResponse resp) {
    int customerID = Integer.parseInt(req.getParameter("id"));
    String customerName = req.getParameter("name");
    String customerEmail = req.getParameter("email");
    String customerPhonenumber = req.getParameter("number");

    String url = "jdbc:mysql://localhost:3306/customerdb";
    String username = "root";
    String password = "...";

    con = DriverManager.getConnection(url, username, password);
    PreparedStatement stmt = con.prepareStatement(
      "INSERT into customer values(?,?,?,?)"
    );
    stmt.setInt(1, customerID);
    stmt.setString(2, customerName);
    stmt.setString(3, customerEmail);
    stmt.setString(4, customerPhonenumber);
    stmt.executeUpdate();
  }
}`}
                </pre>
              </div>

              <div className="border border-indigo-200 rounded-xl overflow-hidden">
                <div className="bg-indigo-50 p-3 font-semibold text-xs text-indigo-900 border-b border-indigo-200 flex items-center justify-between">
                  <span>New Node.js Express REST API (server.ts)</span>
                  <span className="text-[10px] text-emerald-600 font-mono">TypeScript / Express</span>
                </div>
                <pre className="p-4 bg-slate-900 text-indigo-200 font-mono text-[11px] overflow-auto h-[400px]">
{`// RESTful POST endpoint with validation
app.post('/api/students', (req: Request, res: Response) => {
  const { id, name, email, phone, major, graduationYear } = req.body;

  // Validation
  if (!id || !name || !email || !phone || !major || !graduationYear) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const students = readStudents();
  if (students.some(s => s.id === id)) {
    return res.status(409).json({
      success: false,
      message: 'Student ID already exists'
    });
  }

  const newStudent: Student = {
    id: String(id).trim(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    major: String(major).trim(),
    graduationYear: Number(graduationYear),
    createdAt: new Date().toISOString()
  };

  students.unshift(newStudent);
  writeStudents(students);

  res.status(201).json({
    success: true,
    data: newStudent
  });
});`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'frontend' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 p-3 font-semibold text-xs text-slate-700 border-b">
                  Legacy HTML Form (customerregistration.html)
                </div>
                <pre className="p-4 bg-slate-900 text-slate-300 font-mono text-[11px] overflow-auto h-[400px]">
{`<!DOCTYPE html>
<html lang="en">
<head>
  <title>Customer Registration</title>
</head>
<body>
  <h1>Customer Registration Form</h1>
  <form action="addcustomer">
    <label>Customer Id:</label>
    <input type="text" name="id">
    <br><br>
    <label>Customer Name:</label>
    <input type="text" name="name">
    <br><br>
    <label>Customer Email:</label>
    <input type="text" name="email">
    <br><br>
    <label>Customer Number:</label>
    <input type="text" name="number">
    <br><br>
    <input type="submit" Value="Register">
  </form>
</body>
</html>`}
                </pre>
              </div>

              <div className="border border-indigo-200 rounded-xl overflow-hidden">
                <div className="bg-indigo-50 p-3 font-semibold text-xs text-indigo-900 border-b border-indigo-200">
                  Modern React SPA (StudentForm.tsx)
                </div>
                <pre className="p-4 bg-slate-900 text-indigo-200 font-mono text-[11px] overflow-auto h-[400px]">
{`<form onSubmit={handleSubmit} className="space-y-4">
  {/* Student ID with Auto-generator */}
  <input 
    value={formData.id}
    onChange={e => setFormData({...formData, id: e.target.value})}
    placeholder="e.g. STU-1001"
  />

  {/* Full Name */}
  <input 
    value={formData.name}
    onChange={e => setFormData({...formData, name: e.target.value})}
    placeholder="Full Name"
  />

  {/* Contact: Email & Phone */}
  <input type="email" value={formData.email} />
  <input type="tel" value={formData.phone} />

  {/* Major Dropdown */}
  <select value={formData.major}>
    <option>Computer Science</option>
    <option>Data Science & AI</option>
    <option>Electrical Engineering</option>
  </select>

  {/* Graduation Year */}
  <select value={formData.graduationYear}>
    <option value={2026}>Class of 2026</option>
    <option value={2027}>Class of 2027</option>
  </select>

  <button type="submit">Complete Registration</button>
</form>`}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
