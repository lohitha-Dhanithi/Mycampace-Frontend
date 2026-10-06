// src/modules/academics/components/SectionAcademicProfile.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  Users2,
  Bookmark,
  Users,
  UserCheck,
  CalendarCheck,
  CheckCircle,
  ArrowLeft,
  ArrowRightLeft,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface SectionAcademicProfileProps {
  section: any
  students?: any[]
  subjects?: any[]
  faculty?: any[]
  onChangeSection?: (sec: any) => void
}

export function SectionAcademicProfile({
  section,
  students = [],
  subjects = [],
  faculty = [],
  onChangeSection,
}: SectionAcademicProfileProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  if (!section) return null

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/academics/sections')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Sections
          </Button>

          <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
            <Users2 className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{section.name}</h1>
              <StatusBadge status={section.status || 'Active'} />
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Class: {section.className} • Class Teacher: {section.classTeacher} • Room: {section.room} • Capacity: {section.currentStrength || 38} / {section.capacity || 40}
            </div>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => navigate('/academics/enrolments')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" /> Reallocate Students
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="students" className="text-xs font-semibold">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="subjects" className="text-xs font-semibold">Subjects ({subjects.length})</TabsTrigger>
          <TabsTrigger value="faculty" className="text-xs font-semibold">Faculty ({faculty.length})</TabsTrigger>
          <TabsTrigger value="timetable" className="text-xs font-semibold">Timetable</TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs font-semibold">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Section Allocation Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Homeroom Room No</span>
                <p className="text-slate-900 font-bold mt-1">{section.room || 'Room 301, Block C'}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Assigned Class Teacher</span>
                <p className="text-slate-900 font-bold mt-1">{section.classTeacher || 'Pooja Iyer'}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Seat Utilization</span>
                <p className="text-slate-900 font-bold font-mono mt-1">
                  {section.currentStrength || 38} of {section.capacity || 40} seats filled
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">Section Roster ({students.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {students.map((stu) => (
                <div key={stu.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{stu.personal?.fullName || stu.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{stu.studentId} • Roll: {stu.rollNumber}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${stu.id}`)} className="text-xs h-7 text-blue-600">
                    SIS Dossier
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Subjects Delivered in Section</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {subjects.map((s) => (
                <div key={s.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.code} • {s.weeklyHours || 6} hrs/week</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/academics/subjects/${s.id}`)} className="text-xs h-7">
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Teaching Faculty Assigned</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {faculty.map((f, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{f.facultyName}</div>
                    <div className="text-[10px] text-slate-400">{f.subjectName} • {f.department}</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {f.assignmentType}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable">
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Weekly Class Period Schedule</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Detailed Monday–Saturday period allocations will be configured in the forthcoming <strong>Timetable Module</strong>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Daily Attendance Roll Call</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Homeroom attendance registers and SMS absence alerts will connect via the forthcoming <strong>Attendance Module</strong>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
