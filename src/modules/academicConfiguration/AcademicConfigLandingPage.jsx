// src/modules/academicConfiguration/AcademicConfigLandingPage.jsx
import React, { useState, useEffect } from 'react'
import {
  CalendarDays,
  GraduationCap,
  Building2,
  BookOpen,
  Layers,
  Grid,
  FileSpreadsheet,
  Workflow,
  Award,
  Settings2,
  Database,
  Sliders,
  CheckCircle2,
} from 'lucide-react'
import { AcademicConfigurationHeader } from './components/AcademicConfigurationHeader'
import { AcademicConfigCard } from './components/AcademicConfigCard'
import { academicYearService } from './services/academicYearService'
import { programService } from './services/programService'
import { departmentService } from './services/departmentService'
import { courseService } from './services/courseService'
import { classService } from './services/classService'
import { sectionService } from './services/sectionService'
import { subjectService } from './services/subjectService'
import { curriculumService } from './services/curriculumService'
import { gradingService } from './services/gradingService'

export function AcademicConfigLandingPage() {
  const [counts, setCounts] = useState({
    academicYears: 3,
    currentYear: '2026–2027',
    programs: 7,
    departments: 5,
    courses: 8,
    classes: 6,
    sections: 6,
    subjects: 9,
    curriculums: 2,
    grades: 9,
  })

  useEffect(() => {
    Promise.all([
      academicYearService.getAcademicYears(),
      programService.getPrograms(),
      departmentService.getDepartments(),
      courseService.getCourses(),
      classService.getClasses(),
      sectionService.getSections(),
      subjectService.getSubjects(),
      curriculumService.getCurriculum(),
      gradingService.getGradingConfiguration(),
    ]).then(([ay, prog, dept, crs, cls, sec, subj, curr, grd]) => {
      const current = ay.find((y) => y.isCurrent)
      setCounts({
        academicYears: ay.length,
        currentYear: current ? current.name : '2026–2027',
        programs: prog.length,
        departments: dept.length,
        courses: crs.length,
        classes: cls.length,
        sections: sec.length,
        subjects: subj.length,
        curriculums: curr.length,
        grades: grd.grades.length,
      })
    })
  }, [])

  return (
    <div className="space-y-8">
      <AcademicConfigurationHeader
        title="Academic Configuration"
        subtitle="Configure the academic structure and operational rules for your institution."
      />

      {/* SECTION 1: ACADEMIC STRUCTURE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Layers className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Academic Structure
            </h2>
            <p className="text-xs text-slate-500">
              Foundational hierarchies, degrees, cohorts, and academic units.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AcademicConfigCard
            title="Academic Years"
            description="Manage annual institutional terms, calendar boundaries, and active intake sessions."
            path="/academic-configuration/academic-years"
            icon={CalendarDays}
            badgeText={`${counts.academicYears} configured`}
            highlight={`${counts.currentYear} active`}
            statusText="Session Active"
          />

          <AcademicConfigCard
            title="Departments"
            description="Academic faculties, department heads, faculty rosters, and contact coordinates."
            path="/academic-configuration/departments"
            icon={Building2}
            badgeText={`${counts.departments} departments`}
            statusText="Operational"
          />

          <AcademicConfigCard
            title="Programs"
            description="Degree offerings (Undergraduate, Postgraduate, Diploma) and delivery modes."
            path="/academic-configuration/programs"
            icon={GraduationCap}
            badgeText={`${counts.programs} programs`}
            statusText="Active"
          />

          <AcademicConfigCard
            title="Courses"
            description="Term-level courses and syllabi mapped under degrees and departments."
            path="/academic-configuration/courses"
            icon={BookOpen}
            badgeText={`${counts.courses} courses`}
            statusText="Mapped"
          />

          <AcademicConfigCard
            title="Classes"
            description="Cohort-level academic classes linked to academic years and degree programs."
            path="/academic-configuration/classes"
            icon={Layers}
            badgeText={`${counts.classes} classes`}
            statusText="In Session"
          />

          <AcademicConfigCard
            title="Sections"
            description="Class divisions, classroom allocation, student capacity, and class tutors."
            path="/academic-configuration/sections"
            icon={Grid}
            badgeText={`${counts.sections} sections`}
            statusText="Allocated"
          />

          <AcademicConfigCard
            title="Subjects"
            description="Individual teaching modules (Core, Elective, Practical, Language, Activity)."
            path="/academic-configuration/subjects"
            icon={FileSpreadsheet}
            badgeText={`${counts.subjects} subjects`}
            statusText="Catalogued"
          />

          <AcademicConfigCard
            title="Curriculum"
            description="Semester-by-semester course frameworks and credit distribution schemas."
            path="/academic-configuration/curriculum"
            icon={Workflow}
            badgeText={`${counts.curriculums} frameworks`}
            statusText="Standardized"
          />
        </div>
      </div>

      {/* SECTION 2: ACADEMIC RULES & REFERENCE DATA */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Sliders className="h-5 w-5 text-indigo-600" />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Academic Rules & Master Data
            </h2>
            <p className="text-xs text-slate-500">
              Grading scales, institutional rubrics, and centralized taxonomy catalogues.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AcademicConfigCard
            title="Grading System"
            description="Define score bands, grade letters (O, A+, B), grade points, and GPA rubrics."
            path="/academic-configuration/grading"
            icon={Award}
            badgeText={`${counts.grades} grade levels`}
            highlight="UGC 10-Point"
            statusText="Standard Scale"
          />

          <AcademicConfigCard
            title="Master Data Management"
            description="Centralized reference repositories: blood groups, nationalities, program levels, designations."
            path="/master-data"
            icon={Database}
            badgeText="15 Categories"
            statusText="System-wide"
          />

          <AcademicConfigCard
            title="Academic Settings"
            description="Evaluation schemes, attendance calculation thresholds, and semester transition rules."
            path="/academic-configuration/grading"
            icon={Settings2}
            badgeText="Enforced"
            statusText="Configured"
          />
        </div>
      </div>
    </div>
  )
}
