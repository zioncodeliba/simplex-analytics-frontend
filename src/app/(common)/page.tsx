import { CreatorsSection } from '@/components/pages/CreatorsSection'
import { ProjectsSection } from '@/components/pages/ProjectsSection'
import { RealsSection } from '@/components/pages/RealsSection'
import { UnitsSection } from '@/components/pages/UnitsSection'

function page() {
  return (
    <div className=''>
      <div className='container mx-auto px-4 py-4 max-w-7xl'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 w-full  space-x-3'>
          <ProjectsSection overview />
          <RealsSection overview />
          <UnitsSection overview />
          <CreatorsSection overview />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
          <ProjectsSection
            // dateRange={dateRange}
            chartOnly
            // selectedItems={selectedProjects}
          />
          <RealsSection
            // dateRange={dateRange}
            chartOnly
            // selectedItems={selectedReals}
          />
          <UnitsSection
            // dateRange={dateRange}
            chartOnly
            // selectedItems={selectedUnits}
          />
          <CreatorsSection
            // dateRange={dateRange}
            chartOnly
            // selectedItems={selectedCreators}
          />
        </div>
      </div>
    </div>
  )
}
export default page
