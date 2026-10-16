// src/store/slices/verificationSlice.ts
// Applicant-side state: document checklist, upload progress, final review pack, submission.
// Requirements, completeness and status all come from the server and are never computed here.
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { verificationService } from '../../services/verificationService'
import {
  slotKey,
  type RequirementItem,
  type RequirementsResponse,
  type ReviewPack,
  type UploadSlot,
  type VerificationStatusView,
} from '../../types/verification'
import { toErrorInfo, type ErrorInfo } from '../errors'

type Async = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface VerificationState {
  requirements: RequirementsResponse | null
  requirementsLoad: Async
  review: ReviewPack | null
  reviewLoad: Async
  status: VerificationStatusView | null
  statusLoad: Async
  uploads: Record<string, UploadSlot>
  submitting: boolean
  error: ErrorInfo | null
}

const initialState: VerificationState = {
  requirements: null,
  requirementsLoad: 'idle',
  review: null,
  reviewLoad: 'idle',
  status: null,
  statusLoad: 'idle',
  uploads: {},
  submitting: false,
  error: null,
}

type Cfg = { rejectValue: ErrorInfo }

export const fetchRequirements = createAsyncThunk<RequirementsResponse, void, Cfg>(
  'verification/requirements',
  async (_, { rejectWithValue }) => {
    try {
      return await verificationService.requirements()
    } catch (e) {
      return rejectWithValue(toErrorInfo(e))
    }
  },
)

export const fetchReview = createAsyncThunk<ReviewPack, void, Cfg>('verification/review', async (_, { rejectWithValue }) => {
  try {
    return await verificationService.review()
  } catch (e) {
    return rejectWithValue(toErrorInfo(e))
  }
})

export const fetchStatus = createAsyncThunk<VerificationStatusView, void, Cfg>('verification/status', async (_, { rejectWithValue }) => {
  try {
    return await verificationService.status()
  } catch (e) {
    return rejectWithValue(toErrorInfo(e))
  }
})

/** The File is passed as a thunk argument only; it is never stored in Redux. */
export const uploadDocument = createAsyncThunk<void, { file: File; item: RequirementItem }, Cfg>(
  'verification/upload',
  async ({ file, item }, { dispatch, rejectWithValue }) => {
    const key = slotKey(item.key, item.campusId)
    try {
      await verificationService.upload(file, item.key, item.campusId, (pct) => dispatch(uploadProgressed({ key, progress: pct })))
      await dispatch(fetchRequirements()) // the server recomputes what is still missing
    } catch (e) {
      return rejectWithValue(toErrorInfo(e))
    }
  },
)

export const removeDocument = createAsyncThunk<void, string, Cfg>('verification/remove', async (id, { dispatch, rejectWithValue }) => {
  try {
    await verificationService.remove(id)
    await dispatch(fetchRequirements())
  } catch (e) {
    return rejectWithValue(toErrorInfo(e))
  }
})

export const submitApplication = createAsyncThunk<VerificationStatusView, void, Cfg>(
  'verification/submit',
  async (_, { rejectWithValue }) => {
    try {
      return await verificationService.submit()
    } catch (e) {
      return rejectWithValue(toErrorInfo(e))
    }
  },
)

const slice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    uploadProgressed(state, a: PayloadAction<{ key: string; progress: number }>) {
      const slot = state.uploads[a.payload.key]
      if (slot) slot.progress = a.payload.progress
    },
    uploadDismissed(state, a: PayloadAction<string>) {
      delete state.uploads[a.payload]
    },
    verificationErrorCleared(state) {
      state.error = null
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchRequirements.pending, (s) => {
      s.requirementsLoad = s.requirements ? 'succeeded' : 'loading' // keep showing data during refreshes
    })
      .addCase(fetchRequirements.fulfilled, (s, a) => {
        s.requirementsLoad = 'succeeded'
        s.requirements = a.payload
        s.status = a.payload.status
      })
      .addCase(fetchRequirements.rejected, (s, a) => {
        s.requirementsLoad = 'failed'
        s.error = a.payload ?? { message: 'Could not load the document checklist' }
      })
      .addCase(fetchReview.pending, (s) => {
        s.reviewLoad = 'loading'
      })
      .addCase(fetchReview.fulfilled, (s, a) => {
        s.reviewLoad = 'succeeded'
        s.review = a.payload
        s.status = a.payload.status
      })
      .addCase(fetchReview.rejected, (s, a) => {
        s.reviewLoad = 'failed'
        s.error = a.payload ?? { message: 'Could not load your application' }
      })
      .addCase(fetchStatus.pending, (s) => {
        s.statusLoad = s.status ? 'succeeded' : 'loading'
      })
      .addCase(fetchStatus.fulfilled, (s, a) => {
        s.statusLoad = 'succeeded'
        s.status = a.payload
      })
      .addCase(fetchStatus.rejected, (s, a) => {
        s.statusLoad = 'failed'
        s.error = a.payload ?? { message: 'Could not load status' }
      })
      .addCase(uploadDocument.pending, (s, a) => {
        s.uploads[slotKey(a.meta.arg.item.key, a.meta.arg.item.campusId)] = { progress: 0, status: 'uploading' }
      })
      .addCase(uploadDocument.fulfilled, (s, a) => {
        s.uploads[slotKey(a.meta.arg.item.key, a.meta.arg.item.campusId)] = { progress: 100, status: 'done' }
      })
      .addCase(uploadDocument.rejected, (s, a) => {
        s.uploads[slotKey(a.meta.arg.item.key, a.meta.arg.item.campusId)] = {
          progress: 0,
          status: 'failed',
          error: a.payload?.message ?? 'Upload failed',
        }
      })
      .addCase(removeDocument.rejected, (s, a) => {
        s.error = a.payload ?? { message: 'Could not remove the document' }
      })
      .addCase(submitApplication.pending, (s) => {
        s.submitting = true // also blocks double-submits in the UI
        s.error = null
      })
      .addCase(submitApplication.fulfilled, (s, a) => {
        s.submitting = false
        s.status = a.payload
      })
      .addCase(submitApplication.rejected, (s, a) => {
        s.submitting = false
        s.error = a.payload ?? { message: 'Submission failed' }
      })
  },
})

export const { uploadProgressed, uploadDismissed, verificationErrorCleared } = slice.actions
export default slice.reducer
