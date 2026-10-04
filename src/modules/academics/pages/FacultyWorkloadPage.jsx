// src/modules/academics/pages/FacultyWorkloadPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { FacultyWorkloadTable } from '../components/FacultyWorkloadTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'
import { Card, CardContent } from '@/components/ui/card'
import { Gauge, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'

export function FacultyWorkloadPage() {
  const [workloads, setWorkloads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkloads = async () => {
      setLoading(true)
      try {
        const data = await academicService.getFacultyWorkload()
        setWorkloads(data)
      } catch (err) {
        console.error('Failed to load faculty workloads', err)
      } finally {
        setLoading(false)
      }
    }
    fetchWorkloads()
  }, [])

  if (loading) return <LoadingState message="Calculating faculty teaching loads..." />

  const totalAssignedHours = workloads.reduce((sum, w) => sum + (w.assignedHours || 0), 0)
  const averageHours = workloads.length > 0 ? Math.round(totalAssignedHours / workloads.length) : 0
  const highWorkloadCount = workloads.filter((w) => w.status === 'High Workload').length
  const balancedCount = workloads.filter((w) => w.status === 'Balanced').length
  const underCount = workloads.filter((w) => w.status === 'Underutilized').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Workload & Capacity Index"
        description="Monitor instructional hours, teaching distribution, and educator capacity thresholds."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Workload' },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Average Teaching Load</span>
            <div className="text-2xl font-black text-slate-900">{averageHours} hrs / week</div>
            <div className="text-[10px] text-slate-400">Institutional threshold: 18-22 hrs</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Balanced Educators</span>
            <div className="text-2xl font-black text-emerald-600">{balancedCount} Faculty</div>
            <div className="text-[10px] text-emerald-600">Optimal teaching capacity</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">High Workload Flagged</span>
            <div className="text-2xl font-black text-red-600">{highWorkloadCount} Faculty</div>
            <div className="text-[10px] text-red-500">Exceeds 23 hours / week</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Underutilized</span>
            <div className="text-2xl font-black text-amber-600">{underCount} Faculty</div>
            <div className="text-[10px] text-amber-500">Available for additional periods</div>
          </CardContent>
        </Card>
      </div>

      <FacultyWorkloadTable workloads={workloads} loading={loading} />
    </div>
  )
}
