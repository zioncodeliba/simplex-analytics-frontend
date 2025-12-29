import { ProjectsSection } from '@/components/pages/ProjectsSection'
import { ProjectsTable } from '@/components/pages/ProjectsTable'
import React from 'react'

const page = () => {
  return (
    <div className='container mx-auto px-4 py-4 max-w-7xl'>
      <ProjectsSection
        //   dateRange={dateRange}
        expanded
        //   selectedItems={selectedProjects}
      />
      <ProjectsTable
      //   dateRange={dateRange}
      //   onSelectionChange={handleProjectsSelectionChange}
      />
    </div>
  )
}
export default page
