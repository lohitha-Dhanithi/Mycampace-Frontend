// src/modules/academics/AcademicConfigPage.jsx
import React, { useState, useEffect } from 'react'
import {
  CalendarDays,
  GraduationCap,
  BookOpen,
  Layers,
  Grid,
  FileSpreadsheet,
  Plus,
  CheckCircle2,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { academicService } from '@/services/academicService'
import { useLocation, useNavigate } from 'react-router-dom'

export function AcademicConfigPage({ defaultTab }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine active tab from URL or prop
  const currentTab =
    defaultTab ||
    (location.pathname.includes('programs')
      ? 'programs'
      : location.pathname.includes('courses')
      ? 'courses'
      : location.pathname.includes('classes')
      ? 'classes'
      : location.pathname.includes('sections')
      ? 'sections'
      : location.pathname.includes('subjects')
      ? 'subjects'
      : 'years')

  const [activeTab, setActiveTab] = useState(currentTab)
  const [academicYears, setAcademicYears] = useState([])
  const [programs, setPrograms] = useState([])
  const [courses, setCourses] = useState([])
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Quick add dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', code: '' })

  const loadData = async () => {
    setLoading(true)
    const [ay, prg, crs, cls, sec, sub] = await Promise.all([
      academicService.getAcademicYears(),
      academicService.getPrograms(),
      academicService.getCourses(),
      academicService.getClasses(),
      academicService.getSections(),
      academicService.getSubjects(),
    ])
    setAcademicYears(ay)
    setPrograms(prg)
    setCourses(crs)
    setClasses(cls)
    setSections(sec)
    setSubjects(sub)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (activeTab === 'years') {
      await academicService.addAcademicYear({
        name: formData.name,
        startDate: '2027-06-01',
        endDate: '2028-04-30',
        status: 'Upcoming',
        admissionStatus: 'Pre-registration',
      })
    } else if (activeTab === 'programs') {
      await academicService.addProgram({
        name: formData.name,
        code: formData.code,
        level: 'Secondary',
        duration: '3 Years',
      })
    } else if (activeTab === 'classes') {
      await academicService.addClass({
        name: formData.name,
        code: formData.code,
        program: 'Secondary Education',
      })
    } else if (activeTab === 'sections') {
      await academicService.addSection({
        name: formData.name,
        className: 'Class 10',
        room: 'Room 108',
        classTeacher: 'Faculty TBD',
        capacity: 40,
      })
    } else if (activeTab === 'subjects') {
      await academicService.addSubject({
        name: formData.name,
        code: formData.code,
        department: 'Science',
        type: 'Theory',
        credits: 4,
      })
    }
    setDialogOpen(false)
    setFormData({ name: '', code: '' })
    loadData()
  }

  // Columns for Academic Years
  const yearColumns = [
    { header: 'Academic Year', accessor: 'name', sortable: true, className: 'whitespace-nowrap min-w-[180px]' },
    { header: 'Start Date', accessor: 'startDate', className: 'whitespace-nowrap min-w-[130px]' },
    { header: 'End Date', accessor: 'endDate', className: 'whitespace-nowrap min-w-[130px]' },
    {
      header: 'Is Current',
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (row) =>
        row.isCurrent ? (
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 whitespace-nowrap">
            Active Session
          </span>
        ) : (
          <span className="text-slate-400 text-xs whitespace-nowrap">No</span>
        ),
    },
    {
      header: 'Admission Status',
      accessor: 'admissionStatus',
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (row) => <StatusBadge status={row.admissionStatus} />,
    },
    {
      header: 'Status',
      accessor: 'status',
      className: 'whitespace-nowrap min-w-[100px]',
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ]

  // Columns for Programs
  const programColumns = [
    { header: 'Program Name', accessor: 'name', sortable: true, className: 'min-w-[240px]' },
    { header: 'Code', accessor: 'code', className: 'whitespace-nowrap min-w-[120px]', cell: (r) => <span className="font-mono text-xs">{r.code}</span> },
    { header: 'Academic Level', accessor: 'level', className: 'whitespace-nowrap min-w-[180px]' },
    { header: 'Duration', accessor: 'duration', className: 'whitespace-nowrap min-w-[110px]' },
    { header: 'Status', accessor: 'status', className: 'whitespace-nowrap min-w-[90px]', cell: (r) => <StatusBadge status={r.status} /> },
  ]

  // Columns for Classes
  const classColumns = [
    { header: 'Class / Grade', accessor: 'name', sortable: true, className: 'min-w-[200px]' },
    { header: 'Class Code', accessor: 'code', className: 'whitespace-nowrap min-w-[110px]', cell: (r) => <span className="font-mono text-xs">{r.code}</span> },
    { header: 'Program', accessor: 'program', className: 'whitespace-nowrap min-w-[200px]' },
    { header: 'Active Sections', accessor: 'sectionsCount', className: 'whitespace-nowrap min-w-[120px]' },
    { header: 'Total Students', accessor: 'totalStudents', className: 'whitespace-nowrap min-w-[120px]' },
    { header: 'Status', accessor: 'status', className: 'whitespace-nowrap min-w-[90px]', cell: (r) => <StatusBadge status={r.status} /> },
  ]

  // Columns for Sections
  const sectionColumns = [
    { header: 'Section', accessor: 'name', sortable: true, className: 'min-w-[200px]' },
    { header: 'Class', accessor: 'className', className: 'whitespace-nowrap min-w-[140px]' },
    { header: 'Classroom', accessor: 'room', className: 'whitespace-nowrap min-w-[140px]' },
    { header: 'Class Teacher', accessor: 'classTeacher', className: 'whitespace-nowrap min-w-[170px]' },
    {
      header: 'Occupancy',
      className: 'whitespace-nowrap min-w-[140px]',
      cell: (r) => (
        <span className="font-semibold text-xs text-slate-800 whitespace-nowrap">
          {r.currentStrength} / {r.capacity} seats
        </span>
      ),
    },
    { header: 'Status', accessor: 'status', className: 'whitespace-nowrap min-w-[90px]', cell: (r) => <StatusBadge status={r.status} /> },
  ]

  // Columns for Subjects
  const subjectColumns = [
    { header: 'Subject Name', accessor: 'name', sortable: true, className: 'min-w-[240px]' },
    { header: 'Code', accessor: 'code', className: 'whitespace-nowrap min-w-[110px]', cell: (r) => <span className="font-mono text-xs">{r.code}</span> },
    { header: 'Department', accessor: 'department', className: 'whitespace-nowrap min-w-[150px]' },
    { header: 'Type', accessor: 'type', className: 'whitespace-nowrap min-w-[120px]' },
    { header: 'Credits / Hours', className: 'whitespace-nowrap min-w-[160px]', cell: (r) => `${r.credits} Credits (${r.weeklyHours || 5}h/wk)` },
    { header: 'Status', accessor: 'status', className: 'whitespace-nowrap min-w-[90px]', cell: (r) => <StatusBadge status={r.status} /> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Configuration"
        subtitle="Manage institutional academic structures: sessions, programs, grades, sections and subject curricula"
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add New Item
          </Button>
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val)
          navigate(`/app/academics/${val === 'years' ? 'academic-years' : val}`)
        }}
        className="w-full"
      >
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="years">Academic Years ({academicYears.length})</TabsTrigger>
          <TabsTrigger value="programs">Programs ({programs.length})</TabsTrigger>
          <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
          <TabsTrigger value="classes">Classes / Grades ({classes.length})</TabsTrigger>
          <TabsTrigger value="sections">Sections ({sections.length})</TabsTrigger>
          <TabsTrigger value="subjects">Subjects ({subjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="years">
          <DataTable
            columns={yearColumns}
            data={academicYears}
            loading={loading}
            searchPlaceholder="Search academic year sessions..."
            searchKey="name"
          />
        </TabsContent>

        <TabsContent value="programs">
          <DataTable
            columns={programColumns}
            data={programs}
            loading={loading}
            searchPlaceholder="Search programs..."
            searchKey="name"
          />
        </TabsContent>

        <TabsContent value="courses">
          <DataTable
            columns={programColumns}
            data={courses}
            loading={loading}
            searchPlaceholder="Search courses..."
            searchKey="name"
          />
        </TabsContent>

        <TabsContent value="classes">
          <DataTable
            columns={classColumns}
            data={classes}
            loading={loading}
            searchPlaceholder="Search classes / grades..."
            searchKey="name"
          />
        </TabsContent>

        <TabsContent value="sections">
          <DataTable
            columns={sectionColumns}
            data={sections}
            loading={loading}
            searchPlaceholder="Search sections..."
            searchKey="name"
          />
        </TabsContent>

        <TabsContent value="subjects">
          <DataTable
            columns={subjectColumns}
            data={subjects}
            loading={loading}
            searchPlaceholder="Search subjects..."
            searchKey="name"
          />
        </TabsContent>
      </Tabs>

      {/* Add Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader>
          <DialogTitle>Add Academic Entity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <DialogContent className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Title / Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. 2027–28 or Class 11"
                className="h-9 text-xs mt-1"
                required
              />
            </div>
            {activeTab !== 'years' && (
              <div>
                <label className="text-xs font-semibold text-slate-700">Code</label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. PROG-01 or BIO-044"
                  className="h-9 text-xs mt-1 uppercase font-mono"
                  required
                />
              </div>
            )}
          </DialogContent>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Record
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}
