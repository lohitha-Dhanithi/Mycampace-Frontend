// src/modules/finance/services/dhanitiPayService.js
// DhanitiPay Financial Services Integration Service Layer
import { INITIAL_FINANCIAL_PRODUCTS, INITIAL_LOAN_APPLICATIONS } from '../data/dhanitiPayMockData'

let products = [...INITIAL_FINANCIAL_PRODUCTS]
let applications = [...INITIAL_LOAN_APPLICATIONS]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const dhanitiPayService = {
  getFinancialProducts: async (filters?: any) => {
    await delay(120)
    return [...products]
  },

  getFinancialProductById: async (id) => {
    await delay(100)
    const found = products.find(p => p.id === id)
    if (!found) throw new Error(`Product ${id} not found in DhanitiPay catalog`)
    return { ...found }
  },

  checkEligibility: async ({ studentId, annualIncome, requestedAmount, coApplicantType }) => {
    await delay(180)
    // Pre-check simulation against DhanitiPay rules engine
    const income = Number(annualIncome || 0)
    const amount = Number(requestedAmount || 0)
    const isEligible = income >= 250000 && amount <= 1500000

    return {
      eligible: isEligible,
      score: isEligible ? 88 : 54,
      maxEligibleAmount: Math.min(amount, income * 2.5),
      indicativeAPR: '9.5% – 10.75%',
      message: isEligible
        ? 'Pre-check successful. High likelihood of in-principle sanction by institutional partner lenders.'
        : 'Additional guarantor or higher verifiable income documentation will be required for this loan tier.',
    }
  },

  getLoanApplications: async (filters: any = {}) => {
    await delay(120)
    let list = [...applications]
    if (filters.status && filters.status !== 'all') {
      list = list.filter(a => a.currentStatus.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.studentId) {
      list = list.filter(a => a.studentId === filters.studentId)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(a =>
        a.id.toLowerCase().includes(q) ||
        a.externalApplicationId.toLowerCase().includes(q) ||
        a.studentName.toLowerCase().includes(q) ||
        a.productName.toLowerCase().includes(q) ||
        a.applicantName.toLowerCase().includes(q)
      )
    }
    return list
  },

  getLoanApplicationById: async (id) => {
    await delay(100)
    const found = applications.find(a => a.id === id || a.externalApplicationId === id)
    if (!found) throw new Error(`Loan application ${id} not found in DhanitiPay records`)
    return { ...found }
  },

  createLoanApplication: async (formData) => {
    await delay(250)
    if (!formData.consentCaptured) {
      throw new Error('Explicit consent is legally required before submitting an application to DhanitiPay.')
    }

    const newAppId = `APP-DP-2026-${String(applications.length + 5).padStart(3, '0')}`
    const externalAppId = `DP-LN-${Math.floor(889300 + Math.random() * 900)}`
    const now = new Date().toISOString()

    const newApp = {
      id: newAppId,
      externalApplicationId: externalAppId,
      productId: formData.productId,
      productName: formData.productName || 'DhanitiPay Student Education Prime',
      provider: formData.provider || 'Axis Bank & Credila Consortium',
      studentId: formData.studentId,
      studentName: formData.studentName,
      applicantType: formData.applicantType || 'Parent / Guardian',
      applicantName: formData.applicantName,
      applicantMobile: formData.applicantMobile,
      applicantEmail: formData.applicantEmail,
      requestedAmount: Number(formData.requestedAmount || 0),
      sanctionedAmount: null,
      tenureMonths: Number(formData.tenureMonths || 24),
      purpose: formData.purpose || 'University Tuition & Hostel Fees',
      currentStatus: 'Submitted',
      submittedAt: now,
      lastUpdatedAt: now,
      consentCaptured: true,
      consentTimestamp: now,
      consentIp: '103.45.18.92',
      timeline: [
        { event: 'Application Created in MyCampace', timestamp: now, note: 'Pre-check completed' },
        { event: 'Explicit Consent Captured & Stored', timestamp: now, note: 'Applicant authorized DhanitiPay financial transmission' },
        { event: 'Transmitted to DhanitiPay API Gateway', timestamp: now, note: `Assigned External Ref ${externalAppId}` },
        { event: 'Under Review by Credit Underwriter', timestamp: now, note: 'Preliminary document audit initiated' },
      ],
      documents: (formData.documents || []).map(d => ({
        name: d.name,
        status: 'Uploaded',
        url: '#',
      })),
    }

    applications.unshift(newApp)
    return newApp
  },

  uploadRequiredDocument: async (applicationId, documentName) => {
    await delay(150)
    const app = applications.find(a => a.id === applicationId)
    if (!app) throw new Error('Application not found')
    app.documents.push({
      name: documentName,
      status: 'Uploaded',
      url: '#',
    })
    app.timeline.push({
      event: `Document Uploaded: ${documentName}`,
      timestamp: new Date().toISOString(),
      note: 'Transmitted to DhanitiPay document vault',
    })
    app.lastUpdatedAt = new Date().toISOString()
    return app
  },

  getApplicationStatus: async (id) => {
    await delay(100)
    const app = await dhanitiPayService.getLoanApplicationById(id)
    return {
      id: app.id,
      externalApplicationId: app.externalApplicationId,
      status: app.currentStatus,
      lastUpdated: app.lastUpdatedAt,
      timeline: app.timeline,
    }
  },
}
