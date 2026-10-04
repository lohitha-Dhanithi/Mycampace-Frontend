// src/services/academicService.js
import { MOCK_ACADEMIC_DATA, MOCK_ACADEMIC_YEARS } from './mockData';

let academicYears = [...MOCK_ACADEMIC_YEARS];
let programs = [...MOCK_ACADEMIC_DATA.programs];
let courses = [...MOCK_ACADEMIC_DATA.courses];
let classes = [...MOCK_ACADEMIC_DATA.classes];
let sections = [...MOCK_ACADEMIC_DATA.sections];
let subjects = [...MOCK_ACADEMIC_DATA.subjects];

export const academicService = {
  getAcademicYears: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return [...academicYears];
  },
  addAcademicYear: async (data) => {
    await new Promise((r) => setTimeout(r, 150));
    const newAy = { id: `ay-${Date.now()}`, isCurrent: false, ...data };
    academicYears = [newAy, ...academicYears];
    return newAy;
  },

  getPrograms: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return [...programs];
  },
  addProgram: async (data) => {
    await new Promise((r) => setTimeout(r, 150));
    const item = { id: `prog-${Date.now()}`, status: 'Active', ...data };
    programs = [item, ...programs];
    return item;
  },

  getCourses: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return [...courses];
  },
  addCourse: async (data) => {
    await new Promise((r) => setTimeout(r, 150));
    const item = { id: `crs-${Date.now()}`, status: 'Active', ...data };
    courses = [item, ...courses];
    return item;
  },

  getClasses: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return [...classes];
  },
  addClass: async (data) => {
    await new Promise((r) => setTimeout(r, 150));
    const item = { id: `cls-${Date.now()}`, sectionsCount: 1, totalStudents: 0, status: 'Active', ...data };
    classes = [item, ...classes];
    return item;
  },

  getSections: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return [...sections];
  },
  addSection: async (data) => {
    await new Promise((r) => setTimeout(r, 150));
    const item = { id: `sec-${Date.now()}`, currentStrength: 0, status: 'Active', ...data };
    sections = [item, ...sections];
    return item;
  },

  getSubjects: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return [...subjects];
  },
  addSubject: async (data) => {
    await new Promise((r) => setTimeout(r, 150));
    const item = { id: `sub-${Date.now()}`, status: 'Active', ...data };
    subjects = [item, ...subjects];
    return item;
  },
};
