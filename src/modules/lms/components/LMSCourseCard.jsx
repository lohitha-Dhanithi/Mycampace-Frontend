// src/modules/lms/components/LMSCourseCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Clock,
  BookOpen,
  Users,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Award,
  Layers,
} from 'lucide-react'
import { CourseProgressBar } from './CourseProgressBar'
import { COURSE_STATUS_CONFIG } from '../config/lmsConfig'

export function LMSCourseCard({
  course,
  isStudentView = false,
  onPublish,
  onArchive,
}) {
  const statusInfo = COURSE_STATUS_CONFIG[course.status] || {
    label: course.status,
    color: 'text-slate-600 bg-slate-100 border-slate-200',
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Thumbnail Banner */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-md shadow-xs ${statusInfo.color}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {course.status}
          </span>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
            {course.difficulty || 'Intermediate'}
          </span>
        </div>

        {/* Academic Mapping Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
          <span className="font-semibold truncate bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
            {course.className} • {course.sectionName || 'All Sections'}
          </span>
          <span className="font-mono text-[11px] text-blue-200 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-400/20">
            {course.courseCode}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <span>{course.subjectName}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {course.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4">
            {course.shortDescription || course.description}
          </p>
        </div>

        <div>
          {/* Progress (if student view or enrolled) */}
          {isStudentView ? (
            <div className="mb-4 pt-2 border-t border-slate-100">
              <CourseProgressBar progress={course.progressPercentage || 0} size="md" />
              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
                <span>{course.currentLesson || 'Next: Problem Set 1'}</span>
                <span className="font-medium text-slate-700">{course.lastActivity || '2 days ago'}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 py-2.5 mb-3 border-y border-slate-100 text-center">
              <div>
                <span className="block text-[11px] text-slate-400">Modules</span>
                <span className="text-xs font-bold text-slate-700">{course.modulesCount || 0}</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400">Lessons</span>
                <span className="text-xs font-bold text-slate-700">{course.lessonsCount || 0}</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400">Students</span>
                <span className="text-xs font-bold text-slate-700">{course.studentCount || 0}</span>
              </div>
            </div>
          )}

          {/* Instructor & Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                {course.instructorName ? course.instructorName.charAt(0) : 'I'}
              </div>
              <div className="truncate">
                <span className="block text-xs font-semibold text-slate-800 truncate">
                  {course.instructorName}
                </span>
                <span className="block text-[10px] text-slate-400 truncate">Instructor</span>
              </div>
            </div>

            {isStudentView ? (
              <Link
                to={`/lms/my-learning/${course.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-xs transition-colors shrink-0"
              >
                <span>Continue</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                to={`/lms/courses/${course.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors shrink-0"
              >
                <span>Manage</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
