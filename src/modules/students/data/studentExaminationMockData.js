// src/modules/students/data/studentExaminationMockData.js

export const INITIAL_STUDENT_EXAMINATIONS = {
  'stu-101': {
    latestExamName: 'Mid-Term Summative Assessment (Term 1)',
    academicYear: '2026-2027',
    term: 'Term 1',
    overallPercentage: 92.4,
    cgpa: 9.4,
    grade: 'A1',
    result: 'Passed with Distinction',
    rank: 3,
    subjects: [
      { subject: 'Advanced Physics', maxMarks: 100, marks: 94, grade: 'A1', gradePoint: 10, result: 'Pass' },
      { subject: 'Chemistry', maxMarks: 100, marks: 91, grade: 'A1', gradePoint: 9.5, result: 'Pass' },
      { subject: 'Mathematics (Calculus)', maxMarks: 100, marks: 98, grade: 'A1', gradePoint: 10, result: 'Pass' },
      { subject: 'English Core', maxMarks: 100, marks: 87, grade: 'A2', gradePoint: 9, result: 'Pass' },
      { subject: 'Computer Science', maxMarks: 100, marks: 92, grade: 'A1', gradePoint: 9.5, result: 'Pass' },
    ],
  },
  'stu-102': {
    latestExamName: 'Mid-Term Summative Assessment (Term 1)',
    academicYear: '2026-2027',
    term: 'Term 1',
    overallPercentage: 88.6,
    cgpa: 8.8,
    grade: 'A2',
    result: 'Passed with Distinction',
    rank: 7,
    subjects: [
      { subject: 'Advanced Physics', maxMarks: 100, marks: 85, grade: 'A2', gradePoint: 8.5, result: 'Pass' },
      { subject: 'Chemistry', maxMarks: 100, marks: 88, grade: 'A2', gradePoint: 9.0, result: 'Pass' },
      { subject: 'Biology', maxMarks: 100, marks: 93, grade: 'A1', gradePoint: 9.5, result: 'Pass' },
      { subject: 'English Core', maxMarks: 100, marks: 89, grade: 'A2', gradePoint: 9, result: 'Pass' },
    ],
  },
}
