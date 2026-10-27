-- =========================================================
-- Student Registration Database Schema (MySQL / PostgreSQL)
-- Converted from: customer(id, name, email, number)
-- =========================================================

-- Create Database (Optional)
-- CREATE DATABASE IF NOT EXISTS student_db;
-- USE student_db;

-- Students Table with required fields:
-- - student_id (Student ID)
-- - name (Full Name)
-- - email (University/Personal Email)
-- - phone_number (Contact Phone)
-- - major (Field of Study)
-- - graduation_year (Expected Graduation Year)
-- - semester (Enrollment term)
-- - status (Active, Enrolled, Graduated)
-- - gpa (Optional Academic performance)
-- - created_at (Timestamp)

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

-- Indexes for fast queries
CREATE INDEX idx_students_major ON students(major);
CREATE INDEX idx_students_grad_year ON students(graduation_year);

-- Initial Sample Insert Statements (PreparedStatement compatible)
INSERT INTO students (student_id, name, email, phone_number, major, graduation_year, semester, status, gpa)
VALUES 
('STU-1001', 'Alex Rivera', 'alex.rivera@university.edu', '+1 (555) 019-2834', 'Computer Science', 2026, 'Fall 2026', 'Active', 3.88),
('STU-1002', 'Sophia Chen', 'sophia.chen@university.edu', '+1 (555) 048-7712', 'Data Science & AI', 2027, 'Spring 2027', 'Active', 3.94),
('STU-1003', 'Marcus Johnson', 'marcus.j@university.edu', '+1 (555) 032-9901', 'Electrical Engineering', 2028, 'Fall 2028', 'Active', 3.65),
('STU-1004', 'Elena Rostova', 'elena.rostova@university.edu', '+1 (555) 077-4433', 'Business Administration', 2026, 'Spring 2026', 'Active', 3.79),
('STU-1005', 'David Kim', 'david.kim@university.edu', '+1 (555) 061-8854', 'Cybersecurity', 2029, 'Fall 2029', 'Active', 3.72)
ON DUPLICATE KEY UPDATE name=VALUES(name);
