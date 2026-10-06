// src/components/common/Toast.jsx
import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random()
    const newToast = { id, type: 'success', ...toast }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container floating at bottom right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-lg border text-xs transition-all animate-in slide-in-from-bottom-3 duration-200 bg-white ${
              t.type === 'error'
                ? 'border-red-200 text-red-950 shadow-red-500/5'
                : t.type === 'info'
                ? 'border-blue-200 text-blue-950 shadow-blue-500/5'
                : 'border-emerald-200 text-emerald-950 shadow-emerald-500/5'
            }`}
          >
            {t.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            ) : t.type === 'info' ? (
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            )}

            <div className="flex-1 overflow-hidden">
              <h5 className="font-semibold">{t.title}</h5>
              {t.message && <p className="text-slate-600 mt-0.5 leading-relaxed">{t.message}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      success: (title, msg) => console.log('Toast success:', title, msg),
      error: (title, msg) => console.error('Toast error:', title, msg),
      info: (title, msg) => console.log('Toast info:', title, msg),
    }
  }
  return context
}
