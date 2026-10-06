// src/modules/finance/pages/AdCampaignsListPage.jsx
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
import { AdCampaignCard } from '../components/AdCampaignCard'
import { advertisingCampaignService } from '../services/advertisingCampaignService'
import { formatCurrency, ADVERTISING_STATUSES } from '../config/financeConfig'
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react'

export function AdCampaignsListPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectCampaignId, setRejectCampaignId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await advertisingCampaignService.getCampaigns({
        status: statusFilter,
      })
      setCampaigns(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusFilter])

  const filtered = campaigns.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.company.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleApprove = async (id) => {
    try {
      await advertisingCampaignService.approveCampaign(id, 'Dean of Academic Partnerships')
      loadData()
    } catch (err) {
      alert('Approval failed')
    }
  }

  const handleReject = async (e) => {
    e.preventDefault()
    if (!rejectCampaignId || !rejectReason) return
    try {
      await advertisingCampaignService.rejectCampaign(rejectCampaignId, rejectReason)
      setRejectModalOpen(false)
      setRejectReason('')
      loadData()
    } catch (err) {
      alert('Rejection failed')
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Sponsored Campaign Management"
        description="Review, authorize, and audit commercial campus campaigns, click-through rates, and recognized media revenue."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs">
              <Link to="/finance/advertising/campaigns/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Create Campaign
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
            placeholder="Search campaign name or sponsor company..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 text-xs h-8">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
              {ADVERTISING_STATUSES.map(st => (
                <SelectItem key={st} value={st} className="text-xs">{st}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Campaigns Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Campaign</th>
                  <th className="py-2.5 px-4">Advertiser & Sponsor</th>
                  <th className="py-2.5 px-4">Placement Slot</th>
                  <th className="py-2.5 px-4">Duration</th>
                  <th className="py-2.5 px-4 text-right">Budget</th>
                  <th className="py-2.5 px-4 text-right">Impressions</th>
                  <th className="py-2.5 px-4 text-right">Clicks (CTR)</th>
                  <th className="py-2.5 px-4 text-right">Revenue</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{c.id}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-800">{c.company}</div>
                      <div className="text-[11px] text-slate-400">{c.advertiserName}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 max-w-xs truncate">
                      {c.placementName}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                      {c.startDate} to {c.endDate}
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-slate-700">
                      {formatCurrency(c.budget)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-slate-800">
                      {c.impressions?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="py-2.5 px-4 text-right text-emerald-600 font-semibold">
                      {c.clicks || 0} ({c.ctr}%)
                    </td>
                    <td className="py-2.5 px-4 text-right font-black text-blue-900">
                      {formatCurrency(c.revenue)}
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge
                        variant={c.status === 'Active' ? 'success' : c.status === 'Pending Approval' ? 'warning' : 'secondary'}
                        className="text-[10px]"
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {c.status === 'Pending Approval' && (
                          <>
                            <Button
                              size="sm"
                              className="h-6 text-[11px] bg-emerald-600 hover:bg-emerald-700 px-2"
                              onClick={() => handleApprove(c.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-6 text-[11px] px-2"
                              onClick={() => {
                                setRejectCampaignId(c.id)
                                setRejectModalOpen(true)
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" asChild className="h-6 text-xs text-blue-600">
                          <Link to={`/finance/advertising/campaigns/${c.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reject Modal with Reason */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Reject Advertising Campaign
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Rejection Rationale / Non-Compliance Reason *
              </label>
              <Input
                placeholder="e.g. Unverified sponsor credentials or inappropriate audience targeting"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="destructive">
                Confirm Rejection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
