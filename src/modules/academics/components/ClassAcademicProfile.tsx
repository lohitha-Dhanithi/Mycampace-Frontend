// src/modules/academics/components/ClassAcademicProfile.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  Layers,
  Users2,
  Bookmark,
  Users,
  UserCheck,
  CheckCircle,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TimetableBoard } from './TimetableBoard'

export function ClassAcademicProfile({
  academicClass,
  sections = [],
  subjects = [],
  students = [],
  faculty = [],
}) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  if (!academicClass) return null

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/academics/classes')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Classes
          </Button>

          <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{academicClass.name}</h1>
              <StatusBadge status={academicClass.status || 'Active'} />
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Code: {academicClass.code} • Program: {academicClass.program} • Campus: {academicClass.campus || 'Hyderabad Main'} • Enrolled: {academicClass.totalStudents} Students
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="sections" className="text-xs font-semibold">Sections ({sections.length})</TabsTrigger>
          <TabsTrigger value="subjects" className="text-xs font-semibold">Subjects ({subjects.length})</TabsTrigger>
          <TabsTrigger value="students" className="text-xs font-semibold">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="faculty" className="text-xs font-semibold">Faculty ({faculty.length})</TabsTrigger>
          <TabsTrigger value="timetable" className="text-xs font-semibold">Timetable</TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs font-semibold">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Class Cohort Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Academic Year</span>
                <p className="text-slate-900 font-bold mt-1">2026–2027</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Active Sections</span>
                <p className="text-slate-900 font-bold mt-1">{sections.length} Classroom Units</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Total Enrolled</span>
                <p className="text-slate-900 font-bold font-mono mt-1">{academicClass.totalStudents} Students</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">Class Sections</CardTitle>
              <Button size="sm" onClick={() => navigate('/academics/sections')} className="text-xs h-7">
                All Sections Directory
              </Button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {sections.map((sec) => (
                <div key={sec.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                      <Users2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{sec.name}</div>
                      <div className="text-[10px] text-slate-400">Class Teacher: {sec.classTeacher} • Room: {sec.room}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-slate-700">
                      {sec.currentStrength} / {sec.capacity}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/academics/sections/${sec.id}`)} className="text-xs h-7">
                      Section View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Class Subjects Curriculum</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {subjects.map((s) => (
                <div key={s.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.code} • {s.weeklyHours || 6} hrs/week</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/academics/subjects/${s.id}`)} className="text-xs h-7">
                    Subject Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Enrolled Student Roster</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {students.map((stu) => (
                <div key={stu.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{stu.personal?.fullName || stu.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{stu.studentId} • Roll: {stu.rollNumber}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${stu.id}`)} className="text-xs h-7 text-blue-600">
                    SIS Record
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Assigned Educators</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {faculty.map((f, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{f.facultyName}</div>
                    <div className="text-[10px] text-slate-400">{f.subjectName} ({f.sectionName})</div>
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
          <TimetableBoard classId={academicClass.id} />
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="py-12 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Classroom Attendance Register</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Daily period-wise student roll calling, biometric logs, and absence alerts will connect here directly via the upcoming <strong>Attendance Module</strong>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
