// src/modules/academics/components/SubjectAcademicProfile.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  Bookmark,
  Layers,
  UserCheck,
  FileText,
  Users,
  Activity,
  ArrowLeft,
  CalendarCheck,
  CheckCircle,
  FileSpreadsheet,
  MonitorPlay,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function SubjectAcademicProfile({
  subject,
  classes = [],
  faculty = [],
  students = [],
}) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  if (!subject) return null

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/academics/subjects')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Subjects
          </Button>

          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{subject.name}</h1>
              <StatusBadge status={subject.status || 'Active'} />
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Code: {subject.code} • Type: {subject.type} • Department: {subject.department} • Credits: {subject.credits}
            </div>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => navigate('/academics/faculty-assignments')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
        >
          Assign Faculty to Subject
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="classes" className="text-xs font-semibold">Classes ({classes.length})</TabsTrigger>
          <TabsTrigger value="faculty" className="text-xs font-semibold">Faculty ({faculty.length})</TabsTrigger>
          <TabsTrigger value="curriculum" className="text-xs font-semibold">Curriculum</TabsTrigger>
          <TabsTrigger value="students" className="text-xs font-semibold">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs font-semibold">Academic Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Subject Overview & Delivery Parameters</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Subject Code</span>
                <p className="text-slate-900 font-bold font-mono mt-1">{subject.code}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Pedagogical Type</span>
                <p className="text-slate-900 font-bold mt-1">{subject.type}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Weekly Instructional Hours</span>
                <p className="text-slate-900 font-bold mt-1">{subject.weeklyHours || 6} Hours / Week</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Host Department</span>
                <p className="text-slate-900 font-bold mt-1">{subject.department}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Credit Value</span>
                <p className="text-slate-900 font-bold mt-1">{subject.credits} Credits</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Cohorts Enrolled in Subject</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {classes.map((c) => (
                <div key={c.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-400">Classroom Code: {c.code}</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/academics/classes/${c.id}`)} className="text-xs h-7">
                    Open Class
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Educators Teaching This Subject</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {faculty.map((f, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{f.facultyName}</div>
                    <div className="text-[10px] text-slate-400">{f.className} • {f.sectionName}</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {f.assignmentType}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Syllabus & Curriculum Modules</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">Prescribed Curriculum</span>
                <p>Aligned with Central Board of Secondary Education curriculum guidelines.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">Laboratory Component</span>
                <p>Weekly laboratory practical experiments conducted in specialized physics / chemistry labs.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {students.map((stu) => (
                <div key={stu.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{stu.personal?.fullName || stu.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{stu.studentId} • {stu.className || 'Class 11'}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${stu.id}`)} className="text-xs h-7 text-blue-600">
                    SIS Dossier
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Future Operational Module Connections</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Subject Attendance Logs
                </div>
                <p className="text-slate-500 text-[11px]">
                  Period-by-period subject attendance will stream from the Attendance engine.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                  Assessments & Examinations
                </div>
                <p className="text-slate-500 text-[11px]">
                  Term marks entry, grading scales, and report card generation will link directly here.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <MonitorPlay className="w-4 h-4 text-purple-600" />
                  LMS Digital Classroom
                </div>
                <p className="text-slate-500 text-[11px]">
                  Lesson plans, digital study materials, and homework assignments will integrate here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
