// src/types/academic.ts

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment?: string;
  institutionId?: string;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  durationYears?: number;
  totalSemesters?: number;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  credits: number;
  departmentId?: string;
  programId?: string;
  description?: string;
}

export interface ClassSection {
  id: string;
  name: string;
  programId?: string;
  academicYearId?: string;
  capacity?: number;
  enrolled?: number;
}

export interface GradeItem {
  id: string;
  grade: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
  description?: string;
}
