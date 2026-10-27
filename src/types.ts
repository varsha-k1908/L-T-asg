export interface Student {
  id: string;
  name: string;
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

export interface StatsData {
  totalCount: number;
  averageGpa: number;
  majorBreakdown: Record<string, number>;
  gradYearBreakdown: Record<string, number>;
}

export const POPULAR_MAJORS = [
  'Computer Science',
  'Data Science & AI',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Business Administration',
  'Cybersecurity',
  'Biomedical Engineering',
  'Information Technology',
  'Mathematics',
  'Software Engineering'
];

export const GRADUATION_YEARS = [2025, 2026, 2027, 2028, 2029, 2030];
