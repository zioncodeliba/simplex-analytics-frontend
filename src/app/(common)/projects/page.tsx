import { ProjectsSection } from '@/components/pages/ProjectsSection'
import { ProjectsTable } from '@/components/pages/ProjectsTable'
import { Metadata } from 'next'
import React from 'react'

const page = () => {
  return (
    <div className='container mx-auto px-4 py-4 max-w-7xl'>
      <ProjectsSection expanded />
      <ProjectsTable />
    </div>
  )
}
export default page
export const metadata: Metadata = {
  title: 'Projects Management ',
  icons: {
    icon: '/logo-simplex-fv.png',
  },
}
