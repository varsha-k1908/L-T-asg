import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

// Interface definition for Student Record
export interface Student {
  id: string; // Student ID e.g. STU-1001 or numeric
  name: string; // Full Name
  email: string;
  phone: string;
  major: string;
  graduationYear: number;
  semester?: string;
  status?: 'Active' | 'Enrolled' | 'Graduated' | 'Pending';
  gpa?: number;
  createdAt: string;
  notes?: string;
}

const DEFAULT_STUDENTS: Student[] = [
  {
    id: "STU-1001",
    name: "Alex Rivera",
    email: "alex.rivera@university.edu",
    phone: "+1 (555) 019-2834",
    major: "Computer Science",
    graduationYear: 2026,
    semester: "Fall 2026",
    status: "Active",
    gpa: 3.88,
    createdAt: new Date().toISOString()
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
    gpa: 3.94,
    createdAt: new Date().toISOString()
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
    gpa: 3.65,
    createdAt: new Date().toISOString()
  },
  {
    id: "STU-1004",
    name: "Elena Rostova",
    email: "elena.rostova@university.edu",
    phone: "+1 (555) 077-4433",
    major: "Business Administration",
    graduationYear: 2026,
    semester: "Spring 2026",
    status: "Active",
    gpa: 3.79,
    createdAt: new Date().toISOString()
  },
  {
    id: "STU-1005",
    name: "David Kim",
    email: "david.kim@university.edu",
    phone: "+1 (555) 061-8854",
    major: "Cybersecurity",
    graduationYear: 2029,
    semester: "Fall 2029",
    status: "Active",
    gpa: 3.72,
    createdAt: new Date().toISOString()
  }
];

// Helper to read students
function readStudents(): Student[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STUDENTS, null, 2), 'utf-8');
      return DEFAULT_STUDENTS;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Student[];
  } catch (err) {
    console.error('Error reading students file:', err);
    return DEFAULT_STUDENTS;
  }
}

// Helper to write students
function writeStudents(students: Student[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing students file:', err);
  }
}

