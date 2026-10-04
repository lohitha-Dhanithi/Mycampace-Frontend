// src/modules/academics/components/CourseAcademicProfile.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  BookOpen,
  Bookmark,
  Layers,
  Users,
  UserCheck,
  FileText,
  ArrowLeft,
  Settings,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function CourseAcademicProfile({
  course,
  subjects = [],
  classes = [],
  faculty = [],
  students = [],
}) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  if (!course) return null

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/academics/courses')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Courses
          </Button>

          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{course.name}</h1>
              <StatusBadge status={course.status || 'Active'} />
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Code: {course.code} • Department: {course.department} • Credits: {course.credits}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/academics')}
          className="text-xs text-slate-700"
        >
          <Settings className="w-3.5 h-3.5 mr-1.5" /> Edit Configuration
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="subjects" className="text-xs font-semibold">Subjects ({subjects.length})</TabsTrigger>
          <TabsTrigger value="classes" className="text-xs font-semibold">Classes ({classes.length})</TabsTrigger>
          <TabsTrigger value="faculty" className="text-xs font-semibold">Faculty ({faculty.length})</TabsTrigger>
          <TabsTrigger value="students" className="text-xs font-semibold">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="curriculum" className="text-xs font-semibold">Curriculum</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Course Attributes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Course Code</span>
                <p className="text-slate-900 font-bold font-mono mt-1">{course.code}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Department</span>
                <p className="text-slate-900 font-bold mt-1">{course.department}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Academic Credits</span>
                <p className="text-slate-900 font-bold mt-1">{course.credits} Credits</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Mapped Subjects</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {subjects.map((s) => (
                <div key={s.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.code} • {s.type}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/academics/subjects/${s.id}`)} className="text-xs h-7">
                    Subject Details
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Classes Using This Course</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {classes.map((c) => (
                <div key={c.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.code} • Sections: {c.sectionsCount || 4}</div>
                    </div>
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
              <CardTitle className="text-sm font-bold text-slate-900">Teaching Faculty</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {faculty.map((f, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{f.facultyName}</div>
                    <div className="text-[10px] text-slate-400">{f.subjectName} ({f.className})</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {f.assignmentType}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">Enrolled Students</CardTitle>
              <Button size="sm" onClick={() => navigate('/academics/enrolments')} className="text-xs h-7">
                Enrolment Roster
              </Button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {students.map((stu) => (
                <div key={stu.id} className="p-3 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{stu.personal?.fullName || stu.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{stu.studentId} • {stu.className || 'Class 11'}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${stu.id}`)} className="text-xs h-7 text-blue-600">
                    SIS Profile
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Curriculum Framework & Syllabus Structure</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">Board / Council Alignment</span>
                <p>Central Board of Secondary Education (CBSE) Senior Secondary Curriculum 2026–27</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block mb-1">Assessment Scheme</span>
                <p>Theory (70%) + Practical / Internal Assessment (30%), Mid-term Summative Tests and Pre-Board Assessments.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
