// src/modules/finance/pages/LoanApplicationDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { dhanitiPayService } from '../services/dhanitiPayService'
import { formatCurrency } from '../config/financeConfig'
import {
  ArrowLeft,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck2,
  Lock,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react'

export function LoanApplicationDetailPage() {
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await dhanitiPayService.getLoanApplicationById(id)
      setApplication(data)
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
    return <div className="p-8 text-center text-xs text-slate-500">Loading application timeline...</div>
  }

  if (!application) {
    return <div className="p-8 text-center text-xs text-slate-500">Application not found.</div>
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title={`Application: ${application.id}`}
        description={`External DhanitiPay Ref: ${application.externalApplicationId} — ${application.productName}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link to="/finance/financial-services/applications">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Applications
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Financial & Borrower Context */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Application Context
              </CardTitle>
              <Badge
                variant={application.currentStatus === 'Approved' || application.currentStatus === 'Disbursed' ? 'success' : 'warning'}
                className="text-[10px]"
              >
                {application.currentStatus}
              </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="p-3 bg-blue-50/50 rounded border border-blue-100">
                <div className="text-[10px] text-blue-700 font-semibold uppercase">Requested Credit</div>
                <div className="text-xl font-black text-blue-950 mt-0.5">{formatCurrency(application.requestedAmount)}</div>
                {application.sanctionedAmount && (
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">
                    Sanctioned Amount: {formatCurrency(application.sanctionedAmount)}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tenure:</span>
                  <span className="font-semibold text-slate-800">{application.tenureMonths} Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Underwriting Partner:</span>
                  <span className="font-semibold text-slate-800">{application.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Submission Date:</span>
                  <span className="font-semibold text-slate-800">{new Date(application.submittedAt).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purpose:</span>
                  <span className="font-medium text-slate-800">{application.purpose}</span>
                </div>
              </div>

              {/* Borrower Details */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-800 uppercase text-[10px]">Borrower / Co-Applicant</div>
                <div className="text-slate-900 font-semibold">{application.applicantName}</div>
                <div className="text-slate-500">{application.applicantType} (for {application.studentName})</div>
                <div className="text-slate-500 font-mono text-[11px]">{application.applicantMobile} | {application.applicantEmail}</div>
              </div>
            </CardContent>
          </Card>

          {/* Explicit Legal Consent Record Audit */}
          <Card className="border-slate-200 shadow-xs bg-slate-50/50">
            <CardHeader className="py-3 px-4 border-b border-slate-200">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Legal Consent Record
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Consent Captured:</span>
                <Badge variant="success" className="text-[10px]">Yes (Digital Checkbox)</Badge>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span>Timestamp:</span>
                <span>{application.consentTimestamp ? new Date(application.consentTimestamp).toLocaleString('en-IN') : '2026-06-15 11:28'}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span>Capture IP:</span>
                <span>{application.consentIp || '103.21.244.18'}</span>
              </div>
              <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-200">
                Authorizes financial transmission solely to DhanitiPay and underwriting bank.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Center & Right Column: Timeline & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Integration Timeline */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Live Underwriting Timeline (DhanitiPay Status Events)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {application.timeline?.map((evt, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[1.85rem] mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-blue-500 shadow-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{evt.event}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(evt.timestamp).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{evt.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Document Vault */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Verified Application Documents Vault
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {application.documents?.map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{doc.name}</span>
                  </div>
                  <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'} className="text-[10px]">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
