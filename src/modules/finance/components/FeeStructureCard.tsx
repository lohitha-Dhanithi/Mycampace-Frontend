// src/modules/finance/components/FeeStructureCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '../config/financeConfig'
import { Calendar, Building, Layers, Eye, Edit3 } from 'lucide-react'

export interface FeeStructureCardProps {
  structure: any
  onEdit?: (st: any) => void
}

export function FeeStructureCard({ structure, onEdit }: FeeStructureCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-[11px] font-mono bg-slate-50 border-slate-300">
            {structure.academicYearName}
          </Badge>
          <Badge variant={structure.status === 'Active' ? 'success' : 'secondary'} className="text-[10px]">
            {structure.status}
          </Badge>
        </div>
        <CardTitle className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">
          {structure.name}
        </CardTitle>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
          {structure.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        <div className="p-3 bg-blue-50/60 rounded-md border border-blue-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-blue-800 uppercase tracking-wider">Total Annual Fee</div>
            <div className="text-xl font-black text-blue-900 mt-0.5">{formatCurrency(structure.totalAnnualAmount)}</div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              {structure.components?.length || 0} Components
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{structure.campusName}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{structure.className || structure.programName}</span>
          </div>
        </div>

        {structure.installments?.length > 0 && (
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
              <span>Installment Schedule</span>
              <span className="text-slate-400 font-normal">{structure.installments.length} Terms</span>
            </div>
            <div className="space-y-1">
              {structure.installments.slice(0, 3).map((inst, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600">
                  <span className="truncate">{inst.name}</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(inst.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50 rounded-b-lg">
        <Button variant="outline" size="sm" asChild className="h-7 text-xs">
          <Link to={`/finance/fee-structures/${structure.id}`}>
            <Eye className="h-3.5 w-3.5 mr-1" />
            Details
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild className="h-7 text-xs">
          <Link to={`/finance/fee-structures/${structure.id}/edit`}>
            <Edit3 className="h-3.5 w-3.5 mr-1" />
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
