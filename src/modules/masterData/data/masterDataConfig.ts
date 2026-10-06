// src/modules/masterData/data/masterDataConfig.js
import {
  Users,
  HeartPulse,
  Flag,
  UserCheck,
  GraduationCap,
  BookOpen,
  FileSpreadsheet,
  CalendarCheck,
  CheckCircle2,
  Globe2,
  MapPin,
  Building2,
  Briefcase,
  Layers,
  Map,
} from 'lucide-react'

export const MASTER_DATA_GROUPS = [
  {
    groupId: 'people',
    title: 'People & Demographic Reference Data',
    description: 'Standard demographic classifications, personal reference markers, and relationship taxonomies.',
    categories: [
      {
        key: 'gender',
        label: 'Gender',
        singular: 'Gender',
        description: 'Gender options used across student admissions, staff profiling, and compliance reports.',
        icon: Users,
      },
      {
        key: 'bloodGroup',
        label: 'Blood Group',
        singular: 'Blood Group',
        description: 'Medical blood group classifications for campus health and emergency protocols.',
        icon: HeartPulse,
      },
      {
        key: 'nationality',
        label: 'Nationality',
        singular: 'Nationality',
        description: 'Citizenship classifications for visa validation and regulatory international student reporting.',
        icon: Flag,
      },
      {
        key: 'relationshipTypes',
        label: 'Relationship Types',
        singular: 'Relationship Type',
        description: 'Guardian and emergency contact relationship definitions.',
        icon: UserCheck,
      },
    ],
  },
  {
    groupId: 'academic',
    title: 'Academic Structure & Classification',
    description: 'Reusable classification vocabularies consumed by Programs, Courses, and Examinations.',
    categories: [
      {
        key: 'programLevels',
        label: 'Program Levels',
        singular: 'Program Level',
        description: 'Institutional degree hierarchy (Undergraduate, Postgraduate, Diploma, etc.).',
        icon: GraduationCap,
      },
      {
        key: 'courseTypes',
        label: 'Course Types',
        singular: 'Course Type',
        description: 'Core, Elective, Audit and Open Elective course designations.',
        icon: BookOpen,
      },
      {
        key: 'subjectTypes',
        label: 'Subject Types',
        singular: 'Subject Type',
        description: 'Pedagogical delivery classification (Theory, Practical, Studio, Language).',
        icon: FileSpreadsheet,
      },
      {
        key: 'evaluationTypes',
        label: 'Evaluation Types',
        singular: 'Evaluation Type',
        description: 'Assessment patterns: CIA, Midterms, End-Sem, Practicals, and Viva.',
        icon: CalendarCheck,
      },
      {
        key: 'attendanceTypes',
        label: 'Attendance Types',
        singular: 'Attendance Type',
        description: 'Daily and session tracking codes (Present, Absent, Excused, On-Duty).',
        icon: CheckCircle2,
      },
    ],
  },
  {
    groupId: 'location',
    title: 'Geographic & Address Reference Data',
    description: 'Normalized geographical entities for student residences, campus sites, and vendor locations.',
    categories: [
      {
        key: 'countries',
        label: 'Countries',
        singular: 'Country',
        description: 'Sovereign nation reference list with ISO alpha-2 codes.',
        icon: Globe2,
      },
      {
        key: 'states',
        label: 'States / Provinces',
        singular: 'State',
        description: 'Administrative sub-national divisions and states.',
        icon: Map,
      },
      {
        key: 'cities',
        label: 'Cities & Municipalities',
        singular: 'City',
        description: 'Normalized urban and municipal regions.',
        icon: MapPin,
      },
    ],
  },
  {
    groupId: 'institution',
    title: 'Institutional & Human Resource Reference Data',
    description: 'Organizational typology, departmental nature, and employee rank structures.',
    categories: [
      {
        key: 'campusTypes',
        label: 'Campus Types',
        singular: 'Campus Type',
        description: 'Classification of physical facilities (Main, Satellite, Tech Centre).',
        icon: Building2,
      },
      {
        key: 'departmentTypes',
        label: 'Department Types',
        singular: 'Department Type',
        description: 'Functional categories for academic and operational units.',
        icon: Layers,
      },
      {
        key: 'designations',
        label: 'Staff & Faculty Designations',
        singular: 'Designation',
        description: 'Academic and administrative employment titles and ranks.',
        icon: Briefcase,
      },
    ],
  },
]

export const ALL_CATEGORIES = MASTER_DATA_GROUPS.flatMap((g) => g.categories)

export function getCategoryConfig(key) {
  return ALL_CATEGORIES.find((c) => c.key === key) || null
}
