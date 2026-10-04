// src/modules/students/components/StudentOverview.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  DollarSign,
  Award,
  FileText,
} from 'lucide-react'

export function StudentOverview({ student, primaryGuardian }) {
  if (!student) return null

  return (
    <div className="space-y-4">
      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Attendance %</span>
            <div className="text-xl font-bold text-emerald-700">
              {student.attendanceSummary?.attendancePercentage ?? 96}%
            </div>
            <div className="text-[10px] text-slate-400">
              {student.attendanceSummary?.presentDays ?? 79} of {student.attendanceSummary?.totalWorkingDays ?? 82} days present
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Fee Standing</span>
            <div className="text-xl font-bold text-slate-900">
              ₹{Number(student.feeSummary?.pendingAmount || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">
              {student.feeSummary?.status || 'Fully Paid'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Latest Exam Result</span>
            <div className="text-xl font-bold text-blue-700">
              {student.examinationSummary?.overallGrade || 'A1'}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {student.examinationSummary?.overallPercentage || '92.8%'} • {student.examinationSummary?.result || 'Passed'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-3.5 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Document Compliance</span>
            <div className="text-xl font-bold text-slate-900">
              {student.pendingDocumentsCount === 0 ? '100%' : 'Pending'}
            </div>
            <div className="text-[10px] text-slate-400">
              {student.pendingDocumentsCount === 0 ? 'All mandatory files verified' : `${student.pendingDocumentsCount} files required`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main 2-column info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Student Identification & Enrollment */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Identification & Enrollment</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Student ID</span>
              <span className="font-mono font-bold text-blue-600">{student.studentId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Admission Number</span>
              <span className="font-mono font-bold text-slate-800">{student.admissionNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Admission Date</span>
              <span className="font-semibold text-slate-800">{student.admissionDate || '—'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Current Lifecycle Status</span>
              <StatusBadge status={student.status} />
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Academic Year</span>
              <span className="font-semibold text-slate-800">{student.academicYearName || '2026-2027'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Academic Allocation */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Academic Allocation</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Campus Facility</span>
              <span className="font-semibold text-slate-800">{student.campusName || 'Hyderabad Main Campus'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Program</span>
              <span className="font-semibold text-slate-800">{student.programName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Course / Stream</span>
              <span className="font-semibold text-slate-800">{student.courseName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Class & Section</span>
              <span className="font-bold text-slate-900">{student.className} — {student.sectionName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Roll Number</span>
              <span className="font-mono font-semibold text-slate-800">{student.rollNumber || '—'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Address */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Contact & Residence</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Primary Mobile</span>
              <span className="font-semibold text-slate-800">{student.contact?.primaryMobile}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Email Address</span>
              <span className="font-semibold text-slate-800">{student.contact?.email}</span>
            </div>
            <div className="py-1">
              <span className="text-slate-500 block mb-0.5">Address</span>
              <span className="font-semibold text-slate-800 text-[11px] leading-relaxed block">
                {student.address?.addressLine1} {student.address?.addressLine2 && `, ${student.address?.addressLine2}`}, {student.address?.city}, {student.address?.state} - {student.address?.postalCode}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Primary Guardian Card */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Primary Guardian</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            {primaryGuardian ? (
              <>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-bold text-slate-900">{primaryGuardian.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Relationship</span>
                  <span className="font-semibold text-slate-800">{primaryGuardian.relationship}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Mobile Phone</span>
                  <span className="font-semibold text-slate-800">{primaryGuardian.mobile}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Occupation</span>
                  <span className="font-semibold text-slate-800">{primaryGuardian.occupation || '—'}</span>
                </div>
              </>
            ) : (
              <div className="text-slate-400 italic">No primary guardian registered.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
