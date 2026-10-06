// src/modules/students/data/studentAttendanceMockData.js

export const INITIAL_STUDENT_ATTENDANCE = {
  'stu-101': {
    attendancePercentage: 96.4,
    presentDays: 79,
    absentDays: 2,
    lateDays: 1,
    totalWorkingDays: 82,
    recentLogs: [
      { date: '2026-10-02', status: 'Present', session: 'Full Day Classroom Session' },
      { date: '2026-10-01', status: 'Present', session: 'Full Day Classroom Session' },
      { date: '2026-09-30', status: 'Present', session: 'Full Day Classroom Session' },
      { date: '2026-09-29', status: 'Late', session: 'Late Arrival (08:45 AM)' },
      { date: '2026-09-26', status: 'Present', session: 'Full Day Classroom Session' },
      { date: '2026-09-25', status: 'Absent', session: 'Unexcused Medical Absence' },
    ],
  },
  'stu-102': {
    attendancePercentage: 94.0,
    presentDays: 77,
    absentDays: 4,
    lateDays: 1,
    totalWorkingDays: 82,
    recentLogs: [
      { date: '2026-10-02', status: 'Present', session: 'Full Day Classroom Session' },
      { date: '2026-10-01', status: 'Present', session: 'Full Day Classroom Session' },
      { date: '2026-09-30', status: 'Present', session: 'Full Day Classroom Session' },
    ],
  },
  'stu-103': {
    attendancePercentage: 91.5,
    presentDays: 75,
    absentDays: 5,
    lateDays: 2,
    totalWorkingDays: 82,
    recentLogs: [
      { date: '2026-10-02', status: 'Present', session: 'Full Day Classroom Session' },
      { date: '2026-10-01', status: 'Present', session: 'Full Day Classroom Session' },
    ],
  },
  'stu-104': {
    attendancePercentage: 88.0,
    presentDays: 72,
    absentDays: 8,
    lateDays: 2,
    totalWorkingDays: 82,
    recentLogs: [
      { date: '2026-10-02', status: 'Present', session: 'Full Day Classroom Session' },
    ],
  },
}
