// src/services/verificationService.ts
// Typed wrappers for institution verification: applicant side and superadmin side.
import { apiClient, API_BASE_URL, ApiError, CSRF_HEADER_NAME, notifyUnauthorized, refreshSession } from './apiClient'
import type {
  DecisionResponse,
  DocumentMeta,
  QueueResponse,
  RequirementsResponse,
  ReviewPack,
  VerificationStatus,
  VerificationStatusView,
} from '../types/verification'

/** One XHR upload attempt (used for progress reporting; fetch cannot do upload progress). */
function uploadOnce<T>(path: string, form: FormData, onProgress: (pct: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_BASE_URL}${path}`)
    xhr.withCredentials = true
    xhr.setRequestHeader(CSRF_HEADER_NAME, '1')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      let data: any = null
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        /* non-JSON body */
      }
      if (xhr.status >= 200 && xhr.status < 300) return resolve(data as T)
      const msg = Array.isArray(data?.message) ? data.message.join(', ') : data?.message
      reject(new ApiError(msg || 'Upload failed', xhr.status, data))
    }
    xhr.onerror = () => reject(new ApiError('Network error during upload. Please try again.', 0))
    xhr.send(form)
  })
}

/** multipart upload with progress. Mirrors apiClient 401 → refresh → retry (XHR bypasses fetch). */
async function uploadWithProgress<T>(
  path: string,
  form: FormData,
  onProgress: (pct: number) => void,
  retried = false,
): Promise<T> {
  try {
    return await uploadOnce<T>(path, form, onProgress)
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && !retried) {
      if (await refreshSession()) {
        return uploadWithProgress(path, form, onProgress, true)
      }
      notifyUnauthorized()
    }
    throw err
  }
}

export const verificationService = {
  status: () => apiClient.get<VerificationStatusView>('/verification/status'),
  requirements: () => apiClient.get<RequirementsResponse>('/verification/requirements'),
  review: () => apiClient.get<ReviewPack>('/verification/review'),
  upload: (file: File, docType: string, campusId: string | null, onProgress: (pct: number) => void) => {
    const form = new FormData()
    form.append('file', file)
    form.append('docType', docType)
    if (campusId) form.append('campusId', campusId)
    return uploadWithProgress<DocumentMeta>('/verification/documents', form, onProgress)
  },
  remove: (id: string) => apiClient.delete<{ success: boolean }>(`/verification/documents/${id}`),
  submit: () => apiClient.post<VerificationStatusView & { demoReview?: boolean }>('/verification/submit', {}),
  /** TEST MODE ONLY: the backend answers 404 unless it is enabled. */
  demoDecide: (kind: 'approve' | 'decline') => apiClient.post<DecisionResponse>(`/verification/demo/${kind}`, {}),
  /** Authenticated preview; returns a Blob (the file is never publicly reachable). */
  documentBlob: (id: string) => apiClient.get<Blob>(`/verification/documents/${id}/download`, { responseType: 'blob' }),
}

export const superadminVerificationService = {
  list: (q: { status?: VerificationStatus | ''; search?: string; page: number; pageSize: number }) => {
    const p = new URLSearchParams()
    if (q.status) p.set('status', q.status)
    if (q.search) p.set('search', q.search)
    p.set('page', String(q.page))
    p.set('pageSize', String(q.pageSize))
    return apiClient.get<QueueResponse>(`/superadmin/verifications?${p.toString()}`)
  },
  get: (orgId: string) => apiClient.get<ReviewPack>(`/superadmin/verifications/${orgId}`),
  documentBlob: (orgId: string, docId: string) =>
    apiClient.get<Blob>(`/superadmin/verifications/${orgId}/documents/${docId}/download`, { responseType: 'blob' }),
  reviewDocument: (orgId: string, docId: string, decision: 'Accepted' | 'Rejected', note?: string) =>
    apiClient.post<{ success: boolean }>(`/superadmin/verifications/${orgId}/documents/${docId}/review`, { decision, note }),
  approve: (orgId: string, round: number, note?: string) =>
    apiClient.post<DecisionResponse>(`/superadmin/verifications/${orgId}/approve`, { round, note }),
  reject: (orgId: string, reason: string, round: number) =>
    apiClient.post<DecisionResponse>(`/superadmin/verifications/${orgId}/reject`, { reason, round }),
}
