import { UnitsSection } from '@/components/pages/UnitsSection'
import { UnitsTable } from '@/components/pages/UnitsTable'
import React from 'react'

const page = () => {
  return (
    <div className='container mx-auto px-4 py-4 max-w-7xl'>
      <UnitsSection
        // dateRange={dateRange}
        expanded
        // selectedItems={selectedUnits}
      />
      <UnitsTable
      // dateRange={dateRange}
      // onSelectionChange={handleUnitsSelectionChange}
      />
    </div>
  )
}
export default page
