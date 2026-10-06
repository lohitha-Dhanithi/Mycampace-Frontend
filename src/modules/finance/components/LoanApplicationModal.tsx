// src/modules/finance/components/LoanApplicationModal.jsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { dhanitiPayService } from '../services/dhanitiPayService'
import { formatCurrency } from '../config/financeConfig'
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Lock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'

export interface LoanApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  product?: any
  initialStudent?: any
  onSuccess?: (res?: any) => void | Promise<void>
}

export function LoanApplicationModal({ isOpen, onClose, product, initialStudent, onSuccess }: LoanApplicationModalProps) {
  const [step, setStep] = useState(1) // 1: Pre-check, 2: Applicant & Edu, 3: Financial & Docs, 4: Consent & Submit, 5: Confirmed
  const [loading, setLoading] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState(null)
  const [applicationResult, setApplicationResult] = useState(null)

  // Form State
  const [applicantType, setApplicantType] = useState('Parent / Guardian')
  const [applicantName, setApplicantName] = useState('Rajesh Sharma')
  const [applicantMobile, setApplicantMobile] = useState('+91 98765 43210')
  const [applicantEmail, setApplicantEmail] = useState('rajesh.sharma@example.com')
  const [studentId, setStudentId] = useState(initialStudent?.studentId || 'STU-2026-0001')
  const [studentName, setStudentName] = useState(initialStudent?.studentName || 'Aarav Sharma')
  const [requestedAmount, setRequestedAmount] = useState(product ? product.minAmount * 2 : 120000)
  const [tenureMonths, setTenureMonths] = useState(24)
  const [annualIncome, setAnnualIncome] = useState(650000)
  const [panNumber, setPanNumber] = useState('ABCDE1234F')
  const [aadhaarNumber, setAadhaarNumber] = useState('9876 5432 1098')
  const [consentCaptured, setConsentCaptured] = useState(false)

  if (!product) return null

  const handlePreCheck = async () => {
    setLoading(true)
    try {
      const res = await dhanitiPayService.checkEligibility({
        studentId,
        annualIncome,
        requestedAmount,
        coApplicantType: applicantType,
      })
      setEligibilityResult(res)
      setStep(2)
    } catch (err) {
      alert(err.message || 'Eligibility check failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!consentCaptured) {
      alert('You must provide explicit consent before transmitting your details to DhanitiPay.')
      return
    }
    setLoading(true)
    try {
      const res = await dhanitiPayService.createLoanApplication({
        productId: product.id,
        productName: product.name,
        provider: product.provider,
        studentId,
        studentName,
        applicantType,
        applicantName,
        applicantMobile,
        applicantEmail,
        requestedAmount,
        tenureMonths,
        annualIncome,
        panNumber,
        aadhaarNumber,
        consentCaptured: true,
        documents: [
          { name: `PAN Card (${applicantType})` },
          { name: 'Income Statement / Salary Slip' },
          { name: 'University Admission Letter / Fee Demand' },
        ],
      })
      setApplicationResult(res)
      setStep(5)
      if (onSuccess) onSuccess(res)
    } catch (err) {
      alert(err.message || 'Application submission failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setEligibilityResult(null)
    setApplicationResult(null)
    setConsentCaptured(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border-blue-200">
              DhanitiPay Gateway
            </Badge>
            <span className="text-xs text-slate-400 font-medium">Step {step} of 4</span>
          </div>
          <DialogTitle className="text-base font-bold text-slate-900 mt-1">
            Apply for {product.name}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Institutional Partner: <span className="font-semibold text-slate-700">{product.provider}</span>
          </p>
        </DialogHeader>

        {/* STEP 1: PRE-CHECK */}
        {step === 1 && (
          <div className="py-2 space-y-4">
            <div className="p-3 bg-blue-50/60 rounded-md border border-blue-100 text-xs text-blue-900">
              <span className="font-bold">Instant Eligibility Pre-Check:</span> This digital inquiry will not impact your credit bureau score.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Requested Loan Amount (₹)
                </label>
                <Input
                  type="number"
                  min={product.minAmount}
                  max={product.maxAmount}
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className="text-xs font-semibold"
                />
                <span className="text-[10px] text-slate-400">Min: {formatCurrency(product.minAmount)} | Max: {formatCurrency(product.maxAmount)}</span>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Preferred Tenure
                </label>
                <Select value={String(tenureMonths)} onValueChange={(v) => setTenureMonths(Number(v))}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select tenure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12" className="text-xs">12 Months (1 Year)</SelectItem>
                    <SelectItem value="24" className="text-xs">24 Months (2 Years)</SelectItem>
                    <SelectItem value="36" className="text-xs">36 Months (3 Years)</SelectItem>
                    <SelectItem value="48" className="text-xs">48 Months (4 Years)</SelectItem>
                    <SelectItem value="60" className="text-xs">60 Months (5 Years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Annual Household / Co-Applicant Income (₹)
              </label>
              <Input
                type="number"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="text-xs font-semibold"
                placeholder="e.g. 600000"
              />
              <span className="text-[10px] text-slate-400">Verifiable via ITR or 6 months salary bank statement</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Primary Borrower / Applicant
              </label>
              <Select value={applicantType} onValueChange={setApplicantType}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select applicant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parent / Guardian" className="text-xs">Parent / Guardian (Recommended for Students)</SelectItem>
                  <SelectItem value="Student" className="text-xs">Student (Self-Borrower if employed/scholar)</SelectItem>
                  <SelectItem value="Other Authorized Applicant" className="text-xs">Other Authorized Legal Sponsor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button size="sm" onClick={handlePreCheck} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? 'Evaluating...' : 'Check Eligibility'}
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* STEP 2: APPLICANT DETAILS */}
        {step === 2 && (
          <div className="py-2 space-y-4">
            {eligibilityResult && (
              <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">{eligibilityResult.message}</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Indicative APR: {eligibilityResult.indicativeAPR} | Pre-check Score: {eligibilityResult.score}/100</div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {applicantType} Details
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
                  <Input
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number *</label>
                  <Input
                    value={applicantMobile}
                    onChange={(e) => setApplicantMobile(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <Input
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">PAN Card Number *</label>
                  <Input
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="text-xs font-mono"
                    maxLength={10}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Institutional Student Context (Prefilled from MyCampace) */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
              <div className="font-bold text-slate-700">Student Institutional Verification</div>
              <div className="flex justify-between text-slate-500">
                <span>Enrolled Student:</span>
                <span className="font-semibold text-slate-800">{studentName} ({studentId})</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Institution:</span>
                <span className="text-slate-700 font-medium">MyCampace University (Verified)</span>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setStep(1)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back
              </Button>
              <Button size="sm" onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
                Next: Documentation
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* STEP 3: FINANCIAL & REQUIRED DOCUMENTS */}
        {step === 3 && (
          <div className="py-2 space-y-4">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Required Documents Verification
            </div>
            <p className="text-xs text-slate-500">
              Documents are encrypted in transit and shared exclusively with DhanitiPay underwriter partners.
            </p>

            <div className="space-y-2">
              {product.requiredDocuments?.map((doc, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">{doc.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-white text-emerald-700 border-emerald-300">
                    Ready for e-Upload
                  </Badge>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Lock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Security Guarantee:</span> MyCampace never shares financial or credit data with advertisers or third-party marketing services.
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setStep(2)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back
              </Button>
              <Button size="sm" onClick={() => setStep(4)} className="bg-blue-600 hover:bg-blue-700">
                Next: Consent
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* STEP 4: EXPLICIT CONSENT & SUBMISSION */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="py-2 space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Mandatory Legal Consent Authorization
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                "I authorize the sharing of the information provided in this application with DhanitiPay and the relevant financial service providers ({product.provider}) for the purpose of evaluating my application."
              </p>

              <div className="flex items-center gap-4 text-[11px] text-blue-600 font-medium">
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy policy: Data stored in ISO27001 encrypted vault.'); }} className="underline">
                  View Privacy Policy
                </a>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms: Final lending terms decided by lender.'); }} className="underline">
                  View Terms & Conditions
                </a>
                <a href="#consent" onClick={(e) => { e.preventDefault(); alert('Consent Details: Time-stamped with IP record.'); }} className="underline">
                  View Consent Audit
                </a>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-start gap-2.5">
                <Checkbox
                  id="consentCheckbox"
                  checked={consentCaptured}
                  onCheckedChange={setConsentCaptured}
                  className="mt-0.5"
                />
                <label htmlFor="consentCheckbox" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  I confirm that I am authorized to apply and explicitly agree to the above data authorization.
                </label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setStep(3)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!consentCaptured || loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? 'Submitting to DhanitiPay...' : 'Submit Application'}
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* STEP 5: APPLICATION CONFIRMED */}
        {step === 5 && applicationResult && (
          <div className="py-4 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Transmitted Successfully</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your application has been safely registered in the DhanitiPay integration layer.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">MyCampace App ID:</span>
                <span className="font-mono font-bold text-slate-800">{applicationResult.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">External DhanitiPay Ref:</span>
                <span className="font-mono font-bold text-blue-600">{applicationResult.externalApplicationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Initial Status:</span>
                <Badge variant="warning" className="text-[10px]">{applicationResult.currentStatus}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Amount:</span>
                <span className="font-bold text-emerald-700">{formatCurrency(applicationResult.requestedAmount)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="default" size="sm" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
