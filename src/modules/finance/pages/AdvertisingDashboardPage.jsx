// src/modules/finance/pages/AdvertisingDashboardPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { AdCampaignCard } from '../components/AdCampaignCard'
import { advertisingService } from '../services/advertisingService'
import { advertisingCampaignService } from '../services/advertisingCampaignService'
import { formatCurrency } from '../config/financeConfig'
import {
  Megaphone,
  Eye,
  MousePointerClick,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react'

export function AdvertisingDashboardPage() {
  const [inventory, setInventory] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [revenueSummary, setRevenueSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [invRes, cmpRes, revRes] = await Promise.all([
        advertisingService.getInventory(),
        advertisingCampaignService.getCampaigns(),
        advertisingService.getRevenueSummary(),
      ])
      setInventory(invRes)
      setCampaigns(cmpRes)
      setRevenueSummary(revRes)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const activeCampaigns = campaigns.filter(c => c.status === 'Active')
  const scheduledCampaigns = campaigns.filter(c => c.status === 'Scheduled')
  const pendingCampaigns = campaigns.filter(c => c.status === 'Pending Approval')

  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0)
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0)

  const handleApprove = async (id) => {
    try {
      await advertisingCampaignService.approveCampaign(id, 'Campus Commercial Board')
      loadData()
    } catch (err) {
      alert('Approval failed')
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Institutional Advertising & Sponsored Campaigns"
        description="Digital campus monetization ecosystem: placements, sponsored banners, student hackathons, and corporate partner campaigns."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="text-xs">
              <Link to="/finance/advertising/inventory">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Ad Inventory Placements
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs">
              <Link to="/finance/advertising/campaigns/new">
                <Plus className="h-3.5 w-3.5 mr-1" />
                New Ad Campaign
              </Link>
            </Button>
          </div>
        }
      />

      {/* Accounting Isolation Banner */}
      <div className="p-3.5 bg-indigo-50/60 border border-indigo-200 rounded-lg flex items-center justify-between text-xs text-indigo-950">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
          <span>
            <strong>Strict Accounting Isolation:</strong> Advertising revenue is tracked in a dedicated commercial ledger completely separated from student tuition accounts, fee collections, and scholarships.
          </span>
        </div>
        <Badge variant="outline" className="bg-white text-indigo-800 border-indigo-300 text-[10px]">
          Audited Separately
        </Badge>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-3 border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400">Active Campaigns</div>
          <div className="text-xl font-black text-slate-900 mt-1">{activeCampaigns.length}</div>
          <div className="text-[10px] text-emerald-600 font-medium">Currently serving</div>
        </Card>

        <Card className="p-3 border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400">Scheduled</div>
          <div className="text-xl font-black text-slate-900 mt-1">{scheduledCampaigns.length}</div>
          <div className="text-[10px] text-blue-600 font-medium">Upcoming starts</div>
        </Card>

        <Card className="p-3 border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Impressions</div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalImpressions.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-400">Views tracked</div>
        </Card>

        <Card className="p-3 border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Clicks</div>
          <div className="text-xl font-black text-slate-900 mt-1">{totalClicks.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-400">Engagements</div>
        </Card>

        <Card className="p-3 border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400">Average CTR</div>
          <div className="text-xl font-black text-indigo-700 mt-1">3.6%</div>
          <div className="text-[10px] text-indigo-600 font-medium">High relevance</div>
        </Card>

        <Card className="p-3 border-slate-200 bg-emerald-50/20">
          <div className="text-[10px] uppercase font-bold text-emerald-800">Commercial Revenue</div>
          <div className="text-xl font-black text-emerald-800 mt-1">{formatCurrency(totalRevenue)}</div>
          <div className="text-[10px] text-emerald-600 font-medium">Recognized revenue</div>
        </Card>
      </div>

      {/* Pending Approvals Notice (if any) */}
      {pendingCampaigns.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader className="py-2.5 px-4 border-b border-amber-200/60 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-amber-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              Campaigns Awaiting Institutional Authorization ({pendingCampaigns.length})
            </CardTitle>
            <Button variant="outline" size="sm" asChild className="h-6 text-[11px] bg-white">
              <Link to="/finance/advertising/campaigns">View Approval Queue</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {pendingCampaigns.map((c) => (
              <div key={c.id} className="p-2.5 bg-white rounded border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{c.name}</span>
                  <span className="text-slate-500 ml-2">by {c.company} ({formatCurrency(c.budget)})</span>
                </div>
                <Button size="sm" className="h-6 text-[11px] bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(c.id)}>
                  Authorize Campaign
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Featured / Active Campaigns Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Active & Scheduled Sponsored Campaigns
          </h3>
          <Button variant="ghost" size="sm" asChild className="text-xs text-blue-600 h-7">
            <Link to="/finance/advertising/campaigns">
              View All Campaigns ({campaigns.length})
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {campaigns.slice(0, 3).map((cmp) => (
            <AdCampaignCard key={cmp.id} campaign={cmp} onApprove={handleApprove} />
          ))}
        </div>
      </div>
    </div>
  )
}
