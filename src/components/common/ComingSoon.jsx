// src/components/common/ComingSoon.jsx
import React from 'react'
import { Construction, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'

export function ComingSoon({ moduleName = 'This Module', description }) {
  const navigate = useNavigate()

  return (
    <div className="py-12 max-w-xl mx-auto">
      <Card className="border-slate-200 shadow-sm text-center">
        <CardContent className="pt-10 pb-8 px-6">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
            <Construction className="h-7 w-7" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <Sparkles className="h-3 w-3" /> Roadmap Phase 2
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{moduleName}</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
            {description ||
              `The ${moduleName} module is planned for the subsequent rollout phase of the MyCampace Education Operating System.`}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
            </Button>
            <Button size="sm" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
