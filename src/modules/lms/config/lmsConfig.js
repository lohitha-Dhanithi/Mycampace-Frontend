// src/modules/lms/config/lmsConfig.js

export const LMS_COURSE_STATUSES = {
  DRAFT: 'Draft',
  UNDER_REVIEW: 'Under Review',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

export const COURSE_STATUS_CONFIG = {
  [LMS_COURSE_STATUSES.DRAFT]: {
    label: 'Draft',
    badgeVariant: 'secondary',
    color: 'text-slate-600 bg-slate-100 border-slate-200',
    description: 'Course is in development and hidden from students',
  },
  [LMS_COURSE_STATUSES.UNDER_REVIEW]: {
    label: 'Under Review',
    badgeVariant: 'warning',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    description: 'Awaiting departmental / academic coordinator review',
  },
  [LMS_COURSE_STATUSES.PUBLISHED]: {
    label: 'Published',
    badgeVariant: 'success',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    description: 'Live and accessible to enrolled students',
  },
  [LMS_COURSE_STATUSES.ARCHIVED]: {
    label: 'Archived',
    badgeVariant: 'destructive',
    color: 'text-slate-500 bg-slate-100 border-slate-300',
    description: 'Historical archive; read-only for past students',
  },
}

export const DIFFICULTY_LEVELS = [
  { value: 'Beginner', label: 'Beginner', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'Intermediate', label: 'Intermediate', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'Advanced', label: 'Advanced', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
]

export const ENROLLMENT_MODES = [
  {
    value: 'Automatic',
    label: 'Automatic Cohort Sync',
    description: 'Students in the mapped academic class/section are automatically enrolled.',
  },
  {
    value: 'Manual',
    label: 'Manual Instructor Enrollment',
    description: 'Instructors or admins manually enroll students individually or in bulk.',
  },
  {
    value: 'Restricted',
    label: 'Restricted / Prerequisite Only',
    description: 'Enrollment requires approval or specific academic prerequisites.',
  },
]

export const CONTENT_TYPES = [
  { id: 'Text', label: 'Rich Text / Article', icon: 'FileText', color: 'text-blue-600' },
  { id: 'Video', label: 'Interactive Video', icon: 'Video', color: 'text-rose-600' },
  { id: 'PDF', label: 'PDF Document / Notes', icon: 'File', color: 'text-amber-600' },
  { id: 'Document', label: 'Word Document (DOC/DOCX)', icon: 'FileCode', color: 'text-indigo-600' },
  { id: 'Presentation', label: 'Slide Deck (PPT/PPTX)', icon: 'Presentation', color: 'text-orange-600' },
  { id: 'Image', label: 'Infographic / Diagram', icon: 'Image', color: 'text-emerald-600' },
  { id: 'External Link', label: 'External Resource URL', icon: 'ExternalLink', color: 'text-cyan-600' },
  { id: 'Assignment', label: 'Graded Assignment', icon: 'ClipboardList', color: 'text-violet-600' },
  { id: 'Quiz', label: 'Online Quiz / Assessment', icon: 'HelpCircle', color: 'text-teal-600' },
]

export const QUESTION_TYPES = [
  { id: 'multiple_choice', label: 'Multiple Choice (Single Answer)' },
  { id: 'multiple_select', label: 'Multiple Select (Multiple Correct)' },
  { id: 'true_false', label: 'True / False' },
  { id: 'short_answer', label: 'Short Answer (Text)' },
  { id: 'long_answer', label: 'Long Answer / Essay' },
]

export const SUBMISSION_TYPES = [
  { id: 'File Upload', label: 'File Upload (PDF, Word, Images)' },
  { id: 'Text', label: 'Online Text Response' },
  { id: 'Link', label: 'External Link / URL' },
  { id: 'Mixed', label: 'Mixed (File + Text)' },
]

export const SUBMISSION_STATUSES = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  LATE: 'Late',
  GRADED: 'Graded',
  RETURNED: 'Returned',
}

export const ANNOUNCEMENT_PRIORITIES = [
  { value: 'Normal', label: 'Normal Priority', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { value: 'Important', label: 'Important Notice', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { value: 'Urgent', label: 'Urgent Alert', color: 'text-rose-700 bg-rose-50 border-rose-200' },
]

export const PROGRESS_STATUSES = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

export const LMS_PERMISSIONS = {
  VIEW: 'lms.view',
  CREATE: 'lms.create',
  EDIT: 'lms.edit',
  DELETE: 'lms.delete',
  PUBLISH: 'lms.publish',
  MANAGE_CONTENT: 'lms.manage_content',
  MANAGE_STUDENTS: 'lms.manage_students',
  CREATE_ASSIGNMENT: 'lms.create_assignment',
  GRADE_ASSIGNMENT: 'lms.grade_assignment',
  CREATE_QUIZ: 'lms.create_quiz',
  MANAGE_QUIZ: 'lms.manage_quiz',
  VIEW_PROGRESS: 'lms.view_progress',
  VIEW_REPORTS: 'lms.view_reports',
  EXPORT: 'lms.export',
  MANAGE_DISCUSSIONS: 'lms.manage_discussions',
  MANAGE_ANNOUNCEMENTS: 'lms.manage_announcements',
}
