// src/services/authService.js

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

export const authService = {
  // OAuth Google authentication abstraction
  signInWithGoogle: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const googleUser = {
      ...DEFAULT_USER,
      name: 'Vikram Aditya (Google SSO)',
      authProvider: 'google',
    }
    localStorage.setItem('mycampace_user', JSON.stringify(googleUser))
    localStorage.setItem('mycampace_session', JSON.stringify({
      token: 'oauth-google-' + Date.now(),
      provider: 'google',
      expiresAt: Date.now() + 86400000,
    }))
    return googleUser
  },

  // Email/password authentication abstraction
  signInWithEmail: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 350))
    if (!email) throw new Error('Email is required')

    const user = {
      ...DEFAULT_USER,
      email: email,
      name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      authProvider: 'email',
    }
    localStorage.setItem('mycampace_user', JSON.stringify(user))
    localStorage.setItem('mycampace_session', JSON.stringify({
      token: 'jwt-email-' + Date.now(),
      provider: 'email',
      expiresAt: Date.now() + 86400000,
    }))
    return user
  },

  // Backward compatibility alias for existing code
  login: async (credentials) => {
    return authService.signInWithEmail(credentials.email, credentials.password)
  },

  // Sign up abstraction
  signUpWithEmail: async (userData) => {
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

  // Sign out abstraction
  signOut: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    localStorage.removeItem('mycampace_user')
    localStorage.removeItem('mycampace_session')
    return true
  },

  // Backward compatibility alias
  logout: async () => {
    return authService.signOut()
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('mycampace_user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        return DEFAULT_USER
      }
    }
    return DEFAULT_USER
  },

  getSession: () => {
    const sessionStr = localStorage.getItem('mycampace_session')
    if (sessionStr) {
      try {
        return JSON.parse(sessionStr)
      } catch (e) {
        return null
      }
    }
    return {
      token: 'default-session-token',
      provider: 'default',
      expiresAt: Date.now() + 86400000,
    }
  },

  requestPasswordReset: async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { success: true, message: `Password reset instructions sent to ${email}` }
  },

  resetPassword: async (token, newPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { success: true, message: 'Password has been updated successfully.' }
  },
}
