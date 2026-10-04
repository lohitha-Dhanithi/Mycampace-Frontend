// src/modules/finance/pages/LoanProductsListPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { LoanProductCard } from '../components/LoanProductCard'
import { LoanApplicationModal } from '../components/LoanApplicationModal'
import { dhanitiPayService } from '../services/dhanitiPayService'
import { Landmark, Search, ShieldCheck } from 'lucide-react'

export function LoanProductsListPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await dhanitiPayService.getFinancialProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.provider.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleApply = (product) => {
    setSelectedProduct(product)
    setApplyModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="DhanitiPay Education Loan Catalog"
        description="Transparent educational credit products with zero collateral options, competitive student interest rates, and flexible tenure."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="text-xs">
              <Link to="/finance/financial-services/applications">
                My Loan Applications
              </Link>
            </Button>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search loan products or partner banks..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {filtered.length} products available for active students
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((prod) => (
          <LoanProductCard key={prod.id} product={prod} onApply={handleApply} />
        ))}
      </div>

      <LoanApplicationModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => loadData()}
      />
    </div>
  )
}
