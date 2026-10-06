// frontend/src/services/apiClient.ts
// Centralized HTTP client for MyCampace Platform

export const API_BASE_URL: string = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/api'
export const API_DOCS_URL: string = (import.meta as any).env?.VITE_API_DOCS_URL || 'http://localhost:4000/api/docs'

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

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  body?: any;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const sessionRaw = localStorage.getItem('mycampace_session')
  let token: string | null = null
  if (sessionRaw) {
    try {
      const parsed = JSON.parse(sessionRaw)
      token = parsed.token
    } catch {
      // ignore
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const config: RequestInit = {
    ...options,
    headers,
  }

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body)
  } else if (options.body) {
    config.body = options.body
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    let errorData: any = null
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }
    throw new ApiError(errorData.message || 'API request failed', response.status, errorData)
  }

  if (response.status === 204) {
    return null as T
  }

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
