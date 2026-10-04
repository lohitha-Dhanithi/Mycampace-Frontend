// src/modules/finance/pages/FeeStructureDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { feeStructureService } from '../services/feeStructureService'
import { formatCurrency } from '../config/financeConfig'
import {
  ArrowLeft,
  Building,
  Calendar,
  Layers,
  CheckCircle,
  Tag,
  Clock,
  Trash2,
  Edit3,
} from 'lucide-react'

export function FeeStructureDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [structure, setStructure] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await feeStructureService.getFeeStructureById(id)
      setStructure(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to deactivate this fee structure? Existing student demands will be preserved.')) return
    await feeStructureService.deleteFeeStructure(id)
    navigate('/finance/fee-structures')
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Loading fee structure details...
      </div>
    )
  }

  if (!structure) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Fee structure not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title={structure.name}
        description={`Academic Context: ${structure.academicYearName} | ${structure.campusName} | ${structure.programName}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link to="/finance/fee-structures">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to List
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Deactivate
            </Button>
            <Button size="sm" asChild className="text-xs bg-blue-600 hover:bg-blue-700">
              <Link to={`/finance/student-fees`}>
                Assign to Students
              </Link>
            </Button>
          </div>
        }
      />

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 bg-blue-50/40">
          <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
            Total Annual Fee
          </div>
          <div className="text-2xl font-black text-blue-950 mt-1">
            {formatCurrency(structure.totalAnnualAmount)}
          </div>
          <div className="text-[10px] text-blue-600 mt-1">Per Enrolled Student</div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Components Count
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {structure.components?.length || 0}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Tuition, Labs, Tech, Sports</div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Installment Terms
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {structure.installments?.length || 0} Tranches
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Periodic billing schedule</div>
        </Card>

        <Card className="p-4 border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Configuration Status
          </div>
          <div className="mt-2">
            <Badge variant="success" className="text-xs font-semibold">
              {structure.status}
            </Badge>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Ready for student billing</div>
        </Card>
      </div>

      {/* Academic Mapping Metadata */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100">
          <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Academic Context & Student Cohort
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Academic Year:</span>
            <span className="font-semibold text-slate-800">{structure.academicYearName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Campus:</span>
            <span className="font-semibold text-slate-800">{structure.campusName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Program:</span>
            <span className="font-semibold text-slate-800">{structure.programName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Cohort / Class:</span>
            <span className="font-semibold text-slate-800">{structure.className || structure.courseName}</span>
          </div>
        </CardContent>
      </Card>

      {/* Fee Components Breakdown */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100">
          <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Fee Components Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Component Name</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Frequency</th>
                <th className="py-2.5 px-4">Due Date</th>
                <th className="py-2.5 px-4">Mandatory</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {structure.components?.map((c) => (
                <tr key={c.id}>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{c.name}</td>
                  <td className="py-2.5 px-4 text-slate-600">{c.type}</td>
                  <td className="py-2.5 px-4 text-slate-600">{c.frequency}</td>
                  <td className="py-2.5 px-4 text-slate-600">{c.dueDate}</td>
                  <td className="py-2.5 px-4">
                    <Badge variant={c.mandatory ? 'secondary' : 'outline'} className="text-[10px]">
                      {c.mandatory ? 'Mandatory' : 'Optional'}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-slate-900">
                    {formatCurrency(c.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/80 font-bold border-t border-slate-200 text-slate-900">
                <td colSpan="5" className="py-2.5 px-4">Total Components Sum</td>
                <td className="py-2.5 px-4 text-right text-sm text-blue-900 font-black">
                  {formatCurrency(structure.totalAnnualAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>

      {/* Installment Schedules */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100">
          <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Installment Tranches Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Installment Name</th>
                <th className="py-2.5 px-4">Due Date</th>
                <th className="py-2.5 px-4">Grace Period</th>
                <th className="py-2.5 px-4">Late Fine</th>
                <th className="py-2.5 px-4 text-right">Tranche Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {structure.installments?.map((inst) => (
                <tr key={inst.id}>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{inst.name}</td>
                  <td className="py-2.5 px-4 text-slate-600">{inst.dueDate}</td>
                  <td className="py-2.5 px-4 text-slate-600">{inst.gracePeriodDays} days</td>
                  <td className="py-2.5 px-4 text-rose-600 font-medium">₹{inst.lateFeePerDay}/day</td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-blue-900">
                    {formatCurrency(inst.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
