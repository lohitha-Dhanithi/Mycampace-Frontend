// src/modules/academicConfiguration/AcademicYearDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  CalendarDays,
  ArrowLeft,
  Edit,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  Grid,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { SetCurrentYearDialog } from './components/SetCurrentYearDialog'
import { academicYearService } from './services/academicYearService'
import { useTenantContext } from '@/store/TenantContext'

export function AcademicYearDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { setSelectedAcademicYear } = useTenantContext()

  const [academicYear, setAcademicYear] = useState(null)
  const [associated, setAssociated] = useState({ programs: [], classes: [], sections: [] })
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const [currentModalOpen, setCurrentModalOpen] = useState(false)
  const [switchingCurrent, setSwitchingCurrent] = useState(false)
  const [toast, setToast] = useState(location.state?.toast || '')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const loadDetails = async () => {
    try {
      setLoading(true)
      const [ay, entities, logs] = await Promise.all([
        academicYearService.getAcademicYearById(id),
        academicYearService.getAcademicYearAssociatedEntities(id),
        academicYearService.getAcademicYearActivity(id),
      ])

      if (!ay) {
        setError('Academic year not found')
      } else {
        setAcademicYear(ay)
        setAssociated(entities)
        setActivity(logs)
      }
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Error loading academic year details')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetails()
  }, [id])

  const handleSetCurrent = async () => {
    setSwitchingCurrent(true)
    try {
      const updated = await academicYearService.setCurrentAcademicYear(id)
      setSelectedAcademicYear(updated)
      await loadDetails()
      setSwitchingCurrent(false)
      setCurrentModalOpen(false)
      showToast(`Academic Year "${updated.name}" is now the active operational cycle.`)
    } catch (err) {
      setSwitchingCurrent(false)
      alert(err.message || 'Failed to set current academic year')
    }
  }

  if (loading) return <LoadingState />
  if (error || !academicYear) return <ErrorState message={error || 'Academic year not found'} />

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast('')}
            className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0 mt-1"
            onClick={() => navigate('/academic-configuration/academic-years')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{academicYear.name}</h1>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {academicYear.code}
              </span>
              {academicYear.isCurrent ? (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-bold">
                  <Star className="h-3 w-3 mr-1 fill-blue-600 inline" />
                  Current Academic Year
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-slate-600">
                  Standard Session
                </Badge>
              )}
              <Badge
                className={
                  academicYear.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }
              >
                {academicYear.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {academicYear.description || 'Institutional annual academic term and operational boundary.'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {!academicYear.isCurrent && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentModalOpen(true)}
              className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50 font-medium"
            >
              <Star className="h-3.5 w-3.5 mr-1 text-blue-600" />
              Set as Current Year
            </Button>
          )}

          <Link to={`/academic-configuration/academic-years/${id}/edit`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium">
              <Edit className="h-3.5 w-3.5 mr-1" />
              Edit Year
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Start Date
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1">{academicYear.startDate}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Term commencement</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            End Date
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1">{academicYear.endDate}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Term conclusion</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Active Programs
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {associated.programs.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Enrolled degree offerings</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Configured Cohorts
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {associated.classes.length} <span className="text-xs text-slate-400 font-normal">classes</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{associated.sections.length} active sections</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-medium">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="programs" className="text-xs font-medium">
            <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
            Associated Programs ({associated.programs.length})
          </TabsTrigger>
          <TabsTrigger value="classes" className="text-xs font-medium">
            <Layers className="h-3.5 w-3.5 mr-1.5" />
            Classes ({associated.classes.length})
          </TabsTrigger>
          <TabsTrigger value="sections" className="text-xs font-medium">
            <Grid className="h-3.5 w-3.5 mr-1.5" />
            Sections ({associated.sections.length})
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs font-medium">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Academic Session Boundaries
              </h2>
              <dl className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Academic Year</dt>
                  <dd className="font-bold text-slate-900">{academicYear.name}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">System Code</dt>
                  <dd className="font-mono text-slate-900">{academicYear.code}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Start Date</dt>
                  <dd className="font-medium text-slate-900">{academicYear.startDate}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">End Date</dt>
                  <dd className="font-medium text-slate-900">{academicYear.endDate}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Current Active Cycle</dt>
                  <dd className="font-bold text-blue-700">
                    {academicYear.isCurrent ? 'Yes (Primary System Context)' : 'No'}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Admissions Default</dt>
                  <dd className="text-slate-900">
                    {academicYear.defaultForAdmissions ? 'Enabled' : 'Disabled'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Operational Status & Scope
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {academicYear.description}
              </p>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Created Date:</span>
                  <span className="text-slate-700">{academicYear.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Last Modified:</span>
                  <span className="text-slate-700">{academicYear.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* PROGRAMS TAB */}
        <TabsContent value="programs" className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Programs in Session ({associated.programs.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Degree and diploma offerings accepting students for {academicYear.name}.
                </p>
              </div>
              <Link to="/academic-configuration/programs/new">
                <Button size="sm" variant="outline" className="text-xs">
                  + Add Program
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-4">Program</th>
                    <th className="py-2.5 px-4">Code</th>
                    <th className="py-2.5 px-4">Level</th>
                    <th className="py-2.5 px-4">Duration</th>
                    <th className="py-2.5 px-4">Mode</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {associated.programs.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{p.code}</td>
                      <td className="py-3 px-4 text-slate-700">{p.level}</td>
                      <td className="py-3 px-4 text-slate-700">{p.duration} {p.durationUnit}</td>
                      <td className="py-3 px-4 text-slate-700">{p.mode}</td>
                      <td className="py-3 px-4 text-right">
                        <Link to={`/academic-configuration/programs/${p.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:bg-blue-50">
                            View Program
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* CLASSES TAB */}
        <TabsContent value="classes" className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Cohorts / Classes ({associated.classes.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Classes configured for academic year {academicYear.name}.
                </p>
              </div>
              <Link to="/academic-configuration/classes/new">
                <Button size="sm" variant="outline" className="text-xs">
                  + Add Class
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-4">Class Name</th>
                    <th className="py-2.5 px-4">Code</th>
                    <th className="py-2.5 px-4">Class Teacher</th>
                    <th className="py-2.5 px-4">Sections</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {associated.classes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{c.code}</td>
                      <td className="py-3 px-4 text-slate-700">{c.classTeacher}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{c.sectionCount} sections</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* SECTIONS TAB */}
        <TabsContent value="sections" className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Sections & Capacity Utilization ({associated.sections.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Classroom divisions, assigned teachers and seat utilization.
                </p>
              </div>
              <Link to="/academic-configuration/sections/new">
                <Button size="sm" variant="outline" className="text-xs">
                  + Add Section
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-4">Section Name</th>
                    <th className="py-2.5 px-4">Code</th>
                    <th className="py-2.5 px-4">Tutor</th>
                    <th className="py-2.5 px-4">Capacity Utilization</th>
                    <th className="py-2.5 px-4">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {associated.sections.map((s) => {
                    const pct = Math.round((s.currentStudents / s.studentCapacity) * 100)
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{s.code}</td>
                        <td className="py-3 px-4 text-slate-700">{s.classTeacher}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800">
                              {s.currentStudents} / {s.studentCapacity}
                            </span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  pct > 90 ? 'bg-amber-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400">({pct}%)</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{s.roomNumber || '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ACTIVITY TAB */}
        <TabsContent value="activity" className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Academic Year Configuration History</h3>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {activity.map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-600 shadow-xs" />
                  <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{log.action}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                    <div className="text-[11px] text-slate-400">
                      Executed by: <span className="font-medium text-slate-700">{log.performedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      <SetCurrentYearDialog
        open={currentModalOpen}
        onOpenChange={setCurrentModalOpen}
        targetYear={academicYear}
        onConfirm={handleSetCurrent}
        loading={switchingCurrent}
      />
    </div>
  )
}
