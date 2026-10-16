// src/store/slices/authSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'
import { usePlatformApi as isPlatformApi } from '../../services/onboardingService'
import type { AuthUser, LoginCredentials } from '../../types/auth'
import type { AccessLevel } from '../../types/verification'
import { toErrorInfo, type ErrorInfo } from '../errors'

export interface AuthState {
  user: AuthUser | null
  /** Mirrors the server's decision (user.accessLevel). Defaults to NONE. */
  accessLevel: AccessLevel
  loading: boolean
  /** false until the first server check of the cookie session has finished (platform mode). */
  initialized: boolean
  error: ErrorInfo | null
}

// Platform mode: if the server did not state a level, assume the most restricted one (fail closed).
const levelOf = (u: AuthUser | null): AccessLevel =>
  (u?.accessLevel as AccessLevel | undefined) ??
  (!u ? 'NONE' : isPlatformApi() ? 'APPLICANT_RESTRICTED' : 'INSTITUTION_ADMIN')

// The session cookie is HttpOnly, so the browser cannot know if it is signed in until /auth/me answers.
const buildInitial = (): AuthState => {
  const user = authService.getCurrentUser() as AuthUser | null
  return {
    user,
    accessLevel: levelOf(user),
    loading: false,
    initialized: !isPlatformApi(),
    error: null,
  }
}

export const loginThunk = createAsyncThunk<AuthUser, LoginCredentials, { rejectValue: ErrorInfo }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Credentials go straight to the service; they are never stored in Redux.
      return (await authService.login(credentials)) as AuthUser
    } catch (e) {
      return rejectWithValue(toErrorInfo(e))
    }
  },
)

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const refreshProfileThunk = createAsyncThunk<AuthUser | null>('auth/refreshProfile', async () => {
  if (!isPlatformApi()) return authService.getCurrentUser() as AuthUser | null
  return (await authService.refreshProfile()) as AuthUser | null
})

const authSlice = createSlice({
  name: 'auth',
  initialState: buildInitial,
  reducers: {
    /** Re-read the session that authService persisted (used after signup/Google flows). */
    sessionAdopted(state) {
      const user = authService.getCurrentUser() as AuthUser | null
      state.user = user
      state.accessLevel = levelOf(user)
    },
    /** Called by the API layer on a 401 so every screen drops to signed-out. */
    sessionExpired(state) {
      state.user = null
      state.accessLevel = 'NONE'
      state.initialized = true
    },
    errorCleared(state) {
      state.error = null
    },
    userPatched(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) state.user = { ...state.user, ...action.payload }
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending, (s) => {
      s.loading = true
      s.error = null
    })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.loading = false
        s.user = a.payload
        s.accessLevel = levelOf(a.payload)
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload ?? { message: 'Sign in failed' }
      })
      .addCase(logoutThunk.fulfilled, (s) => {
        s.user = null
        s.accessLevel = 'NONE'
        s.error = null
      })
      .addCase(refreshProfileThunk.fulfilled, (s, a) => {
        s.initialized = true
        // payload is the server-confirmed profile, or null when the cookie session is gone.
        s.user = a.payload
        s.accessLevel = levelOf(a.payload)
      })
      .addCase(refreshProfileThunk.rejected, (s) => {
        s.initialized = true
      })
  },
})

export const { sessionAdopted, sessionExpired, errorCleared, userPatched } = authSlice.actions
export default authSlice.reducer
