// src/App.tsx
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { TenantProvider } from './store/TenantContext'
import { AuthProvider } from './store/AuthContext'

const App: React.FC = () => {
  return (
    <TenantProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </TenantProvider>
  )
}

export default App
