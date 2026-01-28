import { RealsSection } from '@/components/pages/RealsSection'
import { RealsTable } from '@/components/pages/RealsTable'
import { Metadata } from 'next'
import React from 'react'

const page = () => {
  return (
    <div className='container mx-auto px-4 py-4 max-w-7xl'>
      <RealsSection expanded />
      <RealsTable />
    </div>
  )
}
export default page
export const metadata: Metadata = {
  title: 'Reals Management ',
  icons: {
    icon: '/logo-simplex-fv.png',
  },
}
