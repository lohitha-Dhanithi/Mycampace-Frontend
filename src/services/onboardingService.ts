import { apiClient } from './apiClient'

export const usePlatformApi = () =>
  process.env.NEXT_PUBLIC_USE_PLATFORM_API === 'true' ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_USE_PLATFORM_API === 'true')

export const onboardingService = {
  async getStatus() {
    return apiClient.get('/onboarding/status')
  },

  async saveOrganization(payload: Record<string, unknown>) {
    return apiClient.post('/onboarding/organization', payload)
  },

  async saveInstitutions(institutions: unknown[], campuses: unknown[]) {
    const institutionCodes = new Map(
      (institutions as { id: string; code: string }[]).map((i) => [i.id, i.code]),
    )
    return apiClient.post('/onboarding/institutions', {
      institutions: (institutions as Record<string, unknown>[]).map((inst) => ({
        name: inst.name,
        code: inst.code,
        type: inst.type,
        affiliation: inst.affiliation,
        email: inst.email,
        phone: inst.phone,
      })),
      campuses: (campuses as Record<string, unknown>[]).map((campus) => ({
        institutionCode:
          institutionCodes.get(String(campus.institutionId)) || String(campus.institutionCode || ''),
        name: campus.name,
        code: campus.code,
        city: campus.city,
        address: campus.address,
      })),
    })
  },

  async saveProducts(productIds: string[]) {
    return apiClient.post('/onboarding/products', { productIds })
  },

  async saveTeamInvites(invites: unknown[]) {
    return apiClient.post('/onboarding/team', {
      invites: (invites as Record<string, unknown>[]).map((member) => ({
        email: member.email,
        name: member.name,
        jobTitle: member.role || member.jobTitle,
        productRoles: member.productRoles,
      })),
    })
  },

  async complete() {
    return apiClient.post('/onboarding/complete', {})
  },
}
