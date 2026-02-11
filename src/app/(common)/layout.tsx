import { Suspense } from 'react'
import Navbar from '@/components/Nav'
import { DateProvider } from '@/hook/DatesContext'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DateProvider>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main>{children}</main>
    </DateProvider>
  )
}
