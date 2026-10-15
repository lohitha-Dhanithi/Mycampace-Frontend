// src/services/academicService.ts
// Comprehensive Database-Driven Academic Entity Separation Service
import { MOCK_ACADEMIC_DATA, MOCK_ACADEMIC_YEARS } from './mockData';

const STORAGE_KEY = 'mycampace_academic_structure_v2';

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

let academicYears = stored?.academicYears?.length ? stored.academicYears : [...MOCK_ACADEMIC_YEARS];
let programs = stored?.programs?.length ? stored.programs : [...MOCK_ACADEMIC_DATA.programs];
let courses = stored?.courses?.length ? stored.courses : [...MOCK_ACADEMIC_DATA.courses];
let classes = stored?.classes?.length ? stored.classes : [...MOCK_ACADEMIC_DATA.classes];
let sections = stored?.sections?.length ? stored.sections : [...MOCK_ACADEMIC_DATA.sections];
let subjects = stored?.subjects?.length ? stored.subjects : [...MOCK_ACADEMIC_DATA.subjects];
let curriculum = stored?.curriculum?.length ? stored.curriculum : [...MOCK_ACADEMIC_DATA.curriculum];

function persist() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ academicYears, programs, courses, classes, sections, subjects, curriculum })
  );
}

// Initial sync to storage
persist();

