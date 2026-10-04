// src/modules/finance/pages/LoanProductDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { LoanApplicationModal } from '../components/LoanApplicationModal'
import { dhanitiPayService } from '../services/dhanitiPayService'
import { formatCurrency } from '../config/financeConfig'
import {
  Landmark,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  Clock,
  Percent,
} from 'lucide-react'

export function LoanProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applyModalOpen, setApplyModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await dhanitiPayService.getFinancialProductById(id)
      setProduct(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading product terms...</div>
  }

  if (!product) {
    return <div className="p-8 text-center text-xs text-slate-500">Product not found.</div>
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title={product.name}
        description={`Financed via DhanitiPay Banking Partner: ${product.provider}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link to="/finance/financial-services/loans">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Loan Catalog
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={() => setApplyModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs"
            >
              Apply for Loan
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        }
      />

      {/* Distinction Banner: Indicative Info vs Final Terms */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-950 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold uppercase tracking-wider text-[11px] text-amber-900">
            Important Regulatory Disclosure: Indicative Terms vs. Final Sanction
          </div>
          <p className="leading-relaxed">
            {product.indicativeDisclaimer} MyCampace Education ERP does not issue sanctions or make lending decisions. Official loan approval and final APR are determined exclusively by {product.provider}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Key Parameters */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Indicative Financial Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Sanction Amount Range</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">
                  {formatCurrency(product.minAmount)} – {formatCurrency(product.maxAmount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Tenure Range</span>
                  <span className="font-bold text-slate-800">{product.tenureMinMonths} – {product.tenureMaxMonths} Months</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase text-[10px]">Indicative APR</span>
                  <span className="font-bold text-emerald-700">{product.indicativeInterestRate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div>
                  <span className="text-slate-400 block font-medium">Processing Fee:</span>
                  <span className="font-semibold text-slate-800">{product.processingFee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Moratorium Period:</span>
                  <span className="font-semibold text-slate-800">{product.moratoriumPeriod}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Eligible Expenses:</span>
                  <span className="text-slate-700">{product.purpose}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  size="sm"
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  Start Loan Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center & Right Column: Eligibility, Documents & Features */}
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility Criteria */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Institutional Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {product.eligibilityCriteria?.map((criterion, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{criterion}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Required Digital Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {product.requiredDocuments?.map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{doc.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {doc.mandatory ? 'Mandatory' : 'Optional'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Product Key Highlights */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student & Parent Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {product.features?.map((feat, idx) => (
                <div key={idx} className="p-2.5 bg-blue-50/50 border border-blue-100 rounded text-blue-900 font-medium">
                  • {feat}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <LoanApplicationModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        product={product}
      />
    </div>
  )
}
