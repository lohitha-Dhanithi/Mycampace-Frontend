// src/modules/finance/pages/AdInventoryPage.jsx
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
import { advertisingService } from '../services/advertisingService'
import { formatCurrency, AD_PRICING_MODELS } from '../config/financeConfig'
import { Layers, Plus, Search, Eye, Monitor, Smartphone, Mail } from 'lucide-react'

export function AdInventoryPage() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [format, setFormat] = useState('Leaderboard')
  const [dimensions, setDimensions] = useState('728x90 px')
  const [audience, setAudience] = useState('Students')
  const [pricingModel, setPricingModel] = useState('CPM')
  const [baseRate, setBaseRate] = useState(250)
  const [dailyCapacity, setDailyCapacity] = useState(10000)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await advertisingService.getInventory({ search })
      setInventory(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [search])

  const handleCreatePlacement = async (e) => {
    e.preventDefault()
    if (!name || !location) return
    try {
      await advertisingService.createPlacement({
        name,
        location,
        format,
        dimensions,
        audience,
        pricingModel,
        baseRate: Number(baseRate),
        dailyImpressionCapacity: Number(dailyCapacity),
      })
      setCreateModalOpen(false)
      setName('')
      setLocation('')
      loadData()
    } catch (err) {
      alert(err.message || 'Failed to create placement')
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Advertising Inventory & Placement Slots"
        description="Configure institution-approved digital ad units, formats, pricing structures, and capacity limits."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Placement Slot
            </Button>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search slot name or location..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Placement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {inventory.map((pl) => (
          <Card key={pl.id} className="border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-[10px] bg-slate-50 font-mono">
                  {pl.format}
                </Badge>
                <Badge variant={pl.status === 'Active' ? 'success' : 'secondary'} className="text-[10px]">
                  {pl.status}
                </Badge>
              </div>
              <CardTitle className="text-sm font-bold text-slate-900 mt-2">
                {pl.name}
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                Location: {pl.location}
              </p>
            </CardHeader>

            <CardContent className="space-y-2.5 py-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pricing Model</span>
                  <span className="font-extrabold text-blue-900 mt-0.5 block">{pl.pricingModel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Base Commercial Rate</span>
                  <span className="font-extrabold text-emerald-700 mt-0.5 block">
                    {formatCurrency(pl.baseRate)} {pl.pricingModel === 'CPM' ? '/ 1k views' : pl.pricingModel === 'CPC' ? '/ click' : '/ mo'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Dimensions:</span>
                  <span className="font-mono text-slate-800">{pl.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Audience:</span>
                  <span className="font-medium text-slate-800">{pl.audience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Daily View Capacity:</span>
                  <span className="font-medium text-slate-800">{pl.dailyImpressionCapacity?.toLocaleString('en-IN') || '10,000'}</span>
                </div>
              </div>
            </CardContent>

            <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-lg flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono text-[10px]">ID: {pl.id}</span>
              <span className="text-blue-700 font-semibold">{pl.activeCampaignsCount || 1} Active Sponsors</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Placement Dialog */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Create Ad Inventory Placement Slot
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePlacement} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Placement Title *</label>
              <Input
                placeholder="e.g. LMS Global Course Player Header"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Location on Portal *</label>
              <Input
                placeholder="e.g. Student Portal Right Rail / Bottom Sheet"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Format</label>
                <Input
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Dimensions</label>
                <Input
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Pricing Model</label>
                <Select value={pricingModel} onValueChange={setPricingModel}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AD_PRICING_MODELS.map(m => (
                      <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Base Commercial Rate (₹)</label>
                <Input
                  type="number"
                  min="1"
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  className="text-xs font-bold"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Publish Placement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
