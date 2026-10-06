// src/modules/finance/pages/FeeComponentsPage.jsx
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
import { feeStructureService } from '../services/feeStructureService'
import {
  FEE_COMPONENT_TYPES,
  FEE_FREQUENCIES,
  formatCurrency,
} from '../config/financeConfig'
import { Plus, Search, Layers, Filter } from 'lucide-react'

export function FeeComponentsPage() {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [addModalOpen, setAddModalOpen] = useState(false)

  // New component form
  const [compName, setCompName] = useState('')
  const [compType, setCompType] = useState('Tuition Fee')
  const [compFreq, setCompFreq] = useState('Annual')
  const [compAmount, setCompAmount] = useState(15000)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await feeStructureService.getAllComponents()
      setComponents(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = components.filter(c => {
    if (typeFilter !== 'all' && c.type !== typeFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleCreateComponent = async (e) => {
    e.preventDefault()
    if (!compName) return
    try {
      await feeStructureService.addComponent('fs-btech-cse-y1', {
        name: compName,
        type: compType,
        frequency: compFreq,
        amount: compAmount,
      })
      setAddModalOpen(false)
      setCompName('')
      loadData()
    } catch (err) {
      alert(err.message || 'Failed to create component')
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Fee Components Catalog"
        description="Comprehensive repository of institutional fee items, frequency classifications, and tax applicability rules."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Fee Component
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search component name..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48 text-xs h-8">
              <SelectValue placeholder="All Component Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Component Types</SelectItem>
              {FEE_COMPONENT_TYPES.map(t => (
                <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table of Components */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Component Name</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Associated Fee Structure</th>
                  <th className="py-2.5 px-4">Frequency</th>
                  <th className="py-2.5 px-4">Due Date</th>
                  <th className="py-2.5 px-4">Mandatory</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c, idx) => (
                  <tr key={`${c.id}-${idx}`} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-2.5 px-4">
                      <Badge variant="outline" className="text-[10px] bg-slate-50">
                        {c.type}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 truncate max-w-xs">
                      <Link to={`/finance/fee-structures/${c.feeStructureId}`} className="hover:underline text-blue-600">
                        {c.feeStructureName}
                      </Link>
                    </td>
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
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Component Dialog */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Create New Fee Component
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateComponent} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Component Name *</label>
              <Input
                placeholder="e.g. Advanced Robotics Lab Fee"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Component Type</label>
                <Select value={compType} onValueChange={setCompType}>
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">Frequency</label>
                <Select value={compFreq} onValueChange={setCompFreq}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FEE_FREQUENCIES.map(f => (
                      <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Base Amount (₹) *</label>
              <Input
                type="number"
                min="0"
                value={compAmount}
                onChange={(e) => setCompAmount(Number(e.target.value))}
                required
                className="text-xs font-bold"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Save Component
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
