// src/services/authService.js
import { apiClient } from './apiClient'
import { usePlatformApi } from './onboardingService'

const DEFAULT_USER = {
  id: 'usr-1',
  name: 'Vikram Aditya',
  email: 'vikram.aditya@abcschool.edu.in',
  role: 'Super Admin',
  platformRole: 'Organization Admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  token: 'jwt-mock-token-mycampace-enterprise-2026',
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

function persistAuthSession(session: {
  user: Record<string, any>
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}) {
  const user: any = {
    ...DEFAULT_USER,
    ...session.user,
    token: session.accessToken,
    avatar: session.user.avatar || session.user.avatarUrl || DEFAULT_USER.avatar,
  }
  localStorage.setItem('mycampace_user', JSON.stringify(user))
  localStorage.setItem(
    'mycampace_session',
    JSON.stringify({
      token: session.accessToken,
      refreshToken: session.refreshToken,
      provider: user.authProvider || 'email',
      expiresIn: session.expiresIn || 900,
      expiresAt: Date.now() + (session.expiresIn || 900) * 1000,
    }),
  )
  const onboarding = user.onboarding as { required?: boolean } | undefined
  if (onboarding?.required) {
    localStorage.setItem('mycampace_pending_onboarding', 'true')
  } else {
    localStorage.removeItem('mycampace_pending_onboarding')
  }
  return user
}

function normalizeSessionResponse(apiResponse: Record<string, unknown>) {
  if (apiResponse.accessToken) return apiResponse
  return {
    user: apiResponse,
    accessToken: apiResponse.token,
    refreshToken: undefined,
    expiresIn: 86400,
  }
}

export const authService = {
  signInWithGoogle: async () => {
    if (usePlatformApi()) {
      const session = normalizeSessionResponse(
        await apiClient.post('/auth/signin/google', {
          idToken: 'google-oauth-mock-token-' + Date.now(),
          email: 'vikram.aditya@abcschool.edu.in',
        }),
      )
      return persistAuthSession(session as any)
    }

    try {
      const apiUser = await apiClient.post('/auth/signin/google', {
        idToken: 'google-oauth-mock-token-' + Date.now(),
        email: 'vikram.aditya@abcschool.edu.in',
      })
      const session = normalizeSessionResponse(apiUser)
      return persistAuthSession(session as any)
    } catch {
      const googleUser = {
        ...DEFAULT_USER,
        name: 'Vikram Aditya (Google SSO)',
        authProvider: 'google',
      }
      localStorage.setItem('mycampace_user', JSON.stringify(googleUser))
      localStorage.setItem(
        'mycampace_session',
        JSON.stringify({
          token: 'oauth-google-' + Date.now(),
          provider: 'google',
          expiresAt: Date.now() + 86400000,
        }),
      )
      return googleUser
    }
  },

  signInWithEmail: async (email: string, password?: string) => {
    if (!email) throw new Error('Email is required')

    if (usePlatformApi()) {
      const session = normalizeSessionResponse(
        await apiClient.post('/auth/signin/email', {
          email,
          password: password || '',
        }),
      )
      return persistAuthSession(session as any)
    }

    try {
      const apiUser = await apiClient.post('/auth/signin/email', {
        email,
        password: password || 'SecurePassword123!',
      })
      const session = normalizeSessionResponse(apiUser)
      return persistAuthSession(session as any)
    } catch {
      const user = {
        ...DEFAULT_USER,
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()),
        authProvider: 'email',
      }
      localStorage.setItem('mycampace_user', JSON.stringify(user))
      localStorage.setItem(
        'mycampace_session',
        JSON.stringify({
          token: 'jwt-email-' + Date.now(),
          provider: 'email',
          expiresAt: Date.now() + 86400000,
        }),
      )
      return user
    }
  },

  login: async (credentials: { email: string; password?: string }) => {
    return authService.signInWithEmail(credentials.email, credentials.password)
  },

  signUpWithEmail: async (userData: { name?: string; email: string; password: string }) => {
    if (usePlatformApi()) {
      const session = normalizeSessionResponse(await apiClient.post('/auth/signup', userData))
      return persistAuthSession(session as any)
    }

    await new Promise((resolve) => setTimeout(resolve, 400))
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      role: 'Organization Owner',
      platformRole: 'Organization Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      token: 'jwt-signup-' + Date.now(),
      organizationId: 'org-new',
      productRoles: {
        academics: 'Administrator',
        lms: 'Administrator',
        finance: 'Administrator',
      },
    }
    localStorage.setItem('mycampace_user', JSON.stringify(newUser))
    localStorage.setItem('mycampace_pending_onboarding', 'true')
    return newUser
  },

  signOut: async () => {
    const sessionRaw = localStorage.getItem('mycampace_session')
    let refreshToken: string | undefined
    if (sessionRaw) {
      try {
        refreshToken = JSON.parse(sessionRaw).refreshToken
      } catch {
        refreshToken = undefined
      }
    }
    if (usePlatformApi() && refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken })
      } catch {
        // ignore network errors on logout
      }
    }
    localStorage.removeItem('mycampace_user')
    localStorage.removeItem('mycampace_session')
    return true
  },

  logout: async () => authService.signOut(),

  refreshProfile: async () => {
    if (!usePlatformApi()) return authService.getCurrentUser()
    try {
      const user = await apiClient.get('/auth/me')
      const sessionRaw = localStorage.getItem('mycampace_session')
      const session = sessionRaw ? JSON.parse(sessionRaw) : {}
      persistAuthSession({
        user,
        accessToken: session.token,
        refreshToken: session.refreshToken,
        expiresIn: session.expiresIn,
      })
      return authService.getCurrentUser()
    } catch {
      return authService.getCurrentUser()
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('mycampace_user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return usePlatformApi() ? null : DEFAULT_USER
      }
    }
    return usePlatformApi() ? null : DEFAULT_USER
  },

  getSession: () => {
    const sessionStr = localStorage.getItem('mycampace_session')
    if (sessionStr) {
      try {
        return JSON.parse(sessionStr)
      } catch {
        return null
      }
    }
    return null
  },

  requestPasswordReset: async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { success: true, message: `Password reset instructions sent to ${email}` }
  },

  resetPassword: async (_token: string, _newPassword: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { success: true, message: 'Password has been updated successfully.' }
  },
}
