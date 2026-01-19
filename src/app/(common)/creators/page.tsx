import { CreatorsSection } from '@/components/pages/CreatorsSection'
import { CreatorsTable } from '@/components/pages/CreatorsTable'
import React from 'react'

const page = () => {
  return (
    <div className='container mx-auto px-4 py-4 max-w-7xl'>
      <CreatorsSection expanded />
      <CreatorsTable />
    </div>
  )
}
export default page
