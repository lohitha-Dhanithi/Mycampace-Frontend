// src/modules/academics/services/academicService.js
import { academicService as coreAcademicService } from '@/services/academicService'
import { studentService } from '@/modules/students/services/studentService'
import { facultyAssignmentService } from './facultyAssignmentService'
import { subjectAssignmentService } from './subjectAssignmentService'
import { classTeacherService } from './classTeacherService'
import { enrolmentService } from './enrolmentService'
import { academicCalendarService } from './academicCalendarService'
import { facultyWorkloadService } from './facultyWorkloadService'

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms))

export const academicService = {
  // 1. Academic Overview & Summary Stats
  getAcademicOverview: async () => {
    await delay(120)
    const [progs, crss, clss, secs, subs, students, facultyAssignments] = await Promise.all([
      coreAcademicService.getPrograms(),
      coreAcademicService.getCourses(),
      coreAcademicService.getClasses(),
      coreAcademicService.getSections(),
      coreAcademicService.getSubjects(),
      studentService.getStudents(),
      facultyAssignmentService.getFacultyAssignments(),
    ])

    const totalFaculty = 28 // institutional faculty count
    const uniqueAssignedFaculty = new Set(facultyAssignments.filter((f) => f.status === 'Active').map((f) => f.facultyId)).size
    const assignedSubjectsCount = new Set(facultyAssignments.map((f) => f.subjectId)).size

    return {
      structure: {
        programsCount: progs.length,
        coursesCount: crss.length,
        classesCount: clss.length,
        sectionsCount: secs.length,
        subjectsCount: subs.length,
      },
      teaching: {
        totalFaculty,
        assignedFaculty: uniqueAssignedFaculty,
        unassignedFaculty: Math.max(0, totalFaculty - uniqueAssignedFaculty),
        assignedSubjects: assignedSubjectsCount,
        unassignedSubjects: Math.max(0, subs.length - assignedSubjectsCount),
      },
      students: {
        totalStudents: students.length > 0 ? students.length : 1420,
        byProgram: [
          { name: 'Senior Secondary', count: 665, color: '#3b82f6' },
          { name: 'Secondary Education', count: 755, color: '#6366f1' },
          { name: 'Primary Foundation', count: 420, color: '#10b981' },
        ],
        byClass: [
          { name: 'Class 12', count: 320 },
          { name: 'Class 11', count: 345 },
          { name: 'Class 10', count: 410 },
          { name: 'Class 9', count: 395 },
        ],
        bySection: [
          { name: '12-A', count: 38 },
          { name: '12-B', count: 36 },
          { name: '11-A', count: 39 },
          { name: '10-A', count: 42 },
          { name: '10-B', count: 41 },
        ],
      },
    }
  },

  // 2. Operational Programs
  getAcademicPrograms: async () => {
    return coreAcademicService.getPrograms()
  },
  getAcademicProgramById: async (id) => {
    const list = await coreAcademicService.getPrograms()
    return list.find((p) => p.id === id) || null
  },

  // 3. Operational Courses
  getAcademicCourses: async () => {
    return coreAcademicService.getCourses()
  },
  getAcademicCourseById: async (id) => {
    const list = await coreAcademicService.getCourses()
    return list.find((c) => c.id === id) || null
  },

  // 4. Operational Classes
  getAcademicClasses: async () => {
    return coreAcademicService.getClasses()
  },
  getAcademicClassById: async (id) => {
    const list = await coreAcademicService.getClasses()
    return list.find((c) => c.id === id) || null
  },

  // 5. Operational Sections
  getAcademicSections: async () => {
    return coreAcademicService.getSections()
  },
  getAcademicSectionById: async (id) => {
    const list = await coreAcademicService.getSections()
    return list.find((s) => s.id === id) || null
  },

  // 6. Operational Subjects
  getAcademicSubjects: async () => {
    return coreAcademicService.getSubjects()
  },
  getAcademicSubjectById: async (id) => {
    const list = await coreAcademicService.getSubjects()
    return list.find((s) => s.id === id) || null
  },

  createAcademicProgram: (data) => coreAcademicService.addProgram(data),
  updateAcademicProgram: (id, data) => coreAcademicService.updateProgram(id, data),
  deactivateAcademicProgram: (id) => coreAcademicService.deactivateProgram(id),

  createAcademicCourse: (data) => coreAcademicService.addCourse(data),
  updateAcademicCourse: (id, data) => coreAcademicService.updateCourse(id, data),
  deactivateAcademicCourse: (id) => coreAcademicService.deactivateCourse(id),

  createAcademicClass: (data) => coreAcademicService.addClass(data),
  updateAcademicClass: (id, data) => coreAcademicService.updateClass(id, data),
  deactivateAcademicClass: (id) => coreAcademicService.deactivateClass(id),

  createAcademicSection: (data) => coreAcademicService.addSection(data),
  updateAcademicSection: (id, data) => coreAcademicService.updateSection(id, data),
  deactivateAcademicSection: (id) => coreAcademicService.deactivateSection(id),

  createAcademicSubject: (data) => coreAcademicService.addSubject(data),
  updateAcademicSubject: (id, data) => coreAcademicService.updateSubject(id, data),
  deactivateAcademicSubject: (id) => coreAcademicService.deactivateSubject(id),

  // Curriculum & Subject Mappings
  getCurriculum: (filters) => coreAcademicService.getCurriculum(filters),
  addCurriculumMapping: (data) => coreAcademicService.addCurriculumMapping(data),
  removeCurriculumMapping: (id) => coreAcademicService.removeCurriculumMapping(id),
  getCompulsorySubjects: (courseId, classId) => coreAcademicService.getCompulsorySubjects(courseId, classId),
  getElectiveSubjects: (courseId, classId) => coreAcademicService.getElectiveSubjects(courseId, classId),
  validateAcademicHierarchy: (selection) => coreAcademicService.validateAcademicHierarchy(selection),

  // Facade delegation for specialized services
  ...facultyAssignmentService,
  ...subjectAssignmentService,
  ...classTeacherService,
  ...enrolmentService,
  ...academicCalendarService,
  ...facultyWorkloadService,
}
