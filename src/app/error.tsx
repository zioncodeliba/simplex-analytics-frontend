'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Errors() {
  const router = useRouter()
  const handleRefreshHome = () => {
    router.push('/')
    router.refresh()
  }
  return (
    <div className='flex flex-col items-center justify-center h-screen text-center px-4'>
      <h1 className='text-4xl font-bold mb-2'>
        Something&apos;s wrong here...
      </h1>
      <p className='mb-6 text-lg md:px-30 xl:px-100'>
        An unexpected error occurred. Please try refreshing the page or go back
        to the homepage.
      </p>
      <Button
        onClick={handleRefreshHome}
        className='bg-black text-white px-4 py-2 rounded cursor-pointer'
      >
        Home
      </Button>
    </div>
  )
}
