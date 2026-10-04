// src/modules/finance/pages/FeeStructuresListPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { FeeStructureCard } from '../components/FeeStructureCard'
import { feeStructureService } from '../services/feeStructureService'
import { Layers, Plus, Search } from 'lucide-react'

export function FeeStructuresListPage() {
  const [structures, setStructures] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [campusFilter, setCampusFilter] = useState('all')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await feeStructureService.getFeeStructures({
        campusId: campusFilter,
        search,
      })
      setStructures(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [campusFilter, search])

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Fee Structure Management"
        description="Configure academic fee schedules, components, and installment timelines mapped to campuses, programs, and classes."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="text-xs">
              <Link to="/finance/fee-components">
                View Fee Components
              </Link>
            </Button>
            <Button size="sm" asChild className="text-xs bg-blue-600 hover:bg-blue-700 shadow-xs">
              <Link to="/finance/fee-structures/new">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Create Fee Structure
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
            placeholder="Search fee structures by name or program..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={campusFilter} onValueChange={setCampusFilter}>
            <SelectTrigger className="w-44 text-xs h-8">
              <SelectValue placeholder="All Campuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Campuses</SelectItem>
              <SelectItem value="campus-main" className="text-xs">Main Campus</SelectItem>
              <SelectItem value="campus-south" className="text-xs">South City Campus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid of Fee Structure Cards */}
      {structures.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Fee Structures Configured"
          description="There are no fee structures matching your current campus filter or search criteria."
          actionLabel="Create Fee Structure"
          onAction={() => window.location.href = '/finance/fee-structures/new'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {structures.map((fs) => (
            <FeeStructureCard key={fs.id} structure={fs} />
          ))}
        </div>
      )}
    </div>
  )
}
