// src/modules/finance/pages/AdCampaignCreatePage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { advertisingCampaignService } from '../services/advertisingCampaignService'
import { advertisingService } from '../services/advertisingService'
import { formatCurrency } from '../config/financeConfig'
import {
  Megaphone,
  ArrowLeft,
  Save,
  ShieldCheck,
  Calendar,
  Lock,
  Eye,
  ExternalLink,
} from 'lucide-react'

export function AdCampaignCreatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [inventory, setInventory] = useState([])
  const [existingCampaign, setExistingCampaign] = useState(null)

  // Form State
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [advertiserName, setAdvertiserName] = useState('')
  const [contact, setContact] = useState('')
  const [placementId, setPlacementId] = useState('pl-student-dash')
  const [startDate, setStartDate] = useState('2026-10-01')
  const [endDate, setEndDate] = useState('2026-11-30')
  const [budget, setBudget] = useState(75000)
  const [targetAudience, setTargetAudience] = useState('Students (UG & PG)')
  const [creativeUrl, setCreativeUrl] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600')
  const [landingUrl, setLandingUrl] = useState('https://example.com/partner-offer')

  useEffect(() => {
    advertisingService.getInventory().then(setInventory)
    if (id && id !== 'new') {
      advertisingCampaignService.getCampaignById(id).then(c => {
        setExistingCampaign(c)
        setName(c.name)
        setCompany(c.company)
        setAdvertiserName(c.advertiserName)
        setContact(c.contact)
        setPlacementId(c.placementId)
        setStartDate(c.startDate)
        setEndDate(c.endDate)
        setBudget(c.budget)
        setTargetAudience(c.targetAudience)
        setCreativeUrl(c.creativeUrl)
        setLandingUrl(c.landingUrl)
      }).catch(err => console.warn(err))
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const selectedPlacement = inventory.find(p => p.id === placementId)
      await advertisingCampaignService.createCampaign({
        name,
        company,
        advertiserName,
        contact,
        placementId,
        placementName: selectedPlacement ? selectedPlacement.name : 'Campus Digital Display',
        startDate,
        endDate,
        budget: Number(budget),
        targetAudience,
        creativeUrl,
        landingUrl,
      })
      navigate('/finance/advertising/campaigns')
    } catch (err) {
      alert(err.message || 'Failed to submit campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      <FinanceNavigation />

      <PageHeader
        title={existingCampaign ? `Campaign: ${existingCampaign.name}` : 'Create Sponsored Ad Campaign'}
        description="Book institutional digital placements for corporate partners, student hackathons, and certified educational services."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link to="/finance/advertising/campaigns">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Campaigns
              </Link>
            </Button>
            {!existingCampaign && (
              <Button type="submit" size="sm" disabled={loading} className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs">
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {loading ? 'Submitting...' : 'Submit for Authorization'}
              </Button>
            )}
          </div>
        }
      />

      {/* Privacy Guarantee Notice */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-blue-600 shrink-0" />
          <span>
            <strong>Zero Student Data Exposure Guarantee:</strong> Advertisers receive strictly aggregated impressions and click metrics. No individual student identities, email addresses, or academic records are ever shared.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Advertiser & Campaign Details */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Advertiser / Sponsor Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Company / Organization *</label>
                <Input
                  placeholder="e.g. Amazon Web Services Educate"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  className="text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Representative *</label>
                  <Input
                    placeholder="e.g. Rajesh Malhotra"
                    value={advertiserName}
                    onChange={(e) => setAdvertiserName(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Official Email Address *</label>
                  <Input
                    type="email"
                    placeholder="e.g. partnerships@partner.com"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Campaign Parameters & Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Campaign Title *</label>
                <Input
                  placeholder="e.g. AWS Cloud Computing Certification Scholarship"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Placement Inventory Slot *</label>
                <Select value={placementId} onValueChange={setPlacementId}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map((pl) => (
                      <SelectItem key={pl.id} value={pl.id} className="text-xs">
                        {pl.name} ({pl.format} — {pl.pricingModel})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Start Date *</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">End Date *</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Gross Campaign Budget (₹) *</label>
                <Input
                  type="number"
                  min="5000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  required
                  className="text-xs font-bold"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Creative & Audience Targeting */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Audience Targeting & Placement Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Audience Cohort *</label>
                <Select value={targetAudience} onValueChange={setTargetAudience}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Students (UG & PG)" className="text-xs">Enrolled Students (UG & PG)</SelectItem>
                    <SelectItem value="Parents & Guardians" className="text-xs">Parents & Guardians</SelectItem>
                    <SelectItem value="Graduating Students (Year 3 & 4)" className="text-xs">Graduating Cohort (Year 3 & 4)</SelectItem>
                    <SelectItem value="Faculty & Staff" className="text-xs">Faculty & Administrative Staff</SelectItem>
                    <SelectItem value="Alumni" className="text-xs">University Alumni Network</SelectItem>
                    <SelectItem value="All Campus Users" className="text-xs">All Portal Visitors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Landing Destination URL *</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={landingUrl}
                  onChange={(e) => setLandingUrl(e.target.value)}
                  required
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Creative Image Banner URL</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={creativeUrl}
                  onChange={(e) => setCreativeUrl(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>

              {creativeUrl && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Live Creative Preview:</span>
                  <div className="relative h-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-100">
                    <img src={creativeUrl} alt="Creative Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className="bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Sponsored
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
