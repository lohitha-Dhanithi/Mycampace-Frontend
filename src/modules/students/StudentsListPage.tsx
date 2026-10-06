// src/modules/students/StudentsListPage.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  GraduationCap,
  Plus,
  ArrowRightLeft,
  TrendingUp,
  LogOut,
  Upload,
  Download,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { StudentDashboard } from './components/StudentDashboard'
import { StudentTable } from './components/StudentTable'
import { studentService } from './services/studentService'
import { useTenantContext } from '@/store/TenantContext'
import { academicService } from '@/services/academicService'
import { institutionService } from '@/services/institutionService'

export function StudentsListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('q') || ''

  const { selectedCampus, selectedAcademicYear } = useTenantContext()

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [search, setSearch] = useState(initialSearch)
  const [academicYearFilter, setAcademicYearFilter] = useState('all')
  const [campusFilter, setCampusFilter] = useState('all')
  const [programFilter, setProgramFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Dynamic filter options from academic configuration
  const [academicYears, setAcademicYears] = useState([])
  const [campuses, setCampuses] = useState([])
  const [programs, setPrograms] = useState([])
  const [courses, setCourses] = useState([])
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])

  useEffect(() => {
    const loadAcademicConfig = async () => {
      try {
        const [ays, camps, progs, crss, clss, secs] = await Promise.all([
          academicService.getAcademicYears(),
          institutionService.getCampuses(),
          academicService.getPrograms(),
          academicService.getCourses(),
          academicService.getClasses(),
          academicService.getSections(),
        ])
        setAcademicYears(ays || [])
        setCampuses(camps || [])
        setPrograms(progs || [])
        setCourses(crss || [])
        setClasses(clss || [])
        setSections(secs || [])
      } catch (err) {
        console.error('Error loading academic config for student filters', err)
      }
    }
    loadAcademicConfig()
  }, [])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const data = await studentService.getStudents({
        search,
        academicYearId: academicYearFilter !== 'all' ? academicYearFilter : undefined,
        campusId: campusFilter !== 'all' ? campusFilter : selectedCampus?.id !== 'all' ? selectedCampus?.id : undefined,
        programId: programFilter !== 'all' ? programFilter : undefined,
        classId: classFilter !== 'all' ? classFilter : undefined,
        sectionId: sectionFilter !== 'all' ? sectionFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      })
      setStudents(data)
    } catch (err) {
      console.error('Failed to load students:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [
    search,
    academicYearFilter,
    campusFilter,
    programFilter,
    courseFilter,
    classFilter,
    sectionFilter,
    statusFilter,
    selectedCampus,
    selectedAcademicYear,
  ])

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Admission Number', 'Full Name', 'Class', 'Section', 'Campus', 'Academic Year', 'Status']
    const rows = students.map((s) => [
      s.studentId,
      s.admissionNumber || '',
      s.personal?.fullName || s.name || '',
      s.className || '',
      s.sectionName || '',
      s.campusName || '',
      s.academicYearName || '',
      s.status,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `MyCampace_Students_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Students"
          description="Manage student records, enrolments and the complete student lifecycle."
          breadcrumbs={[{ label: 'People' }, { label: 'Students' }]}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs h-9"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/students/import')}
            className="text-xs h-9"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Import
          </Button>

          <Button
            size="sm"
            onClick={() => navigate('/students/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Student
          </Button>
        </div>
      </div>

      {/* Internal Sub-navigation Links */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-semibold">
        <Link
          to="/students"
          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200"
        >
          All Students
        </Link>
        <Link
          to="/students/transfers"
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" /> Transfers
        </Link>
        <Link
          to="/students/promotions"
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
        >
          <TrendingUp className="w-3.5 h-3.5" /> Academic Promotions
        </Link>
        <Link
          to="/students/exits"
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Exits & Clearances
        </Link>
        <Link
          to="/students/import"
          className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" /> Bulk Import
        </Link>
      </div>

      {/* 6 Production KPI Cards */}
      <StudentDashboard students={students} onAddStudent={() => navigate('/students/new')} />

      {/* Advanced Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Student Directory
          </span>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setAcademicYearFilter('all')
              setCampusFilter('all')
              setProgramFilter('all')
              setCourseFilter('all')
              setClassFilter('all')
              setSectionFilter('all')
              setStatusFilter('all')
            }}
            className="text-[11px] text-blue-600 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {/* Academic Year */}
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">Academic Year</label>
            <Select value={academicYearFilter} onChange={(e) => setAcademicYearFilter(e.target.value)} className="h-8 text-xs">
              <option value="all">All AY</option>
              {academicYears.map((ay) => (
                <option key={ay.id} value={ay.id}>{ay.name}</option>
              ))}
            </Select>
          </div>

          {/* Campus */}
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">Campus</label>
            <Select value={campusFilter} onChange={(e) => setCampusFilter(e.target.value)} className="h-8 text-xs">
              <option value="all">All Campuses</option>
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>

          {/* Program */}
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">Program</label>
            <Select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className="h-8 text-xs">
              <option value="all">All Programs</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>

          {/* Course */}
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">Course</label>
            <Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="h-8 text-xs">
              <option value="all">All Courses</option>
              {courses.map((crs) => (
                <option key={crs.id} value={crs.id}>{crs.name}</option>
              ))}
            </Select>
          </div>

          {/* Class */}
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">Class</label>
            <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="h-8 text-xs">
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </Select>
          </div>

          {/* Section */}
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">Section</label>
            <Select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="h-8 text-xs">
              <option value="all">All Sections</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </Select>
          </div>

          {/* Status */}
          <div>
            <label className="text-[10px] font-medium text-slate-500 block mb-1">Status</label>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 text-xs">
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
              <option value="Transferred">Transferred</option>
              <option value="Graduated">Graduated</option>
              <option value="Exited">Exited</option>
              <option value="Suspended">Suspended</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Production-grade Student Table */}
      <StudentTable
        students={students}
        loading={loading}
        onTransfer={(student) => navigate(`/students/transfers`)}
        onPromote={(student) => navigate(`/students/promotions`)}
        onExit={(student) => navigate(`/students/exits`)}
      />
    </div>
  )
}