export const academicService = {
  // -------------------------------------------------------------
  // 1. Academic Years
  // -------------------------------------------------------------
  getAcademicYears: async () => {
    await new Promise((r) => setTimeout(r, 60));
    return [...academicYears];
  },
  getAcademicYearById: async (id: string) => {
    await new Promise((r) => setTimeout(r, 40));
    return academicYears.find((y) => y.id === id) || null;
  },
  addAcademicYear: async (data: any) => {
    await new Promise((r) => setTimeout(r, 80));
    const newAy = {
      id: `ay-${Date.now()}`,
      isCurrent: false,
      status: 'Active',
      admissionStatus: 'Open',
      ...data,
    };
    academicYears = [newAy, ...academicYears];
    persist();
    return newAy;
  },
  updateAcademicYear: async (id: string, data: any) => {
    await new Promise((r) => setTimeout(r, 60));
    academicYears = academicYears.map((y) => (y.id === id ? { ...y, ...data } : y));
    persist();
    return academicYears.find((y) => y.id === id) || null;
  },

  // -------------------------------------------------------------
  // 2. Programs (Overall academic pathway or qualification)
  // -------------------------------------------------------------
  getPrograms: async (filters?: { academicYearId?: string; status?: string }) => {
    await new Promise((r) => setTimeout(r, 60));
    let list = [...programs];
    if (filters?.academicYearId) {
      list = list.filter((p) => !p.academicYearId || p.academicYearId === filters.academicYearId);
    }
    if (filters?.status) {
      list = list.filter((p) => p.status === filters.status);
    }
    return list;
  },
  getProgramById: async (id: string) => {
    await new Promise((r) => setTimeout(r, 40));
    return programs.find((p) => p.id === id) || null;
  },
  addProgram: async (data: any) => {
    await new Promise((r) => setTimeout(r, 80));
    if (programs.some((p) => p.code?.toLowerCase() === data.code?.toLowerCase())) {
      throw new Error(`A program with code "${data.code}" already exists.`);
    }
    const item = {
      id: `prog-${Date.now()}`,
      status: 'Active',
      duration: data.duration || `${data.durationYears || 2} Years`,
      durationYears: Number(data.durationYears) || 2,
      admissionAvailable: true,
      intakeCapacity: Number(data.intakeCapacity) || 120,
      coursesCount: 0,
      studentCount: 0,
      ...data,
    };
    programs = [item, ...programs];
    persist();
    return item;
  },
  updateProgram: async (id: string, data: any) => {
    await new Promise((r) => setTimeout(r, 60));
    if (data.code) {
      const duplicate = programs.find((p) => p.id !== id && p.code?.toLowerCase() === data.code?.toLowerCase());
      if (duplicate) throw new Error(`Another program with code "${data.code}" already exists.`);
    }
    programs = programs.map((p) => (p.id === id ? { ...p, ...data } : p));
    persist();
    return programs.find((p) => p.id === id) || null;
  },
  deactivateProgram: async (id: string) => {
    return academicService.updateProgram(id, { status: 'Inactive' });
  },
  deleteProgram: async (id: string) => {
    await new Promise((r) => setTimeout(r, 60));
    programs = programs.filter((p) => p.id !== id);
    persist();
    return true;
  },

  // -------------------------------------------------------------
  // 3. Courses (Distinct curriculum offerings within a program)
  // -------------------------------------------------------------
  getCourses: async (filters?: { programId?: string; status?: string }) => {
    await new Promise((r) => setTimeout(r, 60));
    let list = [...courses];
    if (filters?.programId) {
      list = list.filter((c) => c.programId === filters.programId);
    }
    if (filters?.status) {
      list = list.filter((c) => c.status === filters.status);
    }
    return list;
  },
  getCourseById: async (id: string) => {
    await new Promise((r) => setTimeout(r, 40));
    return courses.find((c) => c.id === id) || null;
  },
  addCourse: async (data: any) => {
    await new Promise((r) => setTimeout(r, 80));
    if (courses.some((c) => c.code?.toLowerCase() === data.code?.toLowerCase())) {
      throw new Error(`A course with code "${data.code}" already exists.`);
    }
    const item = {
      id: `crs-${Date.now()}`,
      status: 'Active',
      admissionAvailable: true,
      intakeCapacity: Number(data.intakeCapacity) || 60,
      credits: Number(data.credits) || 4,
      classesCount: 0,
      subjectsCount: 0,
      studentsCount: 0,
      ...data,
    };
    courses = [item, ...courses];

    // Update parent program courses count
    if (item.programId) {
      programs = programs.map((p) =>
        p.id === item.programId ? { ...p, coursesCount: (p.coursesCount || 0) + 1 } : p
      );
    }

    persist();
    return item;
  },
  updateCourse: async (id: string, data: any) => {
    await new Promise((r) => setTimeout(r, 60));
    if (data.code) {
      const duplicate = courses.find((c) => c.id !== id && c.code?.toLowerCase() === data.code?.toLowerCase());
      if (duplicate) throw new Error(`Another course with code "${data.code}" already exists.`);
    }
    courses = courses.map((c) => (c.id === id ? { ...c, ...data } : c));
    persist();
    return courses.find((c) => c.id === id) || null;
  },
  deactivateCourse: async (id: string) => {
    return academicService.updateCourse(id, { status: 'Inactive' });
  },
  deleteCourse: async (id: string) => {
    await new Promise((r) => setTimeout(r, 60));
    courses = courses.filter((c) => c.id !== id);
    persist();
    return true;
  },

  // -------------------------------------------------------------
  // 4. Classes (Applicable academic level or cohort)
  // -------------------------------------------------------------
  getClasses: async (filters?: { courseId?: string; programId?: string; status?: string }) => {
    await new Promise((r) => setTimeout(r, 60));
    let list = [...classes];
    if (filters?.courseId) {
      list = list.filter((cls) => cls.courseId === filters.courseId);
    }
    if (filters?.programId) {
      list = list.filter((cls) => cls.programId === filters.programId);
    }
    if (filters?.status) {
      list = list.filter((cls) => cls.status === filters.status);
    }
    return list;
  },
  getClassById: async (id: string) => {
    await new Promise((r) => setTimeout(r, 40));
    return classes.find((cls) => cls.id === id) || null;
  },
  addClass: async (data: any) => {
    await new Promise((r) => setTimeout(r, 80));
    if (classes.some((cls) => cls.code?.toLowerCase() === data.code?.toLowerCase())) {
      throw new Error(`A class with code "${data.code}" already exists.`);
    }
    const item = {
      id: `cls-${Date.now()}`,
      sectionsCount: 0,
      totalStudents: 0,
      status: 'Active',
      campus: data.campus || 'Hyderabad Main Campus',
      levelOrder: Number(data.levelOrder) || 1,
      ...data,
    };
    classes = [item, ...classes];

    // Update parent course classesCount
    if (item.courseId) {
      courses = courses.map((c) =>
        c.id === item.courseId ? { ...c, classesCount: (c.classesCount || 0) + 1 } : c
      );
    }

    persist();
    return item;
  },
  updateClass: async (id: string, data: any) => {
    await new Promise((r) => setTimeout(r, 60));
    if (data.code) {
      const duplicate = classes.find((cls) => cls.id !== id && cls.code?.toLowerCase() === data.code?.toLowerCase());
      if (duplicate) throw new Error(`Another class with code "${data.code}" already exists.`);
    }
    classes = classes.map((cls) => (cls.id === id ? { ...cls, ...data } : cls));
    persist();
    return classes.find((cls) => cls.id === id) || null;
  },
  deactivateClass: async (id: string) => {
    return academicService.updateClass(id, { status: 'Inactive' });
  },
  deleteClass: async (id: string) => {
    await new Promise((r) => setTimeout(r, 60));
    classes = classes.filter((cls) => cls.id !== id);
    persist();
    return true;
  },

  // -------------------------------------------------------------
  // 5. Sections (Divisions within a class or cohort)
  // -------------------------------------------------------------
  getSections: async (filters?: { classId?: string; courseId?: string; status?: string }) => {
    await new Promise((r) => setTimeout(r, 60));
    let list = [...sections];
    if (filters?.classId) {
      list = list.filter((s) => s.classId === filters.classId);
    }
    if (filters?.courseId) {
      list = list.filter((s) => s.courseId === filters.courseId);
    }
    if (filters?.status) {
      list = list.filter((s) => s.status === filters.status);
    }
    return list;
  },
  getSectionById: async (id: string) => {
    await new Promise((r) => setTimeout(r, 40));
    return sections.find((s) => s.id === id) || null;
  },
  addSection: async (data: any) => {
    await new Promise((r) => setTimeout(r, 80));
    const item = {
      id: `sec-${Date.now()}`,
      currentStrength: 0,
      capacity: Number(data.capacity) || 40,
      status: 'Active',
      ...data,
    };
    sections = [item, ...sections];

    // Update parent class sectionsCount
    classes = classes.map((cls) => {
      const matches = item.classId ? cls.id === item.classId : cls.name === item.className;
      if (!matches) return cls;
      return { ...cls, sectionsCount: Number(cls.sectionsCount || 0) + 1 };
    });

    persist();
    return item;
  },
  updateSection: async (id: string, data: any) => {
    await new Promise((r) => setTimeout(r, 60));
    sections = sections.map((item) => (item.id === id ? { ...item, ...data } : item));
    persist();
    return sections.find((item) => item.id === id) || null;
  },
  deactivateSection: async (id: string) => {
    return academicService.updateSection(id, { status: 'Inactive' });
  },
  deleteSection: async (id: string) => {
    await new Promise((r) => setTimeout(r, 60));
    sections = sections.filter((s) => s.id !== id);
    persist();
    return true;
  },

  // -------------------------------------------------------------
  // 6. Subjects (Independent master entities)
  // -------------------------------------------------------------
  getSubjects: async (filters?: { department?: string; status?: string }) => {
    await new Promise((r) => setTimeout(r, 60));
    let list = [...subjects];
    if (filters?.department) {
      list = list.filter((sub) => sub.department === filters.department);
    }
    if (filters?.status) {
      list = list.filter((sub) => sub.status === filters.status);
    }
    return list;
  },
  getSubjectById: async (id: string) => {
    await new Promise((r) => setTimeout(r, 40));
    return subjects.find((sub) => sub.id === id) || null;
  },
  addSubject: async (data: any) => {
    await new Promise((r) => setTimeout(r, 80));
    if (subjects.some((sub) => sub.code?.toLowerCase() === data.code?.toLowerCase())) {
      throw new Error(`A subject with code "${data.code}" already exists.`);
    }
    const item = {
      id: `sub-${Date.now()}`,
      status: 'Active',
      type: data.type || 'Theory',
      credits: Number(data.credits) || 4,
      weeklyHours: Number(data.weeklyHours) || 5,
      ...data,
    };
    subjects = [item, ...subjects];
    persist();
    return item;
  },
  updateSubject: async (id: string, data: any) => {
    await new Promise((r) => setTimeout(r, 60));
    if (data.code) {
      const duplicate = subjects.find((sub) => sub.id !== id && sub.code?.toLowerCase() === data.code?.toLowerCase());
      if (duplicate) throw new Error(`Another subject with code "${data.code}" already exists.`);
    }
    subjects = subjects.map((sub) => (sub.id === id ? { ...sub, ...data } : sub));
    persist();
    return subjects.find((sub) => sub.id === id) || null;
  },
  deactivateSubject: async (id: string) => {
    return academicService.updateSubject(id, { status: 'Inactive' });
  },
  deleteSubject: async (id: string) => {
    await new Promise((r) => setTimeout(r, 60));
    subjects = subjects.filter((sub) => sub.id !== id);
    curriculum = curriculum.filter((c) => c.subjectId !== id);
    persist();
    return true;
  },

  // -------------------------------------------------------------
  // 7. Curriculum Subject Mappings (Course/Class -> Subjects)
  // -------------------------------------------------------------
  getCurriculum: async (filters?: { courseId?: string; classId?: string; subjectType?: string }) => {
    await new Promise((r) => setTimeout(r, 50));
    let list = [...curriculum];
    if (filters?.courseId) {
      list = list.filter((m) => m.courseId === filters.courseId);
    }
    if (filters?.classId) {
      list = list.filter((m) => !m.classId || m.classId === filters.classId);
    }
    if (filters?.subjectType) {
      list = list.filter((m) => m.subjectType === filters.subjectType);
    }
    return list;
  },
  addCurriculumMapping: async (data: {
    courseId: string;
    classId?: string;
    subjectId: string;
    subjectType: 'Compulsory' | 'Elective' | 'Optional';
    credits?: number;
  }) => {
    await new Promise((r) => setTimeout(r, 60));
    const subject = subjects.find((s) => s.id === data.subjectId);
    const existing = curriculum.find(
      (m) => m.courseId === data.courseId && m.subjectId === data.subjectId && m.classId === data.classId
    );
    if (existing) {
      throw new Error('This subject is already mapped to the specified course/class.');
    }
    const item = {
      id: `cur-${Date.now()}`,
      courseId: data.courseId,
      classId: data.classId,
      subjectId: data.subjectId,
      subjectName: subject?.name || 'Subject',
      subjectCode: subject?.code || '',
      subjectType: data.subjectType,
      credits: data.credits || subject?.credits || 4,
    };
    curriculum = [...curriculum, item];
    persist();
    return item;
  },
  removeCurriculumMapping: async (id: string) => {
    await new Promise((r) => setTimeout(r, 50));
    curriculum = curriculum.filter((m) => m.id !== id);
    persist();
    return true;
  },
  getCompulsorySubjects: async (courseId?: string, classId?: string) => {
    return academicService.getCurriculum({ courseId, classId, subjectType: 'Compulsory' });
  },
  getElectiveSubjects: async (courseId?: string, classId?: string) => {
    return academicService.getCurriculum({ courseId, classId, subjectType: 'Elective' });
  },

  // -------------------------------------------------------------
  // 8. Cascading Hierarchy Validation for Admissions & Enrolment
  // -------------------------------------------------------------
  validateAcademicHierarchy: async (selection: {
    academicYearId?: string;
    programId?: string;
    courseId?: string;
    classId?: string;
    selectedElectiveIds?: string[];
  }) => {
    const errors: string[] = [];
    if (!selection.academicYearId) {
      errors.push('Academic year is required.');
    }
    if (!selection.programId) {
      errors.push('Academic program is required.');
    } else {
      const prog = programs.find((p) => p.id === selection.programId);
      if (!prog || prog.status !== 'Active') {
        errors.push('Selected academic program is invalid or inactive.');
      }
    }

    if (!selection.courseId) {
      errors.push('Course stream is required.');
    } else {
      const crs = courses.find((c) => c.id === selection.courseId);
      if (!crs || crs.status !== 'Active') {
        errors.push('Selected course stream is invalid or inactive.');
      } else if (selection.programId && crs.programId !== selection.programId) {
        errors.push('Selected course stream does not belong to the selected academic program.');
      }
    }

    if (selection.classId) {
      const cls = classes.find((c) => c.id === selection.classId);
      if (!cls || cls.status !== 'Active') {
        errors.push('Selected class/cohort is invalid or inactive.');
      } else if (selection.courseId && cls.courseId && cls.courseId !== selection.courseId) {
        errors.push('Selected class does not belong to the selected course offering.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
