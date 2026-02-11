import '../styles/globals.css'
import '../styles/index.css'

import { Suspense } from 'react'
import { geistSans, geistMono } from '@/lib/fonts'
import Providers from '@/store/Providers'
import AuthGate from '@/components/AuthGate'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Suspense fallback={null}>
            <AuthGate />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  )
}
