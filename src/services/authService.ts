// src/services/authService.ts
// Session model: access/refresh tokens live ONLY in HttpOnly cookies set by the backend.
// JavaScript never sees or stores a token. The signed-in profile is held in memory and is
// re-established from GET /auth/me on every page load.
import { apiClient, ApiError } from './apiClient'
import { usePlatformApi as isPlatformApi } from './onboardingService'
import { organizationService } from './organizationService'

const DEFAULT_USER = {
  id: 'usr-1',
  name: 'Vikram Aditya',
  email: 'vikram.aditya@abcschool.edu.in',
  role: 'Super Admin',
  platformRole: 'Organization Admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  organizationId: 'org-1',
  productRoles: {
    academics: 'Academic Director',
    lms: 'Administrator',
    finance: 'Finance Controller',
    admissions: 'Head of Admissions',
    hrms: 'HR Administrator',
    library: 'Library Supervisor',
  },
}

// In-memory profile (not persisted). Mock mode (no platform API) starts as the demo user.
let currentUser: Record<string, any> | null = isPlatformApi() ? null : { ...DEFAULT_USER }

const PROFILE_RETRY_DELAYS_MS = [500, 1000, 2000]

type Listener = () => void
const listeners = new Set<Listener>()
const notify = () => listeners.forEach((fn) => fn())

function setUser(user: Record<string, any> | null) {
  currentUser = user
  organizationService.setStorageScope(user?.id ?? null)
  notify()
}

/** Build the profile from a server response. Any token-like field is dropped. */
function toProfile(raw: Record<string, any>) {
  const { token: _t, accessToken: _a, refreshToken: _r, ...rest } = raw
  return { ...rest, avatar: rest.avatar || rest.avatarUrl }
}

/** Backend responds `{ user, expiresIn, ... }` and sets the cookies; tolerate a bare user object too. */
function adoptResponse(res: Record<string, any>) {
  const user = toProfile((res.user as Record<string, any>) ?? res)
  setUser(user)
  return user
}

const mockUser = (extra: Record<string, any>) => ({ ...DEFAULT_USER, ...extra })

export const authService = {
  /** Subscribe to profile changes made inside this service (used to keep Redux in sync). */
  subscribe(fn: Listener) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },

  signInWithGoogle: async () => {
    const body = {
      idToken: 'google-oauth-mock-token-' + Date.now(),
      email: 'vikram.aditya@abcschool.edu.in',
    }
    if (isPlatformApi()) return adoptResponse(await apiClient.post('/auth/signin/google', body))

    try {
      return adoptResponse(await apiClient.post('/auth/signin/google', body))
    } catch {
      const user = mockUser({ name: 'Vikram Aditya (Google SSO)', authProvider: 'google' })
      setUser(user)
      return user
    }
  },

  signInWithEmail: async (email: string, password?: string) => {
    if (!email) throw new Error('Email is required')

    if (isPlatformApi()) {
      return adoptResponse(await apiClient.post('/auth/signin/email', { email, password: password || '' }))
    }

    try {
      return adoptResponse(
        await apiClient.post('/auth/signin/email', { email, password: password || '' }),
      )
    } catch {
      const user = mockUser({
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()),
        authProvider: 'email',
      })
      setUser(user)
      return user
    }
  },

  login: async (credentials: { email: string; password?: string }) =>
    authService.signInWithEmail(credentials.email, credentials.password),

  signUpWithEmail: async (userData: { name?: string; email: string; password: string }) => {
    if (isPlatformApi()) return adoptResponse(await apiClient.post('/auth/signup', userData))

    await new Promise((resolve) => setTimeout(resolve, 400))
    const user = {
      id: `usr-${Date.now()}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      role: 'Organization Owner',
      platformRole: 'Organization Admin',
      avatar: DEFAULT_USER.avatar,
      organizationId: 'org-new',
      productRoles: { academics: 'Administrator', lms: 'Administrator', finance: 'Administrator' },
    }
    setUser(user)
    return user
  },

  signOut: async () => {
    if (isPlatformApi()) {
      try {
        // The refresh token is read from its HttpOnly cookie by the server, which also clears both cookies.
        await apiClient.post('/auth/logout', {})
      } catch {
        // Network failure: still drop the local profile.
      }
    }
    setUser(null)
    return true
  },

  /** Drop the in-memory profile without calling the server (used when the session already expired). */
  clearLocal: () => setUser(null),

  logout: async () => authService.signOut(),

  /** Re-reads the profile from the server using the session cookie. */
  refreshProfile: async () => {
    if (!isPlatformApi()) return authService.getCurrentUser()
    for (let attempt = 0; ; attempt++) {
      try {
        return adoptResponse(await apiClient.get('/auth/me'))
      } catch (e) {
        // Server/network errors say nothing about the session: retry before treating the user as signed out.
        const transient = !(e instanceof ApiError) || e.status >= 500
        if (transient && attempt < PROFILE_RETRY_DELAYS_MS.length) {
          await new Promise((r) => setTimeout(r, PROFILE_RETRY_DELAYS_MS[attempt]))
          continue
        }
        // 401 on /auth/me means no cookie session yet; do not wipe a profile set by signup/sign-in in flight.
        return authService.getCurrentUser()
      }
    }
  },

  getCurrentUser: () => currentUser,
}
