// src/modules/students/components/StudentProfile.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { StudentOverview } from './StudentOverview'
import { StudentPersonalInfo } from './StudentPersonalInfo'
import { StudentAcademicProfile } from './StudentAcademicProfile'
import { GuardianTable } from './GuardianTable'
import { StudentDocumentTable } from './StudentDocumentTable'
import { StudentAttendanceSummary } from './StudentAttendanceSummary'
import { StudentExaminationSummary } from './StudentExaminationSummary'
import { StudentFeeSummary } from './StudentFeeSummary'
import { StudentCommunication } from './StudentCommunication'
import { StudentActivity } from './StudentActivity'

import {
  ArrowLeft,
  Edit,
  Printer,
  ArrowRightLeft,
  TrendingUp,
  LogOut,
  Building2,
  Calendar,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

export function StudentProfile({
  student,
  guardians = [],
  academicRecords = [],
  documents = [],
  activities = [],
  defaultTab = 'overview',
  onAddGuardian,
  onUpdateGuardian,
  onSetPrimaryGuardian,
  onRemoveGuardian,
  onUploadDocument,
  onVerifyDocument,
  onRejectDocument,
  onUpdateStatus,
}) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Status transition dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [targetStatus, setTargetStatus] = useState('On Leave')

  if (!student) return null

  const currentAcademic = academicRecords.find((r) => r.status === 'Current') || {
    academicYearName: student.academicYearName,
    campusName: student.campusName,
    programName: student.programName,
    courseName: student.courseName,
    className: student.className,
    sectionName: student.sectionName,
    rollNumber: student.rollNumber,
  }

  const primaryGuardian = guardians.find((g) => g.isPrimary) || guardians[0]

  const handlePrint = () => {
    window.print()
  }

  const handleTriggerStatusChange = (newStat) => {
    setTargetStatus(newStat)
    setStatusDialogOpen(true)
  }

  const handleConfirmStatusChange = () => {
    if (onUpdateStatus) {
      onUpdateStatus(student.id, targetStatus)
    }
    setStatusDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/students')}
          className="gap-1.5 text-xs self-start"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Student Directory
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="text-xs gap-1"
          >
            <Printer className="h-3.5 w-3.5" /> Print Dossier
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/students/${student.id}/edit`)}
            className="text-xs gap-1"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Profile
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/students/transfers`)}
            className="text-xs gap-1 text-purple-700 border-purple-200 hover:bg-purple-50"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" /> Transfer
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/students/promotions`)}
            className="text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          >
            <TrendingUp className="h-3.5 w-3.5" /> Promote
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/students/exits`)}
            className="text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-3.5 w-3.5" /> Exit
          </Button>
        </div>
      </div>

      {/* Main Student Header Card */}
      <Card className="border-slate-200 shadow-xs bg-white overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900" />
        <CardContent className="p-5 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-8 mb-2">
            <div className="flex items-end gap-3.5">
              <Avatar
                src={student.avatar}
                alt={student.personal?.fullName}
                fallback={student.personal?.fullName?.substring(0, 2).toUpperCase() || 'ST'}
                size="xl"
                className="ring-4 ring-white shadow-md bg-slate-100"
              />
              <div className="mb-0.5 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900">
                    {student.personal?.fullName || student.name}
                  </h1>
                  <StatusBadge status={student.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="font-mono font-bold text-blue-600">ID: {student.studentId}</span>
                  <span>•</span>
                  <span>Adm #: <strong className="text-slate-700 font-mono">{student.admissionNumber}</strong></span>
                  <span>•</span>
                  <span>{student.className} — {student.sectionName}</span>
                  <span>•</span>
                  <span>{student.campusName}</span>
                </div>
              </div>
            </div>

            {/* Quick Status toggle shortcut */}
            <div className="self-end md:self-auto flex items-center gap-2">
              {student.status === 'Active' ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTriggerStatusChange('On Leave')}
                  className="text-xs h-7 text-amber-700 border-amber-200 hover:bg-amber-50"
                >
                  Mark On Leave
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTriggerStatusChange('Active')}
                  className="text-xs h-7 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                >
                  Mark Active
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1 flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="academic">Academic Profile</TabsTrigger>
          <TabsTrigger value="parents">Parents & Guardians ({guardians.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="examinations">Examinations</TabsTrigger>
          <TabsTrigger value="fees">Fees Summary</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
        </TabsList>

        {/* 1. Overview */}
        <TabsContent value="overview" className="mt-4">
          <StudentOverview student={student} primaryGuardian={primaryGuardian} />
        </TabsContent>

        {/* 2. Personal */}
        <TabsContent value="personal" className="mt-4">
          <StudentPersonalInfo student={student} />
        </TabsContent>

        {/* 3. Academic */}
        <TabsContent value="academic" className="mt-4">
          <StudentAcademicProfile
            currentRecord={currentAcademic}
            academicHistory={academicRecords}
          />
        </TabsContent>

        {/* 4. Parents */}
        <TabsContent value="parents" className="mt-4">
          <GuardianTable
            guardians={guardians}
            studentId={student.id}
            onAddGuardian={onAddGuardian}
            onUpdateGuardian={onUpdateGuardian}
            onSetPrimary={onSetPrimaryGuardian}
            onRemoveGuardian={onRemoveGuardian}
          />
        </TabsContent>

        {/* 5. Documents */}
        <TabsContent value="documents" className="mt-4">
          <StudentDocumentTable
            documents={documents}
            studentId={student.id}
            onUploadDocument={onUploadDocument}
            onVerifyDocument={onVerifyDocument}
            onRejectDocument={onRejectDocument}
          />
        </TabsContent>

        {/* 6. Attendance */}
        <TabsContent value="attendance" className="mt-4">
          <StudentAttendanceSummary attendanceSummary={student.attendanceSummary} />
        </TabsContent>

        {/* 7. Examinations */}
        <TabsContent value="examinations" className="mt-4">
          <StudentExaminationSummary examSummary={student.examinationSummary} />
        </TabsContent>

        {/* 8. Fees */}
        <TabsContent value="fees" className="mt-4">
          <StudentFeeSummary feeSummary={student.feeSummary} />
        </TabsContent>

        {/* 9. Communication */}
        <TabsContent value="communication" className="mt-4">
          <StudentCommunication student={student} />
        </TabsContent>

        {/* 10. Activity */}
        <TabsContent value="activity" className="mt-4">
          <StudentActivity activities={activities} />
        </TabsContent>
      </Tabs>

      {/* Status Confirmation Alert Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Student Status</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to transition student <strong>{student.personal?.fullName}</strong> from <strong>{student.status}</strong> to <strong>{targetStatus}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setStatusDialogOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmStatusChange}>
            Confirm Status Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  )
}
