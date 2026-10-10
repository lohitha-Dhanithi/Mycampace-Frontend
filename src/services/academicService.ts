// src/services/academicService.js
import { MOCK_ACADEMIC_DATA, MOCK_ACADEMIC_YEARS } from './mockData';

const STORAGE_KEY = 'mycampace_academic_structure';
const SAMPLE_COURSE_IDS = new Set(['crs-1', 'crs-2', 'crs-3', 'crs-4']);

function withoutSampleCourses(list) {
  return (list || []).filter((course) => !SAMPLE_COURSE_IDS.has(course.id));
}

function readStored() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const stored = readStored();

let academicYears = stored?.academicYears || [...MOCK_ACADEMIC_YEARS];
let programs = stored?.programs || [...MOCK_ACADEMIC_DATA.programs];
let courses = withoutSampleCourses(stored?.courses || MOCK_ACADEMIC_DATA.courses);
let classes = stored?.classes || [...MOCK_ACADEMIC_DATA.classes];
let sections = stored?.sections || [...MOCK_ACADEMIC_DATA.sections];
let subjects = stored?.subjects || [...MOCK_ACADEMIC_DATA.subjects];

function persist() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ academicYears, programs, courses, classes, sections, subjects })
  );
}

if (stored?.courses?.some((course) => SAMPLE_COURSE_IDS.has(course.id))) {
  persist();
}

export const academicService = {
  getAcademicYears: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return [...academicYears];
  },
  addAcademicYear: async (data) => {
    await new Promise((r) => setTimeout(r, 150));
    const newAy = { id: `ay-${Date.now()}`, isCurrent: false, ...data };
    academicYears = [newAy, ...academicYears];
    persist();
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
    persist();
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
    persist();
    return item;
  },

  getClasses: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return [...classes];
  },
  addClass: async (data) => {
    await new Promise((r) => setTimeout(r, 150));
    const item = { id: `cls-${Date.now()}`, sectionsCount: 0, totalStudents: 0, status: 'Active', campus: 'Hyderabad Main Campus', ...data };
    classes = [item, ...classes];
    persist();
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
    classes = classes.map((itemClass) => {
      const matches = item.classId ? itemClass.id === item.classId : itemClass.name === item.className;
      if (!matches) return itemClass;
      return { ...itemClass, sectionsCount: Number(itemClass.sectionsCount || 0) + 1 };
    });
    persist();
    return item;
  },
  updateSection: async (id, data) => {
    await new Promise((r) => setTimeout(r, 80));
    sections = sections.map((item) => (item.id === id ? { ...item, ...data } : item));
    persist();
    return sections.find((item) => item.id === id) || null;
  },

  getSubjects: async () => {
    await new Promise((r) => setTimeout(r, 120));
    return [...subjects];
  },
  addSubject: async (data) => {
    await new Promise((r) => setTimeout(r, 150));
    const item = { id: `sub-${Date.now()}`, status: 'Active', ...data };
    subjects = [item, ...subjects];
    persist();
    return item;
  },
};
