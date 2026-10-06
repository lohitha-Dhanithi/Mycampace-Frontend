// src/modules/finance/pages/DiscountsListPage.jsx
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
import { discountService } from '../services/discountService'
import { formatCurrency, FEE_COMPONENT_TYPES } from '../config/financeConfig'
import { Tag, Plus, Search, ShieldCheck, History } from 'lucide-react'

export function DiscountsListPage() {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [type, setType] = useState('Percentage Discount')
  const [value, setValue] = useState(15)
  const [applicableComponent, setApplicableComponent] = useState('Tuition Fee')
  const [maxDiscount, setMaxDiscount] = useState(20000)
  const [reason, setReason] = useState('')
  const [approvedBy, setApprovedBy] = useState('Finance & Accounts Committee')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await discountService.getDiscounts({ search })
      setDiscounts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [search])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name || !reason) {
      alert('Please fill all required fields')
      return
    }
    try {
      await discountService.createDiscount({
        name,
        type,
        value,
        applicableComponent,
        maxDiscount,
        reason,
        approvedBy,
      })
      setCreateModalOpen(false)
      setName('')
      setReason('')
      loadData()
    } catch (err) {
      alert(err.message || 'Failed to create discount policy')
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Discounts & Concession Policies"
        description="Structured fee waivers, sibling concessions, merit reductions, and late fine exemptions with strict audit trails."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="text-xs">
              <Link to="/finance/scholarships">
                View Scholarships Catalog
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 shadow-xs text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Concession Policy
            </Button>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search concession name or reason..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Concession Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {discounts.map((d) => (
          <Card key={d.id} className="border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-800 border-purple-200">
                  {d.type}
                </Badge>
                <Badge variant={d.status === 'Active' ? 'success' : 'secondary'} className="text-[10px]">
                  {d.status}
                </Badge>
              </div>
              <CardTitle className="text-sm font-bold text-slate-900 mt-2">
                {d.name}
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {d.reason}
              </p>
            </CardHeader>

            <CardContent className="space-y-3 py-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-600 font-medium">Benefit Value:</span>
                <span className="font-extrabold text-purple-900 text-sm">
                  {d.type === 'Percentage Discount' ? `${d.value}% Waiver` : formatCurrency(d.value)}
                </span>
              </div>

              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Applicable On:</span>
                  <span className="font-medium text-slate-800">{d.applicableComponent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Discount Cap:</span>
                  <span className="font-medium text-slate-800">{formatCurrency(d.maxDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Approved By:</span>
                  <span className="font-semibold text-slate-800">{d.approvedBy}</span>
                </div>
              </div>
            </CardContent>

            <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-lg flex items-center justify-between text-[11px] text-slate-500">
              <span>Granted to {d.totalGranted} Students</span>
              <span className="font-mono text-[10px]">Ref: {d.id}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Concession Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Create Concession / Discount Policy
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Policy Title *</label>
              <Input
                placeholder="e.g. Alumni Ward Tuition Rebate"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Discount Type</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage Discount" className="text-xs">Percentage Discount</SelectItem>
                    <SelectItem value="Fixed Amount" className="text-xs">Fixed Amount</SelectItem>
                    <SelectItem value="Late Fee Waiver" className="text-xs">Late Fee Waiver</SelectItem>
                    <SelectItem value="Special Concession" className="text-xs">Special Concession</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Value ({type === 'Percentage Discount' ? '%' : '₹'}) *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  required
                  className="text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Applicable Component</label>
                <Select value={applicableComponent} onValueChange={setApplicableComponent}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_COMPONENT_TYPES.map(t => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Max Discount Cap (₹)</label>
                <Input
                  type="number"
                  min="0"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(Number(e.target.value))}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Policy Rationale & Reason *</label>
              <Input
                placeholder="Institutional eligibility or governance resolution..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Authorized Approver *</label>
              <Input
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                required
                className="text-xs font-medium"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
                Publish Concession Policy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