async function startServer() {
  const app = express();

  // Middleware for JSON parsing and form-encoded data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. GET /api/students - List all students with optional search & filters
  app.get('/api/students', (req: Request, res: Response) => {
    const { search, major, graduationYear } = req.query;
    let list = readStudents();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          s.major.toLowerCase().includes(q)
      );
    }

    if (major && typeof major === 'string' && major !== 'All') {
      list = list.filter((s) => s.major.toLowerCase() === major.toLowerCase());
    }

    if (graduationYear && graduationYear !== 'All') {
      const yr = Number(graduationYear);
      if (!isNaN(yr)) {
        list = list.filter((s) => s.graduationYear === yr);
      }
    }

    res.json({
      success: true,
      count: list.length,
      data: list,
    });
  });

  // 2. GET /api/students/:id - Fetch single student by ID
  app.get('/api/students/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const list = readStudents();
    const student = list.find((s) => s.id.toLowerCase() === id.toLowerCase());

    if (!student) {
      return res.status(404).json({ success: false, message: `Student with ID "${id}" not found` });
    }

    res.json({ success: true, data: student });
  });

  // 3. POST /api/students - Register a new student
  // Accepts JSON or URL-encoded form submissions (similar to original servlet)
  app.post('/api/students', (req: Request, res: Response) => {
    // Accommodate variations: id/studentID, name/customerName, email, phone/number
    const rawId = req.body.id || req.body.studentId || req.body.studentID;
    const rawName = req.body.name || req.body.customerName || req.body.studentName;
    const rawEmail = req.body.email || req.body.customerEmail;
    const rawPhone = req.body.phone || req.body.phoneNumber || req.body.number;
    const rawMajor = req.body.major;
    const rawGraduationYear = req.body.graduationYear || req.body.gradYear;
    const rawSemester = req.body.semester || 'Fall 2026';
    const rawStatus = req.body.status || 'Active';
    const rawGpa = req.body.gpa ? parseFloat(req.body.gpa) : 3.5;
    const rawNotes = req.body.notes || '';

    // Validation
    const errors: string[] = [];
    if (!rawId || String(rawId).trim() === '') errors.push('Student ID is required');
    if (!rawName || String(rawName).trim() === '') errors.push('Full Name is required');
    if (!rawEmail || String(rawEmail).trim() === '') errors.push('Email is required');
    if (!rawPhone || String(rawPhone).trim() === '') errors.push('Phone number is required');
    if (!rawMajor || String(rawMajor).trim() === '') errors.push('Major is required');
    if (!rawGraduationYear) errors.push('Graduation Year is required');

    const gradYearNum = Number(rawGraduationYear);
    if (isNaN(gradYearNum) || gradYearNum < 1950 || gradYearNum > 2100) {
      errors.push('Graduation Year must be a valid 4-digit year (e.g. 2026)');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const students = readStudents();
    const cleanId = String(rawId).trim();
    const cleanEmail = String(rawEmail).trim().toLowerCase();

    // Check duplicate ID
    const existingById = students.find((s) => s.id.toLowerCase() === cleanId.toLowerCase());
    if (existingById) {
      return res.status(409).json({
        success: false,
        message: `A student with Student ID "${cleanId}" already exists.`,
      });
    }

    // Check duplicate Email
    const existingByEmail = students.find((s) => s.email.toLowerCase() === cleanEmail);
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        message: `A student with Email "${cleanEmail}" is already registered.`,
      });
    }

    const newStudent: Student = {
      id: cleanId,
      name: String(rawName).trim(),
      email: String(rawEmail).trim(),
      phone: String(rawPhone).trim(),
      major: String(rawMajor).trim(),
      graduationYear: gradYearNum,
      semester: String(rawSemester).trim(),
      status: (rawStatus as 'Active' | 'Enrolled' | 'Graduated' | 'Pending') || 'Active',
      gpa: isNaN(rawGpa) ? 3.5 : rawGpa,
      notes: String(rawNotes).trim(),
      createdAt: new Date().toISOString(),
    };

    students.unshift(newStudent);
    writeStudents(students);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: newStudent,
    });
  });

  // 4. PUT /api/students/:id - Update existing student
  app.put('/api/students/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const students = readStudents();
    const index = students.findIndex((s) => s.id.toLowerCase() === id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({ success: false, message: `Student with ID "${id}" not found` });
    }

    const current = students[index];
    const { name, email, phone, major, graduationYear, semester, status, gpa, notes } = req.body;

    const updated: Student = {
      ...current,
      name: name !== undefined ? String(name).trim() : current.name,
      email: email !== undefined ? String(email).trim() : current.email,
      phone: phone !== undefined ? String(phone).trim() : current.phone,
      major: major !== undefined ? String(major).trim() : current.major,
      graduationYear: graduationYear !== undefined ? Number(graduationYear) : current.graduationYear,
      semester: semester !== undefined ? String(semester).trim() : current.semester,
      status: status !== undefined ? status : current.status,
      gpa: gpa !== undefined ? Number(gpa) : current.gpa,
      notes: notes !== undefined ? String(notes).trim() : current.notes,
    };

    students[index] = updated;
    writeStudents(students);

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: updated,
    });
  });

  // 5. DELETE /api/students/:id - Delete student record
  app.delete('/api/students/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const students = readStudents();
    const initialLen = students.length;
    const filtered = students.filter((s) => s.id.toLowerCase() !== id.toLowerCase());

    if (filtered.length === initialLen) {
      return res.status(404).json({ success: false, message: `Student with ID "${id}" not found` });
    }

    writeStudents(filtered);
    res.json({
      success: true,
      message: `Student with ID "${id}" was deleted successfully.`,
      remainingCount: filtered.length,
    });
  });

  // 6. GET /api/stats - Analytical stats
  app.get('/api/stats', (_req: Request, res: Response) => {
    const students = readStudents();
    const totalCount = students.length;

    // Major breakdown
    const majorCounts: Record<string, number> = {};
    const gradYearCounts: Record<number, number> = {};
    let totalGpa = 0;
    let gpaCount = 0;

    for (const s of students) {
      majorCounts[s.major] = (majorCounts[s.major] || 0) + 1;
      gradYearCounts[s.graduationYear] = (gradYearCounts[s.graduationYear] || 0) + 1;
      if (s.gpa) {
        totalGpa += s.gpa;
        gpaCount++;
      }
    }

    res.json({
      success: true,
      totalCount,
      averageGpa: gpaCount > 0 ? Number((totalGpa / gpaCount).toFixed(2)) : 0,
      majorBreakdown: majorCounts,
      gradYearBreakdown: gradYearCounts,
    });
  });

  // 7. POST /api/reset - Reset to default seed
  app.post('/api/reset', (_req: Request, res: Response) => {
    writeStudents(DEFAULT_STUDENTS);
    res.json({
      success: true,
      message: 'Database reset to default sample records',
      data: DEFAULT_STUDENTS,
    });
  });

  // 8. Source code provider for quick inspection & download
  app.get('/api/source-code', (_req: Request, res: Response) => {
    try {
      const serverCode = fs.readFileSync(path.join(__dirname, 'server.ts'), 'utf-8');
      const schemaCode = fs.existsSync(path.join(__dirname, 'schema.sql'))
        ? fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
        : '';
      const appCode = fs.existsSync(path.join(__dirname, 'src', 'App.tsx'))
        ? fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf-8')
        : '';

      res.json({
        success: true,
        files: {
          'server.ts': serverCode,
          'schema.sql': schemaCode,
          'App.tsx': appCode,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // ==========================================
  // Vite Integration (Dev) or Static (Prod)
  // ==========================================
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
