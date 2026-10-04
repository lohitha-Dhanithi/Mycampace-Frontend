// src/modules/finance/pages/LoanApplicationsListPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { dhanitiPayService } from '../services/dhanitiPayService'
import { formatCurrency, LOAN_APPLICATION_STATUSES } from '../config/financeConfig'
import {
  FileCheck2,
  Search,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'

export function LoanApplicationsListPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await dhanitiPayService.getLoanApplications({
        status: statusFilter,
        search,
      })
      setApplications(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusFilter, search])

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Approved':
      case 'Disbursed':
        return <Badge variant="success" className="text-[10px]">{st}</Badge>
      case 'Under Review':
      case 'Submitted':
        return <Badge variant="info" className="text-[10px]">{st}</Badge>
      case 'Additional Information Required':
        return <Badge variant="warning" className="text-[10px]">{st}</Badge>
      case 'Rejected':
      case 'Cancelled':
        return <Badge variant="destructive" className="text-[10px]">{st}</Badge>
      default:
        return <Badge variant="secondary" className="text-[10px]">{st}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="DhanitiPay Loan Application Vault"
        description="Encrypted tracking of educational finance applications transmitted to bank underwriters via DhanitiPay."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs">
              <Link to="/finance/financial-services/loans">
                Explore Available Products
              </Link>
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search App ID, DhanitiPay ref, student..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-52 text-xs h-8">
              <SelectValue placeholder="All Loan Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Loan Statuses</SelectItem>
              {LOAN_APPLICATION_STATUSES.map(st => (
                <SelectItem key={st} value={st} className="text-xs">{st}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applications Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Application ID</th>
                  <th className="py-2.5 px-4">DhanitiPay Ref</th>
                  <th className="py-2.5 px-4">Product & Provider</th>
                  <th className="py-2.5 px-4">Borrower / Applicant</th>
                  <th className="py-2.5 px-4 text-right">Requested</th>
                  <th className="py-2.5 px-4">Submitted Date</th>
                  <th className="py-2.5 px-4">Current Status</th>
                  <th className="py-2.5 px-4">Consent</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-700">
                      <Link to={`/finance/financial-services/applications/${a.id}`} className="hover:underline">
                        {a.id}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {a.externalApplicationId}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{a.productName}</div>
                      <div className="text-[10px] text-slate-400">{a.provider}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-900">{a.applicantName}</div>
                      <div className="text-[10px] text-slate-500">{a.applicantType} (for {a.studentName})</div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-black text-slate-900">
                      {formatCurrency(a.requestedAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {new Date(a.submittedAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-2.5 px-4">
                      {getStatusBadge(a.currentStatus)}
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200">
                        Verified
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Button variant="ghost" size="sm" asChild className="h-6 text-xs text-blue-600">
                        <Link to={`/finance/financial-services/applications/${a.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Track
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
