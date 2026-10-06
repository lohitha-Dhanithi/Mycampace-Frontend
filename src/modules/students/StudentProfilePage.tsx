// src/modules/students/StudentProfilePage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowLeft,
  Download,
  BookOpen,
  MessageSquare,
  History,
  FileCheck,
  UserCheck,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { studentService } from '@/services/studentService'
import { LoadingState } from '@/components/common/LoadingState'

export function StudentProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true)
      const data = await studentService.getStudentById(id)
      setStudent(data)
      setLoading(false)
    }
    fetchStudent()
  }, [id])

  if (loading) {
    return <LoadingState message="Fetching student profile dossier..." />
  }

  if (!student) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">Student record not found.</p>
        <Button size="sm" onClick={() => navigate('/students')} className="mt-4">
          Return to Student Directory
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Profile Summary Card */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/students')}
          className="text-xs text-slate-500 hover:text-slate-800 mb-3 -ml-2"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Student Registry
        </Button>

        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-blue-900 via-slate-800 to-indigo-900" />
          <CardContent className="p-5 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-4">
              <div className="flex items-end gap-3.5">
                <Avatar
                  src={student.avatar}
                  alt={student.name}
                  fallback={student.name.substring(0, 2)}
                  size="xl"
                  className="ring-4 ring-white shadow-md"
                />
                <div className="mb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
                    <StatusBadge status={student.status} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-mono font-bold text-blue-600">ID: {student.studentId}</span>
                    <span>•</span>
                    <span>{student.currentClass} — {student.section}</span>
                    <span>•</span>
                    <span>{student.campus}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto mb-1">
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="h-3.5 w-3.5 mr-1.5" /> ID Card
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <FileText className="h-3.5 w-3.5 mr-1.5" /> Report Card
                </Button>
              </div>
            </div>

            {/* Micro Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Attendance Rate</span>
                <span className="font-bold text-emerald-600 text-sm">
                  {student.attendancePercentage}% (Good)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Academic Standing</span>
                <span className="font-bold text-slate-800 text-sm">
                  {student.overallGrade}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Fee Account</span>
                <span className="font-bold text-slate-800 text-sm">
                  {student.feeStatus}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Admission Session</span>
                <span className="font-bold text-slate-800 text-sm">
                  {student.admissionYear}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 10 Tabbed Dossier Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="parent">Parent / Guardian</TabsTrigger>
          <TabsTrigger value="academic">Academic Info</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="exams">Examinations</TabsTrigger>
          <TabsTrigger value="fees">Fees & Billing</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        {/* 1. Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="truncate">{student.contact?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{student.contact?.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {student.contact?.address}, {student.contact?.city}, {student.contact?.state} - {student.contact?.pincode}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500">
                  Parent / Guardian
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Father</span>
                  <p className="font-semibold text-slate-800">{student.parent?.fatherName}</p>
                  <p className="text-[11px] text-slate-500">{student.parent?.fatherOccupation}</p>
                </div>
                <div className="pt-1">
                  <span className="text-slate-400 block text-[11px]">Emergency Hotline</span>
                  <p className="font-mono text-slate-800 font-semibold">{student.parent?.emergencyContact}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500">
                  Classroom Mentor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Class Teacher</span>
                  <p className="font-semibold text-slate-800">{student.academicDetails?.classTeacher}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">House Assignment</span>
                  <p className="font-semibold text-blue-700">{student.academicDetails?.house}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Transportation</span>
                  <p className="text-slate-700">{student.academicDetails?.busRoute}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. Personal Information */}
        <TabsContent value="personal">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Personal Identification Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                <p className="font-semibold text-slate-800">{student.dob}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Gender</span>
                <p className="font-semibold text-slate-800">{student.gender}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Blood Group</span>
                <p className="font-semibold text-slate-800">{student.bloodGroup}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Nationality</span>
                <p className="font-semibold text-slate-800">{student.nationality}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Religion</span>
                <p className="font-semibold text-slate-800">{student.religion}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Social Category</span>
                <p className="font-semibold text-slate-800">{student.category}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">National Aadhaar / ID</span>
                <p className="font-semibold text-slate-800 font-mono">{student.aadhaarNumber}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Roll Number</span>
                <p className="font-semibold text-slate-800 font-mono">{student.rollNumber}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Parent / Guardian */}
        <TabsContent value="parent">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Parent & Guardian Profiles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800">Father's Details</span>
                  <p>Name: <strong className="text-slate-900">{student.parent?.fatherName}</strong></p>
                  <p>Occupation: {student.parent?.fatherOccupation}</p>
                  <p>Phone: {student.parent?.fatherPhone}</p>
                  <p>Email: {student.parent?.fatherEmail}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800">Mother's Details</span>
                  <p>Name: <strong className="text-slate-900">{student.parent?.motherName}</strong></p>
                  <p>Occupation: {student.parent?.motherOccupation}</p>
                  <p>Phone: {student.parent?.motherPhone}</p>
                  <p>Email: {student.parent?.motherEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Academic Information */}
        <TabsContent value="academic">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Curriculum & Academic Enrollment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Curriculum Framework</span>
                  <p className="font-semibold text-slate-800">{student.academicDetails?.curriculum}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Assigned Stream</span>
                  <p className="font-semibold text-blue-700">{student.academicDetails?.stream}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Attendance */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border">
              <span className="text-slate-400 block">Total Working Days</span>
              <p className="text-lg font-bold text-slate-800">{student.attendanceSummary?.totalDays}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 block">Days Present</span>
              <p className="text-lg font-bold text-emerald-900">{student.attendanceSummary?.presentDays}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
              <span className="text-rose-700 block">Days Absent</span>
              <p className="text-lg font-bold text-rose-900">{student.attendanceSummary?.absentDays}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="text-amber-700 block">Late Arrivals</span>
              <p className="text-lg font-bold text-amber-900">{student.attendanceSummary?.lateDays}</p>
            </div>
          </div>

          <Card className="border-slate-200">
            <CardHeader className="py-3">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-500">
                Recent Daily Check-in Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y text-slate-500">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Session</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.recentAttendance?.map((att, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-slate-800">{att.date}</td>
                      <td className="p-3 text-slate-500">{att.session}</td>
                      <td className="p-3">
                        <StatusBadge status={att.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. Examinations */}
        <TabsContent value="exams">
          <Card className="border-slate-200">
            <CardHeader className="py-3">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-500">
                Term Examination Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y text-slate-500">
                  <tr>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Max Marks</th>
                    <th className="p-3">Marks Scored</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Faculty Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.examResults?.map((res, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-semibold text-slate-800">{res.subject}</td>
                      <td className="p-3 text-slate-500">{res.maxMarks}</td>
                      <td className="p-3 font-bold text-blue-600">{res.marksObtained}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700">
                          {res.grade}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 italic">{res.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. Fees */}
        <TabsContent value="fees" className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border">
              <span className="text-slate-500 block">Total Annual Quota</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                ₹{student.feesSummary?.totalAnnualFee?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-emerald-700 block">Paid Amount</span>
              <p className="text-base font-bold text-emerald-900 mt-0.5">
                ₹{student.feesSummary?.paidAmount?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border">
              <span className="text-slate-500 block">Balance Pending</span>
              <p className="text-base font-bold text-slate-800 mt-0.5">
                ₹{student.feesSummary?.dueAmount?.toLocaleString()}
              </p>
            </div>
          </div>

          <Card className="border-slate-200">
            <CardHeader className="py-3">
              <CardTitle className="text-xs uppercase tracking-wider text-slate-500">
                Payment Receipts & Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y text-slate-500">
                  <tr>
                    <th className="p-3">Receipt #</th>
                    <th className="p-3">Term Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.feesSummary?.receipts?.map((rcp, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-mono font-semibold text-slate-900">{rcp.receiptNo}</td>
                      <td className="p-3 text-slate-700">{rcp.term}</td>
                      <td className="p-3 font-bold text-emerald-700">₹{rcp.amount.toLocaleString()}</td>
                      <td className="p-3 text-slate-500">{rcp.date}</td>
                      <td className="p-3 text-slate-500">{rcp.mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8. Documents */}
        <TabsContent value="documents">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Verified Compliance Records & Attachments</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 text-xs">
              {student.documents?.map((doc, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="font-semibold text-slate-900 block">{doc.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {doc.size} • Uploaded on {doc.uploadDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Download className="h-3.5 w-3.5 mr-1" /> Download
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 9. Communication */}
        <TabsContent value="communication">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Parent Dispatches & Communications Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border flex items-start gap-3">
                <MessageSquare className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      Mid-Term Examination Schedule Notification (SMS & Email)
                    </span>
                    <span className="text-slate-400 text-[11px]">Sep 28, 2026</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Dispatched to {student.parent?.fatherPhone} and {student.parent?.fatherEmail}. Delivery status: Delivered (100%).
                  </p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border flex items-start gap-3">
                <MessageSquare className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      Term 2 Tuition Fee Receipt Generated (WhatsApp & SMS)
                    </span>
                    <span className="text-slate-400 text-[11px]">Sep 12, 2026</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Payment acknowledgement for ₹80,000 transmitted with PDF invoice link.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 10. Activity */}
        <TabsContent value="activity">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Student Longitudinal Activity Ledger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="relative border-l-2 border-slate-200 pl-4 space-y-4 ml-2">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <p className="font-semibold text-slate-900">Class 12 Section A Promoted & Confirmed</p>
                  <span className="text-[11px] text-slate-400">June 01, 2026 by Academic Dean</span>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                  <p className="font-semibold text-slate-900">Term 1 Examination Cleared with Grade A1</p>
                  <span className="text-[11px] text-slate-400">October 20, 2025</span>
                </div>
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-slate-400 ring-4 ring-white" />
                  <p className="font-semibold text-slate-900">Initial Enrollment & TC Verification Finalized</p>
                  <span className="text-[11px] text-slate-400">June 15, 2024 by Admissions Desk</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
