// frontend/src/services/apiClient.ts
// Centralized HTTP client for MyCampace Platform

function readApiBaseUrl() {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) {
    return (import.meta as any).env.VITE_API_URL
  }
  return 'http://localhost:4000/api'
}

function readApiDocsUrl() {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_DOCS_URL) {
    return process.env.NEXT_PUBLIC_API_DOCS_URL
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_DOCS_URL) {
    return (import.meta as any).env.VITE_API_DOCS_URL
  }
  return 'http://localhost:4000/api/docs'
}

export const API_BASE_URL: string = readApiBaseUrl()
export const API_DOCS_URL: string = readApiDocsUrl()

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.status = status
    this.data = data
    this.name = 'ApiError'
  }
}

let onUnauthorized: (() => void) | null = null
/** Registered by the Redux store so apiClient has no dependency on it. */
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  body?: any;
  /** 'blob' for authenticated file previews/downloads. Defaults to JSON. */
  responseType?: 'json' | 'blob';
}

/** Sent on every request; the backend rejects cookie-authenticated writes without it (CSRF defence). */
export const CSRF_HEADER_NAME = 'X-Mycampace-CSRF'

// Auth endpoints never trigger a refresh-and-retry (it would loop or mask bad credentials).
const NO_REFRESH = ['/auth/signin', '/auth/signup', '/auth/refresh', '/auth/logout']

let refreshInFlight: Promise<boolean> | null = null
/** Rotates the session via the HttpOnly refresh cookie. Concurrent callers share one request. */
function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', [CSRF_HEADER_NAME]: '1' },
      body: '{}',
    })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null
      })
  }
  return refreshInFlight
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}, retried = false): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData
  const headers: Record<string, string> = {
    // For FormData the browser must set the multipart boundary itself.
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    [CSRF_HEADER_NAME]: '1',
    ...(options.headers || {}),
  }

  const { responseType, ...fetchOptions } = options
  const config: RequestInit = {
    ...fetchOptions,
    headers,
    // The session lives in HttpOnly cookies; the browser attaches them. No token is readable from JS.
    credentials: 'include',
  }

  if (options.body && typeof options.body === 'object' && !isForm) {
    config.body = JSON.stringify(options.body)
  } else if (options.body) {
    config.body = options.body
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    if (response.status === 401 && !NO_REFRESH.some((p) => endpoint.includes(p))) {
      // Access cookie expired: try one silent refresh, then replay the request.
      if (!retried && (await refreshSession())) return request<T>(endpoint, options, true)
      onUnauthorized?.()
    }
    let errorData: any = null
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }
    const message =
      (Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message) ||
      errorData.error ||
      'API request failed'
    throw new ApiError(message, response.status, errorData)
  }

  if (response.status === 204) {
    return null as T
  }

  if (responseType === 'blob') return (await response.blob()) as T
  return response.json()
}

export const apiClient = {
  baseUrl: API_BASE_URL,
  docsUrl: API_DOCS_URL,
  get: <T = any>(endpoint: string, options: RequestOptions = {}) => request<T>(endpoint, { method: 'GET', ...options }),
  post: <T = any>(endpoint: string, body?: any, options: RequestOptions = {}) => request<T>(endpoint, { method: 'POST', body, ...options }),
  put: <T = any>(endpoint: string, body?: any, options: RequestOptions = {}) => request<T>(endpoint, { method: 'PUT', body, ...options }),
  patch: <T = any>(endpoint: string, body?: any, options: RequestOptions = {}) => request<T>(endpoint, { method: 'PATCH', body, ...options }),
  delete: <T = any>(endpoint: string, options: RequestOptions = {}) => request<T>(endpoint, { method: 'DELETE', ...options }),
}

export default apiClient
