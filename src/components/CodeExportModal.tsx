import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Database, Layers, Terminal } from 'lucide-react';

interface CodeExportModalProps {
  onClose: () => void;
}

type TabKey = 'server' | 'react' | 'sql' | 'package' | 'standalone';

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('server');
  const [copied, setCopied] = useState(false);

  // File contents
  const files: Record<TabKey, { title: string; filename: string; language: string; icon: any; code: string }> = {
    server: {
      title: 'Node.js Express API',
      filename: 'server.ts',
      language: 'typescript',
      icon: Terminal,
      code: `import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export interface Student {
  id: string;             // Student ID
  name: string;           // Full Name
  email: string;          // University Email
  phone: string;          // Contact Phone
  major: string;          // Field of study (NEW)
  graduationYear: number; // Grad Year e.g. 2026 (NEW)
  semester?: string;
  status?: string;
  gpa?: number;
  createdAt: string;
}

function getStudents(): Student[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveStudents(students: Student[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

// 1. GET /api/students (List & Filter)
app.get('/api/students', (req: Request, res: Response) => {
  let list = getStudents();
  const { search, major, graduationYear } = req.query;

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.major.toLowerCase().includes(q));
  }
  if (major && major !== 'All') {
    list = list.filter(s => s.major === major);
  }
  if (graduationYear && graduationYear !== 'All') {
    list = list.filter(s => s.graduationYear === Number(graduationYear));
  }
  res.json({ success: true, count: list.length, data: list });
});

// 2. POST /api/students (Register student)
app.post('/api/students', (req: Request, res: Response) => {
  const { id, name, email, phone, major, graduationYear, semester, status, gpa } = req.body;

  if (!id || !name || !email || !phone || !major || !graduationYear) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled' });
  }

  const list = getStudents();
  if (list.some(s => s.id.toLowerCase() === String(id).toLowerCase())) {
    return res.status(409).json({ success: false, message: 'Student ID already registered' });
  }

  const newStudent: Student = {
    id: String(id).trim(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    major: String(major).trim(),
    graduationYear: Number(graduationYear),
    semester: semester || 'Fall 2026',
    status: status || 'Active',
    gpa: gpa ? Number(gpa) : 3.5,
    createdAt: new Date().toISOString()
  };

  list.unshift(newStudent);
  saveStudents(list);

  res.status(201).json({ success: true, message: 'Student registered successfully', data: newStudent });
});

// 3. DELETE /api/students/:id
app.delete('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const list = getStudents();
  const filtered = list.filter(s => s.id.toLowerCase() !== id.toLowerCase());
  saveStudents(filtered);
  res.json({ success: true, message: 'Student removed' });
});

app.listen(PORT, () => {
  console.log(\`Student Registration API running on http://localhost:\${PORT}\`);
});`,
    },
    react: {
      title: 'React Registration Form',
      filename: 'StudentForm.tsx',
      language: 'tsx',
      icon: Layers,
      code: `import React, { useState } from 'react';

export const StudentForm = ({ onStudentAdded }: { onStudentAdded: (student: any) => void }) => {
  const [formData, setFormData] = useState({
    id: 'STU-1006',
    name: '',
    email: '',
    phone: '',
    major: 'Computer Science',
    graduationYear: 2027,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setMsg(\`Registered: \${data.data.name} (\${data.data.id})\`);
      onStudentAdded(data.data);
      setFormData({
        id: 'STU-' + Math.floor(1000 + Math.random() * 9000),
        name: '',
        email: '',
        phone: '',
        major: 'Computer Science',
        graduationYear: 2027,
      });
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow border space-y-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-slate-800">Student Registration Form</h2>
      {msg && <div className="p-3 bg-indigo-50 text-indigo-800 text-sm rounded-lg">{msg}</div>}

      <div>
        <label className="text-xs font-semibold block mb-1">Student ID *</label>
        <input
          type="text"
          required
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-semibold block mb-1">Full Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-semibold block mb-1">Email Address *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="text-xs font-semibold block mb-1">Phone Number *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Major *</label>
          <select
            value={formData.major}
            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Data Science & AI">Data Science & AI</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold block mb-1">Graduation Year *</label>
          <select
            value={formData.graduationYear}
            onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="2025">Class of 2025</option>
            <option value="2026">Class of 2026</option>
            <option value="2027">Class of 2027</option>
            <option value="2028">Class of 2028</option>
            <option value="2029">Class of 2029</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition"
      >
        {loading ? 'Submitting...' : 'Register Student'}
      </button>
    </form>
  );
};`,
    },
    sql: {
      title: 'Database Schema (MySQL/Postgres)',
      filename: 'schema.sql',
      language: 'sql',
      icon: Database,
      code: `-- Converted from customer(id, name, email, number)
-- To student registration database table

CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone_number VARCHAR(30) NOT NULL,
    major VARCHAR(100) NOT NULL,
    graduation_year INT NOT NULL,
    semester VARCHAR(50) DEFAULT 'Fall 2026',
    status VARCHAR(20) DEFAULT 'Active',
    gpa DECIMAL(3, 2) DEFAULT 3.50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed records
INSERT INTO students (student_id, name, email, phone_number, major, graduation_year)
VALUES
('STU-1001', 'Alex Rivera', 'alex.rivera@university.edu', '+1 (555) 019-2834', 'Computer Science', 2026),
('STU-1002', 'Sophia Chen', 'sophia.chen@university.edu', '+1 (555) 048-7712', 'Data Science & AI', 2027);`,
    },
    package: {
      title: 'package.json',
      filename: 'package.json',
      language: 'json',
      icon: FileCode,
      code: `{
  "name": "student-registration-system",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^8.3.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "tailwindcss": "^4.3.3",
    "tsx": "^4.21.0",
    "typescript": "^7.0.2"
  }
}`,
    },
    standalone: {
      title: 'Standalone Single File (Node + HTML)',
      filename: 'student_registration_standalone.js',
      language: 'javascript',
      icon: Terminal,
      code: `// ==============================================================================
// Complete Standalone Student Registration Server (React UI embedded + Express API)
// Run with: node student_registration_standalone.js
// ==============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

let students = [
  { id: 'STU-1001', name: 'Alex Rivera', email: 'alex@univ.edu', phone: '555-019-2834', major: 'Computer Science', graduationYear: 2026 },
  { id: 'STU-1002', name: 'Sophia Chen', email: 'sophia@univ.edu', phone: '555-048-7712', major: 'Data Science', graduationYear: 2027 }
];

const htmlContent = \`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Student Registration Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen py-10 px-4 font-sans">
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
    <h1 class="text-2xl font-bold text-slate-900 mb-2">Student Registration Form</h1>
    <p class="text-xs text-slate-500 mb-6">Converted from Java Customer Registration Form to Node.js & React</p>
    
    <form id="regForm" class="space-y-4">
      <div>
        <label class="text-xs font-semibold text-slate-700 block mb-1">Student ID</label>
        <input type="text" id="id" required value="STU-1003" class="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50">
      </div>
      <div>
        <label class="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
        <input type="text" id="name" required placeholder="Alex Rivera" class="w-full px-3 py-2 border rounded-lg text-sm">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-semibold text-slate-700 block mb-1">Email</label>
          <input type="email" id="email" required placeholder="alex@univ.edu" class="w-full px-3 py-2 border rounded-lg text-sm">
        </div>
        <div>
          <label class="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
          <input type="text" id="phone" required placeholder="555-019-2834" class="w-full px-3 py-2 border rounded-lg text-sm">
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="text-xs font-semibold text-slate-700 block mb-1">Major</label>
          <select id="major" class="w-full px-3 py-2 border rounded-lg text-sm">
            <option>Computer Science</option>
            <option>Data Science & AI</option>
            <option>Electrical Engineering</option>
            <option>Business Administration</option>
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-slate-700 block mb-1">Graduation Year</label>
          <select id="gradYear" class="w-full px-3 py-2 border rounded-lg text-sm">
            <option>2026</option>
            <option>2027</option>
            <option>2028</option>
            <option>2029</option>
          </select>
        </div>
      </div>
      <button type="submit" class="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700">
        Register Student
      </button>
    </form>
    
    <div class="mt-8 pt-6 border-t border-slate-200">
      <h3 class="font-bold text-sm text-slate-800 mb-3">Registered Students</h3>
      <div id="roster" class="space-y-2 text-xs"></div>
    </div>
  </div>

  <script>
    async function loadStudents() {
      const res = await fetch('/api/students');
      const data = await res.json();
      document.getElementById('roster').innerHTML = data.map(s => 
        \`<div class="p-3 bg-slate-50 border rounded-lg flex justify-between items-center">
          <div><strong>\${s.name}</strong> (\${s.id}) - <span class="text-indigo-600">\${s.major}</span></div>
          <span class="text-slate-500">Class of \${s.graduationYear}</span>
        </div>\`
      ).join('');
    }
    document.getElementById('regForm').onsubmit = async (e) => {
      e.preventDefault();
      const body = {
        id: document.getElementById('id').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        major: document.getElementById('major').value,
        graduationYear: Number(document.getElementById('gradYear').value)
      };
      await fetch('/api/students', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
      document.getElementById('id').value = 'STU-' + Math.floor(1000 + Math.random()*9000);
      loadStudents();
    };
    loadStudents();
  </script>
</body>
</html>\`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  } else if (req.method === 'GET' && req.url === '/api/students') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(students));
  } else if (req.method === 'POST' && req.url === '/api/students') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const student = JSON.parse(body);
      students.unshift(student);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: student }));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}/\`);
});`,
    },
  };

  const currentFile = files[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <FileCode className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Source Code &amp; Exportable Files</h3>
              <p className="text-xs text-slate-400">
                Full-stack React frontend + Node.js backend API + Database schema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition cursor-pointer border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              Download {currentFile.filename}
            </button>
            <a
              href="/student-registration-app.zip"
              download="student-registration-app.zip"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-indigo-200" />
              Download All (.zip)
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-800 border-b border-slate-700 overflow-x-auto">
          {(Object.keys(files) as TabKey[]).map((key) => {
            const item = files[key];
            const Icon = item.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCopied(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.filename}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto bg-slate-950 p-6 font-mono text-xs text-slate-200 leading-relaxed select-text">
          <pre className="whitespace-pre">{currentFile.code}</pre>
        </div>

        {/* Modal Footer info */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span className="font-mono text-indigo-400">{currentFile.filename}</span>
          <span>Click "Copy Code" or "Download" to use anywhere in your local Node.js environment</span>
        </div>
      </div>
    </div>
  );
};
