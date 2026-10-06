// src/modules/students/pages/StudentExitsPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { StudentExitTable } from '../components/StudentExitTable'
import { StudentExitForm } from '../components/StudentExitForm'
import { studentService } from '../services/studentService'
import { Button } from '@/components/ui/button'
import { Plus, LogOut, ArrowLeft } from 'lucide-react'

export function StudentExitsPage() {
  const [exits, setExits] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [eList, sList] = await Promise.all([
        studentService.getExits(),
        studentService.getStudents(),
      ])
      setExits(eList)
      setStudents(sList)
    } catch (err) {
      console.error('Error loading exit dossiers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateExit = async (payload) => {
    setSubmitting(true)
    try {
      await studentService.requestStudentExit(payload)
      setShowForm(false)
      await loadData()
    } catch (err) {
      console.error('Failed to create exit request', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteExit = async (exitId) => {
    try {
      await studentService.completeStudentExit(exitId)
      await loadData()
    } catch (err) {
      console.error('Failed to complete exit', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Student Exit & Clearance Management"
          description="Manage graduation exits, institutional withdrawals, and department clearance checklists."
          breadcrumbs={[
            { label: 'Students', href: '/students' },
            { label: 'Exits & Clearance' },
          ]}
        />

        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Log Exit Request
          </Button>
        )}
      </div>

      {showForm ? (
        <StudentExitForm
          students={students}
          onSubmit={handleCreateExit}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      ) : (
        <StudentExitTable
          exits={exits}
          loading={loading}
          onCompleteExit={handleCompleteExit}
        />
      )}
    </div>
  )
}
