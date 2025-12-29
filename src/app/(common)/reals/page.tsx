import { RealsSection } from '@/components/pages/RealsSection'
import { RealsTable } from '@/components/pages/RealsTable'
import React from 'react'

const page = () => {
  return (
    <div className='container mx-auto px-4 py-4 max-w-7xl'>
      <RealsSection
        //   dateRange={dateRange}
        expanded
        //   selectedItems={selectedReals}
      />
      <RealsTable
      // dateRange={dateRange}
      // onSelectionChange={handleRealsSelectionChange}
      />
    </div>
  )
}
export default page
