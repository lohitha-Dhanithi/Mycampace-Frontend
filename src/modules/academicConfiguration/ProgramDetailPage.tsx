// src/modules/academicConfiguration/ProgramDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  GraduationCap,
  ArrowLeft,
  Building2,
  BookOpen,
  Layers,
  Sparkles,
  Workflow,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { programService } from './services/programService'
import { departmentService } from './services/departmentService'

export function ProgramDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [program, setProgram] = useState(null)
  const [department, setDepartment] = useState(null)
  const [associated, setAssociated] = useState({ courses: [], classes: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      programService.getProgramById(id),
      programService.getProgramAssociatedEntities(id),
    ]).then(async ([prog, entities]) => {
      if (!prog) {
        setError('Program not found')
      } else {
        setProgram(prog)
        setAssociated(entities)
        if (prog.departmentId) {
          const dept = await departmentService.getDepartmentById(prog.departmentId)
          setDepartment(dept)
        }
      }
      setLoading(false)
    }).catch((err) => {
      setError(err.message || 'Error loading program')
      setLoading(false)
    })
  }, [id])

  if (loading) return <LoadingState />
  if (error || !program) return <ErrorState message={error || 'Program not found'} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0 mt-1"
            onClick={() => navigate('/academic-configuration/programs')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{program.name}</h1>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {program.code}
              </span>
              <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                {program.level}
              </Badge>
              <Badge
                className={
                  program.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }
              >
                {program.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Host Faculty: <strong>{department?.name || 'Department'}</strong> · Delivery:{' '}
              {program.mode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/academic-configuration/curriculum">
            <Button variant="outline" size="sm" className="text-xs">
              <Workflow className="h-3.5 w-3.5 mr-1" />
              View Curriculum Framework
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Duration
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {program.duration} {program.durationUnit}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Degree curriculum length</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Credits
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {program.totalCredits}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Graduation requirement</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Mapped Courses
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {associated.courses.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Syllabus modules</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Active Cohorts
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {associated.classes.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Classes running</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description & Specs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Pedagogical Overview
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {program.description}
          </p>

          <dl className="divide-y divide-slate-100 text-xs pt-2">
            <div className="py-2 flex justify-between">
              <dt className="text-slate-500">Degree Level</dt>
              <dd className="font-semibold text-slate-900">{program.level}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-slate-500">Delivery Mode</dt>
              <dd className="text-slate-900">{program.mode}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-slate-500">Credit System Enabled</dt>
              <dd className="text-blue-700 font-semibold">
                {program.creditSystemEnabled ? 'Yes (CBCS/ECTS)' : 'No'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Associated Classes */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Cohort Classes ({associated.classes.length})
          </h2>
          <div className="space-y-2">
            {associated.classes.map((cls) => (
              <div
                key={cls.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{cls.name}</span>
                  <span className="text-[11px] text-slate-400 block font-mono">{cls.code}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-600 font-medium">{cls.classTeacher}</span>
                  <span className="text-[10px] text-slate-400 block">{cls.sectionCount} sections</span>
                </div>
              </div>
            ))}
            {associated.classes.length === 0 && (
              <p className="text-xs text-slate-400 py-4 text-center">
                No active classes mapped to this program.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
