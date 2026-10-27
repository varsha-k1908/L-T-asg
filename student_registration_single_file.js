/**
 * ==============================================================================
 * Student Registration System (Single File Standalone Distribution)
 * Converted from Java Tomcat Customer Registration Form
 * Includes: Student ID, Full Name, Email, Phone, Major, and Graduation Year
 * 
 * Technology: Node.js (HTTP / Express-compatible) + Embedded React/Tailwind UI
 * To run:
 *   node student_registration_single_file.js
 * Then open:
 *   http://localhost:3000
 * ==============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'students_data.json');

// Initial seed students
let students = [
  {
    id: "STU-1001",
    name: "Alex Rivera",
    email: "alex.rivera@university.edu",
    phone: "+1 (555) 019-2834",
    major: "Computer Science",
    graduationYear: 2026,
    semester: "Fall 2026",
    status: "Active",
    gpa: 3.88
  },
  {
    id: "STU-1002",
    name: "Sophia Chen",
    email: "sophia.chen@university.edu",
    phone: "+1 (555) 048-7712",
    major: "Data Science & AI",
    graduationYear: 2027,
    semester: "Spring 2027",
    status: "Active",
    gpa: 3.94
  },
  {
    id: "STU-1003",
    name: "Marcus Johnson",
    email: "marcus.j@university.edu",
    phone: "+1 (555) 032-9901",
    major: "Electrical Engineering",
    graduationYear: 2028,
    semester: "Fall 2028",
    status: "Active",
    gpa: 3.65
  }
];

// Persistent load / save
if (fs.existsSync(DATA_FILE)) {
  try {
    students = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {}
}

function persist() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
  } catch (e) {}
}

const HTML_APP = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Registration Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-slate-100 min-h-screen text-slate-800 font-sans">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

    function App() {
      const [students, setStudents] = useState([]);
      const [formData, setFormData] = useState({
        id: 'STU-' + Math.floor(1000 + Math.random() * 9000),
        name: '',
        email: '',
        phone: '',
        major: 'Computer Science',
        graduationYear: 2027,
        status: 'Active'
      });
      const [search, setSearch] = useState('');
      const [message, setMessage] = useState(null);
      const [loading, setLoading] = useState(false);

      const fetchStudents = async () => {
        const res = await fetch('/api/students');
        const data = await res.json();
        setStudents(data);
      };

      useEffect(() => {
        fetchStudents();
      }, []);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
          const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.message || 'Failed to register');
          
          setMessage({ type: 'success', text: 'Student registered: ' + result.data.name + ' (' + result.data.id + ')' });
          setFormData({
            id: 'STU-' + Math.floor(1000 + Math.random() * 9000),
            name: '',
            email: '',
            phone: '',
            major: 'Computer Science',
            graduationYear: 2027,
            status: 'Active'
          });
          fetchStudents();
        } catch (err) {
          setMessage({ type: 'error', text: err.message });
        } finally {
          setLoading(false);
        }
      };

      const handleDelete = async (id) => {
        if (!confirm('Remove student ' + id + '?')) return;
        await fetch('/api/students/' + id, { method: 'DELETE' });
        fetchStudents();
      };

      const filtered = students.filter(s => 
        !search || 
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.major.toLowerCase().includes(search.toLowerCase())
      );

      return (
        <div class="max-w-5xl mx-auto py-8 px-4">
          <header class="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg mb-8 flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold">Student Registration System</h1>
              <p class="text-xs text-indigo-200 mt-1">Full-Stack React + Node.js (with Student ID, Major & Graduation Year)</p>
            </div>
            <div class="text-right">
              <span class="text-2xl font-bold">{students.length}</span>
              <p class="text-xs text-indigo-300">Registered Students</p>
            </div>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Form */}
            <div class="md:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 class="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Register Student</h2>
              
              {message && (
                <div class={'p-3 rounded-xl mb-4 text-xs font-medium ' + (message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200')}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Student ID *</label>
                  <input required class="w-full px-3 py-2 border rounded-xl text-sm font-mono bg-slate-50"
                    value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input required placeholder="Alex Rivera" class="w-full px-3 py-2 border rounded-xl text-sm"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input type="email" required placeholder="alex@univ.edu" class="w-full px-3 py-2 border rounded-xl text-sm"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input required placeholder="+1 (555) 019-2834" class="w-full px-3 py-2 border rounded-xl text-sm"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Major *</label>
                    <select class="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                      value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})}>
                      <option>Computer Science</option>
                      <option>Data Science & AI</option>
                      <option>Electrical Engineering</option>
                      <option>Business Administration</option>
                      <option>Cybersecurity</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Graduation Year *</label>
                    <select class="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                      value={formData.graduationYear} onChange={e => setFormData({...formData, graduationYear: Number(e.target.value)})}>
                      <option value="2025">Class of 2025</option>
                      <option value="2026">Class of 2026</option>
                      <option value="2027">Class of 2027</option>
                      <option value="2028">Class of 2028</option>
                      <option value="2029">Class of 2029</option>
                    </select>
                  </div>
                </div>
                <button type="submit" disabled={loading} class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition">
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </button>
              </form>
            </div>

            {/* List */}
            <div class="md:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div class="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 class="text-lg font-bold text-slate-800">Enrolled Students ({filtered.length})</h2>
                <input type="text" placeholder="Search students..." class="px-3 py-1.5 border rounded-xl text-xs"
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filtered.map(s => (
                  <div key={s.id} class="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex justify-between items-start hover:border-indigo-300 transition">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-sm text-slate-900">{s.name}</span>
                        <span class="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{s.id}</span>
                      </div>
                      <div class="text-xs text-indigo-800 font-medium mt-1">{s.major} &bull; Class of {s.graduationYear}</div>
                      <div class="text-xs text-slate-500 mt-0.5">{s.email} &bull; {s.phone}</div>
                    </div>
                    <button onClick={() => handleDelete(s.id)} class="text-xs text-rose-600 hover:text-rose-800 font-semibold p-1">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const urlParts = req.url.split('?');
  const pathname = urlParts[0];

  // Frontend SPA
  if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML_APP);
    return;
  }

  // API: GET /api/students
  if (req.method === 'GET' && pathname === '/api/students') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(students));
    return;
  }

  // API: POST /api/students
  if (req.method === 'POST' && pathname === '/api/students') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const student = JSON.parse(body);
        if (!student.id || !student.name || !student.email || !student.major || !student.graduationYear) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'All required fields must be supplied' }));
          return;
        }
        if (students.some(s => s.id.toLowerCase() === String(student.id).toLowerCase())) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Student ID already exists' }));
          return;
        }

        const newStudent = {
          id: String(student.id).trim(),
          name: String(student.name).trim(),
          email: String(student.email).trim(),
          phone: String(student.phone || '').trim(),
          major: String(student.major).trim(),
          graduationYear: Number(student.graduationYear),
          createdAt: new Date().toISOString()
        };

        students.unshift(newStudent);
        persist();

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: newStudent }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: err.message }));
      }
    });
    return;
  }

  // API: DELETE /api/students/:id
  if (req.method === 'DELETE' && pathname.startsWith('/api/students/')) {
    const id = pathname.replace('/api/students/', '');
    students = students.filter(s => s.id.toLowerCase() !== id.toLowerCase());
    persist();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Deleted' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Student Registration Portal live at http://localhost:${PORT}`);
});
