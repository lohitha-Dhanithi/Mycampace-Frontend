// src/services/studentService.js
import { MOCK_STUDENTS } from './mockData';

let students = [...MOCK_STUDENTS];

export const studentService = {
  getStudents: async (filters: any = {}) => {
    await new Promise((r) => setTimeout(r, 150));
    let result = [...students];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.currentClass.toLowerCase().includes(q) ||
          s.parent?.fatherName?.toLowerCase().includes(q) ||
          s.contact?.phone?.includes(q)
      );
    }

    if (filters.classId && filters.classId !== 'all') {
      result = result.filter((s) => s.classId === filters.classId);
    }

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter((s) => s.campusId === filters.campusId);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((s) => s.status === filters.status);
    }

    return result;
  },

  getStudentById: async (id) => {
    await new Promise((r) => setTimeout(r, 150));
    return students.find((s) => s.id === id || s.studentId === id) || students[0];
  },

  createStudent: async (studentData) => {
    await new Promise((r) => setTimeout(r, 250));
    const newStudent = {
      id: `STU-2026-${String(students.length + 1).padStart(3, '0')}`,
      studentId: `STU-${String(students.length + 1).padStart(3, '0')}`,
      status: 'Active',
      admissionYear: '2026–27',
      attendancePercentage: 100,
      feeStatus: 'Paid',
      overallGrade: 'In Progress',
      ...studentData,
      name: `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim(),
    };
    students = [newStudent, ...students];
    return newStudent;
  },

  updateStudent: async (id, updatedData) => {
    await new Promise((r) => setTimeout(r, 200));
    students = students.map((s) => (s.id === id ? { ...s, ...updatedData } : s));
    return students.find((s) => s.id === id);
  },
};
