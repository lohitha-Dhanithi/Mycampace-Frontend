// src/modules/finance/pages/ScholarshipsListPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { scholarshipService } from '../services/scholarshipService'
import { formatCurrency } from '../config/financeConfig'
import { Award, Plus, Search, Users, Calendar, Landmark } from 'lucide-react'

export function ScholarshipsListPage() {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [type, setType] = useState('Merit')
  const [eligibility, setEligibility] = useState('')
  const [benefitType, setBenefitType] = useState('Fixed Amount')
  const [amount, setAmount] = useState(50000)
  const [fundingSource, setFundingSource] = useState('University Endowment Fund')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await scholarshipService.getScholarships({
        type: typeFilter,
        search,
      })
      setScholarships(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [typeFilter, search])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name || !eligibility) {
      alert('Please fill all required fields')
      return
    }
    try {
      await scholarshipService.createScholarship({
        name,
        type,
        eligibility,
        benefitType,
        amount: Number(amount),
        fundingSource,
      })
      setCreateModalOpen(false)
      setName('')
      setEligibility('')
      loadData()
    } catch (err) {
      alert(err.message || 'Failed to create scholarship')
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Institutional Scholarships & Endowments"
        description="Merit awards, need-based tuition waivers, corporate CSR fellowships, and endowment trust funds."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Scholarship Program
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search scholarship or eligibility criteria..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44 text-xs h-8">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Categories</SelectItem>
              <SelectItem value="Merit" className="text-xs">Merit Based</SelectItem>
              <SelectItem value="Need Based" className="text-xs">Need Based</SelectItem>
              <SelectItem value="Institutional" className="text-xs">Institutional</SelectItem>
              <SelectItem value="External" className="text-xs">External / CSR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid of Scholarship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scholarships.map((s) => (
          <Card key={s.id} className="border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200">
                  {s.type} Scholarship
                </Badge>
                <Badge variant={s.status === 'Active' ? 'success' : 'secondary'} className="text-[10px]">
                  {s.status}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-slate-900 mt-2">
                {s.name}
              </CardTitle>
              <p className="text-xs text-slate-600 mt-1">
                <span className="font-semibold text-slate-700">Eligibility:</span> {s.eligibility}
              </p>
            </CardHeader>

            <CardContent className="space-y-3 py-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Award Benefit</div>
                  <div className="text-lg font-black text-blue-900 mt-0.5">
                    {s.benefitType === 'Percentage' ? `${s.amount}% Tuition Fee Waiver` : formatCurrency(s.amount)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Beneficiaries</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5 flex items-center justify-end gap-1">
                    <Users className="h-4 w-4" />
                    {s.beneficiariesCount} Students
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Landmark className="h-3.5 w-3.5 text-slate-400" />
                  Source: <strong className="text-slate-700">{s.fundingSource}</strong>
                </span>
                <span>Session: {s.academicYearName}</span>
              </div>
            </CardContent>

            <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-lg flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono text-[10px]">ID: {s.id}</span>
              <span className="text-slate-400">Valid: {s.startDate} to {s.endDate}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Scholarship Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Create Scholarship Program
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Scholarship Title *</label>
              <Input
                placeholder="e.g. Dean's Leadership Fellowship"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Merit" className="text-xs">Merit</SelectItem>
                    <SelectItem value="Need Based" className="text-xs">Need Based</SelectItem>
                    <SelectItem value="Institutional" className="text-xs">Institutional</SelectItem>
                    <SelectItem value="External" className="text-xs">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Benefit Model</label>
                <Select value={benefitType} onValueChange={setBenefitType}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed Amount" className="text-xs">Fixed Amount (₹)</SelectItem>
                    <SelectItem value="Percentage" className="text-xs">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Benefit Amount ({benefitType === 'Percentage' ? '%' : '₹'}) *
              </label>
              <Input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Eligibility Criteria *</label>
              <Input
                placeholder="e.g. Minimum 90% in 12th board examinations..."
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Funding Corpus / Sponsor</label>
              <Input
                placeholder="e.g. University Alumni Corpus Fund"
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Create Scholarship
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
