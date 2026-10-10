const MODE_KEY = 'mycampace_hrms_portal'

export function hasHrmsAdminAccess(user: { role?: string; platformRole?: string; productRoles?: Record<string, string> } | null) {
  if (!user) return false
  const role = `${user.role || ''} ${user.platformRole || ''}`.toLowerCase()
  const productRole = `${user.productRoles?.hrms || ''}`.toLowerCase()
  return /admin|principal|owner|hr/.test(role) || /admin|hr/.test(productRole)
}

export function getHrmsPortalMode(user: { role?: string; platformRole?: string; productRoles?: Record<string, string> } | null): 'admin' | 'self' {
  if (!hasHrmsAdminAccess(user)) return 'self'
  if (typeof window === 'undefined') return 'admin'
  return localStorage.getItem(MODE_KEY) === 'self' ? 'self' : 'admin'
}

export function setHrmsPortalMode(mode: 'admin' | 'self') {
  if (typeof window === 'undefined') return
  localStorage.setItem(MODE_KEY, mode)
}
