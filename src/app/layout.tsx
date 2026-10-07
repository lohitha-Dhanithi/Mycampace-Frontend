import React from 'react'
import type { Metadata } from 'next'
import '@/index.css'

export const metadata: Metadata = {
  title: 'MyCampace - Unified Multi-Tenant Education Operating System',
  description:
    'Enterprise Multi-Tenant Educational Operating System with integrated Academics, Admissions, LMS, SIS, and Finance.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-slate-50 text-slate-900 antialiased font-sans selection:bg-blue-600 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
