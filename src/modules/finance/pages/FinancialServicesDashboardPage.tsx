// src/modules/finance/pages/FinancialServicesDashboardPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { LoanProductCard } from '../components/LoanProductCard'
import { LoanApplicationModal } from '../components/LoanApplicationModal'
import { dhanitiPayService } from '../services/dhanitiPayService'
import { formatCurrency } from '../config/financeConfig'
import {
  Landmark,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  FileCheck2,
  Lock,
  Layers,
} from 'lucide-react'

export function FinancialServicesDashboardPage() {
  const [products, setProducts] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [prodRes, appRes] = await Promise.all([
        dhanitiPayService.getFinancialProducts(),
        dhanitiPayService.getLoanApplications(),
      ])
      setProducts(prodRes)
      setApplications(appRes)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const inProgressCount = applications.filter(a => ['Submitted', 'Under Review', 'Additional Information Required'].includes(a.currentStatus)).length
  const approvedCount = applications.filter(a => a.currentStatus === 'Approved').length
  const disbursedCount = applications.filter(a => a.currentStatus === 'Disbursed').length

  const handleApply = (product) => {
    setSelectedProduct(product)
    setApplyModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="DhanitiPay Financial Services Integration"
        description="Institutional education loan product discovery, eligibility pre-checks, digital sanction tracking, and student loan applications."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="text-xs">
              <Link to="/finance/financial-services/applications">
                <FileCheck2 className="h-3.5 w-3.5 mr-1" />
                All Applications ({applications.length})
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs">
              <Link to="/finance/financial-services/loans">
                Discover All Loans
              </Link>
            </Button>
          </div>
        }
      />

      {/* Security & Regulatory Notice */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
              DhanitiPay Secured Lending Protocol
            </span>
          </div>
          <h3 className="text-base font-bold">
            Controlled Integration Layer for Educational Credit
          </h3>
          <p className="text-xs text-blue-200/90 max-w-2xl leading-relaxed">
            MyCampace does not operate a lending engine or make credit underwriting decisions. All financial products, eligibility criteria, and sanction letters are governed directly by regulated banking partners via DhanitiPay.
          </p>
        </div>
        <Badge className="bg-blue-800 text-blue-100 border-blue-700 text-xs px-3 py-1">
          RBI Regulated Partners
        </Badge>
      </div>

      {/* Application Operational Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Applications</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{applications.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Submitted via MyCampace</div>
        </Card>

        <Card className="p-4 border-slate-200 shadow-xs bg-amber-50/20">
          <div className="text-[10px] uppercase font-bold text-amber-700">Under Review / Verification</div>
          <div className="text-2xl font-black text-amber-700 mt-1">{inProgressCount}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Lender credit underwriting</div>
        </Card>

        <Card className="p-4 border-slate-200 shadow-xs bg-blue-50/20">
          <div className="text-[10px] uppercase font-bold text-blue-700">Sanctions Approved</div>
          <div className="text-2xl font-black text-blue-800 mt-1">{approvedCount}</div>
          <div className="text-[10px] text-blue-600 mt-0.5">In-principle offer letters</div>
        </Card>

        <Card className="p-4 border-slate-200 shadow-xs bg-emerald-50/20">
          <div className="text-[10px] uppercase font-bold text-emerald-700">Tuition Disbursed</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{disbursedCount}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Credited to university escrow</div>
        </Card>
      </div>

      {/* Available Loan Products Showcase */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Available DhanitiPay Credit Products
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Verified partner programs available for eligible students and parents</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs text-blue-600 h-7">
            <Link to="/finance/financial-services/loans">
              View All Products ({products.length})
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {products.map((p) => (
            <LoanProductCard key={p.id} product={p} onApply={handleApply} />
          ))}
        </div>
      </div>

      {/* Recent Applications Feed */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Loan Applications
            </CardTitle>
            <p className="text-[11px] text-slate-500 mt-0.5">Live status tracked with external DhanitiPay references</p>
          </div>
          <Button variant="outline" size="sm" asChild className="h-7 text-xs">
            <Link to="/finance/financial-services/applications">
              View All
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">MyCampace App ID</th>
                <th className="py-2.5 px-4">DhanitiPay Ref</th>
                <th className="py-2.5 px-4">Product</th>
                <th className="py-2.5 px-4">Borrower / Applicant</th>
                <th className="py-2.5 px-4 text-right">Requested</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.slice(0, 4).map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-4 font-mono font-medium text-blue-700">
                    <Link to={`/finance/financial-services/applications/${a.id}`} className="hover:underline">
                      {a.id}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">
                    {a.externalApplicationId}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    {a.productName}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-slate-900">{a.applicantName}</div>
                    <div className="text-[10px] text-slate-400">{a.applicantType} for {a.studentName}</div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-slate-900">
                    {formatCurrency(a.requestedAmount)}
                  </td>
                  <td className="py-2.5 px-4">
                    <Badge
                      variant={a.currentStatus === 'Approved' || a.currentStatus === 'Disbursed' ? 'success' : 'warning'}
                      className="text-[10px]"
                    >
                      {a.currentStatus}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Button variant="ghost" size="sm" asChild className="h-6 text-xs text-blue-600">
                      <Link to={`/finance/financial-services/applications/${a.id}`}>
                        Track Status
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <LoanApplicationModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => loadData()}
      />
    </div>
  )
}
