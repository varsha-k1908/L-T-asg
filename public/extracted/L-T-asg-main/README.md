# Student Registration System (React + Node.js)

Converted from legacy Tomcat Java Servlet Customer Registration Form (`customerservlet.java` and `customerregistration.html`).

---

## 🚀 Added & Converted Fields

| Legacy Field | Converted Student Field | Type | Description |
| :--- | :--- | :--- | :--- |
| `id` (int) | **`studentId` / `id`** | Alphanumeric (String) | Institutional Student Identifier (e.g., `STU-1001`) |
| `name` (varchar) | **`name`** | String | Legal Full Name |
| `email` (varchar) | **`email`** | String (Email format) | Official student university email |
| `number` (varchar) | **`phone`** | String | Contact & emergency phone number |
| *None (New)* | **`major`** | String | Declared Major / Degree Program (e.g., Computer Science, Data Science) |
| *None (New)* | **`graduationYear`** | Number (Integer) | Expected graduation year (e.g., 2026, 2027) |
| *None (New)* | **`semester`** | String | Starting academic term (e.g. Fall 2026) |
| *None (New)* | **`status`** | String | Enrollment status (Active, Enrolled, Graduated) |

---

## 🛠 Tech Stack

- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Vite
- **Backend API**: Node.js, Express, TypeScript / tsx
- **Database / Storage**: REST API with persistent JSON store and ready-to-run MySQL/PostgreSQL `schema.sql`

---

## 📁 Project Structure

```text
├── server.ts                       # Node.js Express REST API backend
├── schema.sql                      # Database schema (MySQL / PostgreSQL)
├── student_registration_single_file.js # Standalone zero-dependency bundle
├── package.json                    # Dependencies & npm scripts
├── src/
│   ├── App.tsx                     # Main React Application
│   ├── types.ts                    # TypeScript types & constants
│   ├── components/
│   │   ├── StudentForm.tsx         # Registration Form component
│   │   ├── StudentList.tsx         # Student Directory table & grid
│   │   ├── StudentCardModal.tsx    # Digital Student ID badge
│   │   ├── EditStudentModal.tsx    # Update student modal
│   │   ├── CodeExportModal.tsx     # In-app file viewer & exporter
│   │   └── MigrationCompareModal.tsx # Java vs Node/React comparison
└── data/
    └── students.json               # Persistent student records
```

---

## 💻 How to Run

### Method 1: Full-Stack Dev Server (Recommended)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Method 2: Zero-Dependency Single File
```bash
node student_registration_single_file.js
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📡 REST API Endpoints

- `GET /api/students` - List all students (supports `?search=...&major=...&graduationYear=...`)
- `GET /api/students/:id` - Fetch individual student
- `POST /api/students` - Register a new student with validation
- `PUT /api/students/:id` - Update student details
- `DELETE /api/students/:id` - Remove student record
- `GET /api/stats` - Analytical breakdown by major & graduation year
- `POST /api/reset` - Reset to starter sample records
