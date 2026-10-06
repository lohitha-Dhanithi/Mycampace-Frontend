// src/services/entitlementService.js
import { productService } from './productService'

class EntitlementService {
  storageKey: string

  constructor() {
    this.storageKey = 'mycampace_entitlements'
    this.init()
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultEntitlements = [
        {
          id: 'ent-acad-1',
          organizationId: 'org-1',
          productId: 'academics',
          status: 'Active',
          plan: 'Enterprise Platform',
          startDate: '2026-01-01',
          endDate: '2027-12-31',
          limits: { maxCampuses: 10, maxStudents: 15000, maxFaculty: 1000 },
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-10-01T00:00:00Z',
        },
        {
          id: 'ent-lms-1',
          organizationId: 'org-1',
          productId: 'lms',
          status: 'Active',
          plan: 'Professional',
          startDate: '2026-01-01',
          endDate: '2027-12-31',
          limits: { maxStorageGB: 500, maxActiveCourses: 200 },
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-10-01T00:00:00Z',
        },
        {
          id: 'ent-fin-1',
          organizationId: 'org-1',
          productId: 'finance',
          status: 'Active',
          plan: 'Professional Suite',
          startDate: '2026-01-01',
          endDate: '2027-12-31',
          limits: { maxInvoicesPerYear: 50000, paymentGatewayIntegrations: 3 },
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-10-01T00:00:00Z',
        },
        {
          id: 'ent-adm-1',
          organizationId: 'org-1',
          productId: 'admissions',
          status: 'Active',
          plan: 'Growth CRM',
          startDate: '2026-01-01',
          endDate: '2027-12-31',
          limits: { maxLeadsPerYear: 20000 },
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-10-01T00:00:00Z',
        },
        {
          id: 'ent-hrms-1',
          organizationId: 'org-1',
          productId: 'hrms',
          status: 'Trial',
          plan: '14-Day Free Trial',
          startDate: '2026-10-01',
          endDate: '2026-10-15',
          limits: { maxStaff: 50 },
          createdAt: '2026-10-01T00:00:00Z',
          updatedAt: '2026-10-01T00:00:00Z',
        },
      ]
      localStorage.setItem(this.storageKey, JSON.stringify(defaultEntitlements))
    }
  }

  getEntitlements(organizationId = 'org-1') {
    try {
      const stored = localStorage.getItem(this.storageKey)
      const list = stored ? JSON.parse(stored) : []
      return list.filter((e) => !organizationId || e.organizationId === organizationId)
    } catch (e) {
      return []
    }
  }

  getEntitlementForProduct(productId, organizationId = 'org-1') {
    const list = this.getEntitlements(organizationId)
    return list.find((e) => e.productId === productId) || null
  }

  checkProductEntitlement(productId, organizationId = 'org-1') {
    const entitlement = this.getEntitlementForProduct(productId, organizationId)
    if (!entitlement) {
      return {
        hasEntitlement: false,
        status: 'None',
        message: 'This product is not subscribed or enabled for your organization.',
      }
    }

    const isActive = entitlement.status === 'Active' || entitlement.status === 'Trial'
    return {
      hasEntitlement: isActive,
      status: entitlement.status,
      entitlement,
      message: isActive ? 'Entitled' : `Product entitlement is ${entitlement.status.toLowerCase()}`,
    }
  }

  grantEntitlement(productId, plan = 'Professional', organizationId = 'org-1') {
    const current = this.getEntitlements()
    const existingIndex = current.findIndex((e) => e.productId === productId)
    
    const newEntitlement = {
      id: `ent-${productId}-${Date.now()}`,
      organizationId,
      productId,
      status: 'Active',
      plan,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      limits: { standard: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    let updated
    if (existingIndex >= 0) {
      updated = [...current]
      updated[existingIndex] = { ...updated[existingIndex], ...newEntitlement }
    } else {
      updated = [...current, newEntitlement]
    }

    localStorage.setItem(this.storageKey, JSON.stringify(updated))
    productService.activateProduct(productId)
    return newEntitlement
  }

  revokeEntitlement(productId, organizationId = 'org-1') {
    const current = this.getEntitlements()
    const updated = current.filter((e) => !(e.productId === productId && e.organizationId === organizationId))
    localStorage.setItem(this.storageKey, JSON.stringify(updated))
    productService.deactivateProduct(productId)
    return true
  }
}

export const entitlementService = new EntitlementService()
