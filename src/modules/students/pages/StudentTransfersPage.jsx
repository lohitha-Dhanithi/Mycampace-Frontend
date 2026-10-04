// src/modules/students/pages/StudentTransfersPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { StudentTransferTable } from '../components/StudentTransferTable'
import { studentService } from '../services/studentService'
import { LoadingState } from '@/components/common/LoadingState'

export function StudentTransfersPage() {
  const [transfers, setTransfers] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [tList, sList] = await Promise.all([
        studentService.getTransfers(),
        studentService.getStudents(),
      ])
      setTransfers(tList)
      setStudents(sList)
    } catch (err) {
      console.error('Error loading transfers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRequestTransfer = async (transferData) => {
    await studentService.requestTransfer(transferData)
    await loadData()
  }

  const handleCompleteTransfer = async (transferId) => {
    await studentService.completeTransfer(transferId)
    await loadData()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Transfers & Re-allocations"
        description="Manage internal campus reassignments, section adjustments, and external transfers."
        breadcrumbs={[
          { label: 'Students', href: '/students' },
          { label: 'Transfers' },
        ]}
      />

      <StudentTransferTable
        transfers={transfers}
        students={students}
        loading={loading}
        onRequestTransfer={handleRequestTransfer}
        onCompleteTransfer={handleCompleteTransfer}
      />
    </div>
  )
}
