import Navbar from '@/components/Nav'
import { DateProvider } from '@/hook/DatesContext'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DateProvider>
      <Navbar />
      <main>{children}</main>
    </DateProvider>
  )
}
