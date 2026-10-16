// src/store/index.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import auth, { logoutThunk, sessionExpired } from './slices/authSlice'
import verification from './slices/verificationSlice'
import superadminVerification from './slices/superadminVerificationSlice'

const appReducer = combineReducers({ auth, verification, superadminVerification })

/** Wipe all cached server data when the user signs out or the session expires. */
const rootReducer: typeof appReducer = (state, action) => {
  if (logoutThunk.fulfilled.match(action) || sessionExpired.match(action)) {
    const fresh = appReducer(undefined, action)
    // We now definitively know there is no session; don't fall back to "still checking".
    return { ...fresh, auth: { ...fresh.auth, initialized: true } }
  }
  return appReducer(state, action)
}

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    // File objects are passed to thunks as arguments only; they never reach state.
    middleware: (getDefault) => getDefault({ serializableCheck: { ignoredActionPaths: ['meta.arg.file'] } }),
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export const store = makeStore()

export type AppStore = typeof store
export type RootState = ReturnType<typeof appReducer>
export type AppDispatch = typeof store.dispatch
