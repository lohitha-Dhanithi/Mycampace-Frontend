// src/store/slices/superadminVerificationSlice.ts
// Superadmin verification queue and single-application review.
// Decisions send the submission `round` the reviewer saw; a 409 sets `conflict` so the UI asks for a reload
// instead of silently overwriting another reviewer's decision.
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { superadminVerificationService as api } from '../../services/verificationService'
import type { QueueItem, ReviewPack, VerificationStatus } from '../../types/verification'
import { toErrorInfo, type ErrorInfo } from '../errors'

type Async = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface QueueFilters {
  status: VerificationStatus | ''
  search: string
  page: number
  pageSize: number
}

export interface SuperadminVerificationState {
  queue: { items: QueueItem[]; total: number; counts: Partial<Record<VerificationStatus, number>>; load: Async }
  filters: QueueFilters
  current: ReviewPack | null
  currentLoad: Async
  acting: boolean
  conflict: boolean
  error: ErrorInfo | null
  /** Result of the last decision. `warning` = decision saved but the notification email could not be sent. */
  notice: { tone: 'success' | 'warning'; message: string } | null
}

const initialState: SuperadminVerificationState = {
  queue: { items: [], total: 0, counts: {}, load: 'idle' },
  filters: { status: 'Submitted', search: '', page: 1, pageSize: 15 },
  current: null,
  currentLoad: 'idle',
  acting: false,
  conflict: false,
  error: null,
  notice: null,
}

type Cfg = { state: { superadminVerification: SuperadminVerificationState }; rejectValue: ErrorInfo }

export const fetchQueue = createAsyncThunk<Awaited<ReturnType<typeof api.list>>, void, Cfg>(
  'superadminVerification/queue',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await api.list(getState().superadminVerification.filters)
    } catch (e) {
      return rejectWithValue(toErrorInfo(e))
    }
  },
)

export const openApplication = createAsyncThunk<ReviewPack, string, Cfg>('superadminVerification/open', async (orgId, { rejectWithValue }) => {
  try {
    return await api.get(orgId)
  } catch (e) {
    return rejectWithValue(toErrorInfo(e))
  }
})

export const reviewDocument = createAsyncThunk<
  void,
  { orgId: string; docId: string; decision: 'Accepted' | 'Rejected'; note?: string },
  Cfg
>('superadminVerification/reviewDocument', async ({ orgId, docId, decision, note }, { dispatch, rejectWithValue }) => {
  try {
    await api.reviewDocument(orgId, docId, decision, note)
    await dispatch(openApplication(orgId))
  } catch (e) {
    return rejectWithValue(toErrorInfo(e))
  }
})

/** Final decisions. The UI only dispatches these after an explicit confirmation dialog. */
export type DecideArg = (
  | { orgId: string; kind: 'approve' }
  | { orgId: string; kind: 'reject'; reason: string }
) & {
  /** Where the decision was made. The queue passes the round it listed; the detail page uses the round it loaded. */
  from?: 'queue' | 'detail'
  round?: number
  label?: string
}

export const decideApplication = createAsyncThunk<{ emailSent: boolean }, DecideArg, Cfg>(
  'superadminVerification/decide',
  async (d, { getState, dispatch, rejectWithValue }) => {
    const round = d.round ?? getState().superadminVerification.current?.status.round
    if (round === undefined) return rejectWithValue({ message: 'Application is not loaded' })
    try {
      const res = d.kind === 'approve' ? await api.approve(d.orgId, round) : await api.reject(d.orgId, d.reason, round)
      if (d.from === 'queue') await dispatch(fetchQueue())
      else await dispatch(openApplication(d.orgId))
      return { emailSent: res.emailSent }
    } catch (e) {
      return rejectWithValue(toErrorInfo(e))
    }
  },
)

const slice = createSlice({
  name: 'superadminVerification',
  initialState,
  reducers: {
    filtersChanged(state, a: PayloadAction<Partial<QueueFilters>>) {
      const changesCriteria = 'status' in a.payload || 'search' in a.payload
      state.filters = { ...state.filters, ...a.payload, ...(changesCriteria ? { page: 1 } : {}) }
    },
    reviewClosed(state) {
      state.current = null
      state.currentLoad = 'idle'
      state.error = null
      state.conflict = false
    },
    reviewErrorCleared(state) {
      state.error = null
      state.conflict = false
    },
    noticeDismissed(state) {
      state.notice = null
      state.error = null
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchQueue.pending, (s) => {
      s.queue.load = 'loading'
      s.error = null
    })
      .addCase(fetchQueue.fulfilled, (s, a) => {
        s.queue = { items: a.payload.items, total: a.payload.total, counts: a.payload.counts, load: 'succeeded' }
      })
      .addCase(fetchQueue.rejected, (s, a) => {
        s.queue.load = 'failed'
        s.error = a.payload ?? { message: 'Could not load the queue' }
      })
      .addCase(openApplication.pending, (s) => {
        s.currentLoad = s.current ? 'succeeded' : 'loading'
      })
      .addCase(openApplication.fulfilled, (s, a) => {
        s.currentLoad = 'succeeded'
        s.current = a.payload
      })
      .addCase(openApplication.rejected, (s, a) => {
        s.currentLoad = 'failed'
        s.error = a.payload ?? { message: 'Could not load the application' }
      })
      .addCase(reviewDocument.rejected, (s, a) => {
        s.error = a.payload ?? { message: 'Could not save the document review' }
      })
      .addCase(decideApplication.pending, (s) => {
        s.acting = true
        s.error = null
        s.conflict = false
        s.notice = null
      })
      .addCase(decideApplication.fulfilled, (s, a) => {
        s.acting = false
        const what = a.meta.arg.kind === 'approve' ? 'approved' : 'declined'
        const who = a.meta.arg.label ? `${a.meta.arg.label} ` : 'Application '
        s.notice = a.payload.emailSent
          ? { tone: 'success', message: `${who}${what}. The administrator has been notified by email.` }
          : { tone: 'warning', message: `${who}${what} and saved, but the notification email could not be sent. Please inform the administrator manually.` }
      })
      .addCase(decideApplication.rejected, (s, a) => {
        s.acting = false
        s.error = a.payload ?? { message: 'Decision failed' }
        s.conflict = a.payload?.status === 409
      })
  },
})

export const { filtersChanged, reviewClosed, reviewErrorCleared, noticeDismissed } = slice.actions
export default slice.reducer
