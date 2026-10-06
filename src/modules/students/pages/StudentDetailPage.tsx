// src/modules/students/pages/StudentDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { StudentProfile } from '../components/StudentProfile'
import { studentService } from '../services/studentService'
import { LoadingState } from '@/components/common/LoadingState'
import { Button } from '@/components/ui/button'

export function StudentDetailPage({ tab: propTab }: { tab?: string } = {}) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Determine active tab from URL path
  const pathParts = location.pathname.split('/')
  const lastPart = pathParts[pathParts.length - 1]
  const validTabs = [
    'overview',
    'personal',
    'profile',
    'academic',
    'parents',
    'documents',
    'attendance',
    'examinations',
    'fees',
    'communication',
    'activity',
  ]

  let resolvedTab = propTab || 'overview'
  if (validTabs.includes(lastPart)) {
    resolvedTab = lastPart === 'profile' ? 'personal' : lastPart
  }

  const [student, setStudent] = useState(null)
  const [guardians, setGuardians] = useState([])
  const [academicRecords, setAcademicRecords] = useState([])
  const [documents, setDocuments] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const loadStudentData = async () => {
    setLoading(true)
    try {
      const stu = await studentService.getStudentById(id)
      if (stu) {
        setStudent(stu)
        const [gList, aList, dList, actList] = await Promise.all([
          studentService.getGuardians(stu.id),
          studentService.getAcademicRecords(stu.id),
          studentService.getDocuments(stu.id),
          studentService.getStudentActivities(stu.id),
        ])
        setGuardians(gList)
        setAcademicRecords(aList)
        setDocuments(dList)
        setActivities(actList)
      }
    } catch (err) {
      console.error('Error fetching student data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudentData()
  }, [id])

  if (loading) {
    return <LoadingState message="Loading student master dossier..." />
  }

  if (!student) {
    return (
      <div className="py-16 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-800">Student Record Not Found</h3>
        <p className="text-xs text-slate-500">The requested student identifier does not exist in the active directory.</p>
        <Button size="sm" onClick={() => navigate('/students')} className="bg-blue-600 hover:bg-blue-700 text-white">
          Back to Students Directory
        </Button>
      </div>
    )
  }

  // Guardian actions
  const handleAddGuardian = async (guardianData) => {
    await studentService.addGuardian({ ...guardianData, studentId: student.id })
    const updated = await studentService.getGuardians(student.id)
    setGuardians(updated)
  }

  const handleUpdateGuardian = async (guardianId, guardianData) => {
    await studentService.updateGuardian(guardianId, guardianData)
    const updated = await studentService.getGuardians(student.id)
    setGuardians(updated)
  }

  const handleSetPrimaryGuardian = async (guardianId) => {
    await studentService.setPrimaryGuardian(student.id, guardianId)
    const updated = await studentService.getGuardians(student.id)
    setGuardians(updated)
  }

  const handleRemoveGuardian = async (guardianId) => {
    await studentService.removeGuardian(student.id, guardianId)
    const updated = await studentService.getGuardians(student.id)
    setGuardians(updated)
  }

  // Document actions
  const handleUploadDocument = async (docData) => {
    await studentService.uploadDocument({ ...docData, studentId: student.id })
    const updated = await studentService.getDocuments(student.id)
    setDocuments(updated)
  }

  const handleVerifyDocument = async (docId) => {
    await studentService.verifyDocument(docId)
    const updated = await studentService.getDocuments(student.id)
    setDocuments(updated)
  }

  const handleRejectDocument = async (docId, reason) => {
    await studentService.rejectDocument(docId, reason)
    const updated = await studentService.getDocuments(student.id)
    setDocuments(updated)
  }

  const handleUpdateStatus = async (newStatus) => {
    await studentService.updateStudentStatus(student.id, newStatus)
    const refreshed = await studentService.getStudentById(student.id)
    setStudent(refreshed)
  }

  return (
    <StudentProfile
      student={student}
      guardians={guardians}
      academicRecords={academicRecords}
      documents={documents}
      activities={activities}
      defaultTab={resolvedTab}
      onAddGuardian={handleAddGuardian}
      onUpdateGuardian={handleUpdateGuardian}
      onSetPrimaryGuardian={handleSetPrimaryGuardian}
      onRemoveGuardian={handleRemoveGuardian}
      onUploadDocument={handleUploadDocument}
      onVerifyDocument={handleVerifyDocument}
      onRejectDocument={handleRejectDocument}
      onUpdateStatus={handleUpdateStatus}
    />
  )
}
