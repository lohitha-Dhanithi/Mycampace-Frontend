// src/modules/finance/components/LoanProductCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '../config/financeConfig'
import { Landmark, ArrowRight, ShieldCheck, Clock, Percent } from 'lucide-react'

export function LoanProductCard({ product, onApply }) {
  return (
    <Card className="hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-[11px] font-semibold bg-white border-blue-200 text-blue-800">
            {product.badge}
          </Badge>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
            DhanitiPay
          </span>
        </div>
        <CardTitle className="text-base font-bold text-slate-900 mt-2">
          {product.name}
        </CardTitle>
        <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
          <Landmark className="h-3.5 w-3.5 text-blue-600" />
          Partner: {product.provider}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 pb-3">
        <p className="text-xs text-slate-600 line-clamp-2">
          {product.purpose}
        </p>

        {/* Finance Parameters */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Sanction Range</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {formatCurrency(product.minAmount)} – {formatCurrency(product.maxAmount)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Tenure Range</div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {product.tenureMinMonths} – {product.tenureMaxMonths} Months
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Indicative Rate</div>
            <div className="text-xs font-bold text-emerald-700 mt-0.5">
              {product.indicativeInterestRate}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Processing Fee</div>
            <div className="text-[11px] font-semibold text-slate-700 mt-0.5 truncate">
              {product.processingFee}
            </div>
          </div>
        </div>

        {/* Indicative Disclaimer notice */}
        <div className="text-[10px] text-slate-500 italic bg-amber-50/60 p-2 rounded border border-amber-100">
          * Indicative information only. Final sanctioned terms determined solely by partner lender.
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-lg">
        <Button variant="outline" size="sm" asChild className="h-8 text-xs">
          <Link to={`/finance/financial-services/loans/${product.id}`}>
            View Terms
          </Link>
        </Button>
        <Button
          size="sm"
          className="h-8 text-xs bg-blue-600 hover:bg-blue-700 shadow-xs"
          onClick={() => onApply && onApply(product)}
        >
          Apply Now
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}
