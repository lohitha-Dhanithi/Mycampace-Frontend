// src/store/AuthContext.tsx
// Compatibility layer: `useAuth()` keeps its original shape, but state now lives in Redux
// (see slices/authSlice.ts). Existing consumers need no changes.
import React, { useEffect, type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from './index'
import { useAppDispatch, useAppSelector } from './hooks'
import { loginThunk, logoutThunk, refreshProfileThunk, sessionAdopted, sessionExpired } from './slices/authSlice'
import { setUnauthorizedHandler } from '../services/apiClient'
import { authService } from '../services/authService'
import { endTabSession, shouldResumeSession, startTabSession } from '../services/tabSessionLifecycle'
import { usePlatformApi as isPlatformApi } from '../services/onboardingService'
import type { AuthUser, LoginCredentials } from '../types/auth'

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<AuthUser>
  logout: () => Promise<void>
  adoptSession: () => AuthUser
  loading: boolean
  /** false until the server has confirmed whether a cookie session exists */
  initialized: boolean
}

function SessionBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  useEffect(() => {
    // Any 401 from the API drops every screen to signed-out.
    setUnauthorizedHandler(() => {
      authService.clearLocal()
      endTabSession()
      dispatch(sessionExpired())
    })
    // Keep Redux in step when authService changes the profile itself (e.g. onboarding's refreshProfile()).
    const unsubscribe = authService.subscribe(() => dispatch(sessionAdopted()))
    let cancelled = false
    shouldResumeSession().then(async (resume) => {
      if (cancelled) return
      if (resume) {
        // The cookie is HttpOnly: ask the server who (if anyone) is signed in.
        dispatch(refreshProfileThunk())
        return
      }
      // Every tab of the previous session was closed: end it instead of restoring it.
      await authService.signOut()
      if (!cancelled) dispatch(sessionExpired())
    })
    return () => {
      cancelled = true
      unsubscribe()
      setUnauthorizedHandler(null)
    }
  }, [dispatch])

  useEffect(() => {
    if (!isPlatformApi() || !user?.id) return
    return startTabSession()
  }, [user?.id])

  return <>{children}</>
}

/** Mounts the Redux store. Kept under the old name so App.tsx stays unchanged in shape. */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Provider store={store}>
    <SessionBootstrap>{children}</SessionBootstrap>
  </Provider>
)

export const useAuth = (): AuthContextType => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const loading = useAppSelector((s) => s.auth.loading)
  const initialized = useAppSelector((s) => s.auth.initialized)

  return {
    user,
    initialized,
    isAuthenticated: !!user,
    loading,
    login: (credentials) => dispatch(loginThunk(credentials)).unwrap(),
    logout: async () => {
      await dispatch(logoutThunk()).unwrap()
      endTabSession()
    },
    adoptSession: () => {
      dispatch(sessionAdopted())
      return store.getState().auth.user as AuthUser
    },
  }
}
