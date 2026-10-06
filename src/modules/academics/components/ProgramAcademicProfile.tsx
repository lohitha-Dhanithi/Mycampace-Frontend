// src/modules/academics/components/ProgramAcademicProfile.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  GraduationCap,
  BookOpen,
  Bookmark,
  Users,
  UserCheck,
  CalendarDays,
  ArrowLeft,
  Settings,
  Building2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ProgramAcademicProfile({
  program,
  courses = [],
  subjects = [],
  students = [],
  faculty = [],
  events = [],
}) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  if (!program) return null

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/academics/programs')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Programs
          </Button>

          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{program.name}</h1>
              <StatusBadge status={program.status || 'Active'} />
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Code: {program.code} • Level: {program.level} • Duration: {program.duration}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/academics')}
          className="text-xs text-slate-700"
        >
          <Settings className="w-3.5 h-3.5 mr-1.5" /> Program Configuration
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="courses" className="text-xs font-semibold">Courses ({courses.length})</TabsTrigger>
          <TabsTrigger value="subjects" className="text-xs font-semibold">Subjects ({subjects.length})</TabsTrigger>
          <TabsTrigger value="students" className="text-xs font-semibold">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="faculty" className="text-xs font-semibold">Faculty ({faculty.length})</TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs font-semibold">Calendar ({events.length})</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Program Profile & Parameters</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Framework Code</span>
                <p className="text-slate-900 font-bold font-mono mt-1">{program.code}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Academic Level</span>
                <p className="text-slate-900 font-bold mt-1">{program.level}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Standard Duration</span>
                <p className="text-slate-900 font-bold mt-1">{program.duration}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Department</span>
                <p className="text-slate-900 font-bold mt-1">{program.department || 'General Academics'}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Operational Status</span>
                <p className="text-slate-900 font-bold mt-1">{program.status || 'Active'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Courses */}
        <TabsContent value="courses">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Affiliated Courses & Streams</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {courses.map((crs) => (
                <div key={crs.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{crs.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{crs.code} • {crs.department} • Credits: {crs.credits}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/academics/courses/${crs.id}`)} className="text-xs h-7">
                    Open Course
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Subjects */}
        <TabsContent value="subjects">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Program Curriculum Subjects</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {subjects.map((sub) => (
                <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{sub.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{sub.code} • {sub.type} • {sub.weeklyHours || 6} hrs/week</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/academics/subjects/${sub.id}`)} className="text-xs h-7">
                    View Subject
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Students */}
        <TabsContent value="students">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">Enrolled Students in Program</CardTitle>
              <Button size="sm" onClick={() => navigate('/academics/enrolments')} className="text-xs h-7">
                Manage Enrolments
              </Button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {students.map((stu) => (
                <div key={stu.id} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{stu.personal?.fullName || stu.studentName || stu.name}</span>
                    <div className="text-[10px] text-slate-400 font-mono">{stu.studentId || stu.studentNumber} • {stu.className || 'Class 11'}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${stu.id}`)} className="text-xs h-7 text-blue-600">
                    SIS Dossier
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Faculty */}
        <TabsContent value="faculty">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Educators & Teaching Assignments</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {faculty.map((f, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{f.facultyName}</span>
                    <div className="text-[10px] text-slate-400">{f.department} • {f.subjectName} ({f.className})</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {f.assignmentType || 'Primary Teacher'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Calendar */}
        <TabsContent value="calendar">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">Program Milestones & Schedules</CardTitle>
              <Button size="sm" onClick={() => navigate('/academics/academic-calendar')} className="text-xs h-7">
                Open Full Calendar
              </Button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {events.map((evt) => (
                <div key={evt.id} className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{evt.eventName}</span>
                    <div className="text-[10px] text-slate-400">{evt.startDate} • {evt.startTime} • Scope: {evt.scope}</div>
                  </div>
                  <StatusBadge status={evt.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
