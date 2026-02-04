import { CreatorsSection } from '@/components/pages/CreatorsSection'
import { ProjectsSection } from '@/components/pages/ProjectsSection'
import { RealsSection } from '@/components/pages/RealsSection'
import { UnitsSection } from '@/components/pages/UnitsSection'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

async function page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('accessToken')?.value

  if (cookieStore) {
    try {
      await fetch(`${process.env.API_URL}/auth/save-login-time`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      })
    } catch {
      // ingnore this
    }
  }

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
          <ProjectsSection chartOnly />
          <RealsSection chartOnly />
          <UnitsSection chartOnly />
          <CreatorsSection chartOnly />
        </div>
      </div>
    </div>
  )
}
export default page
export const metadata: Metadata = {
  title: 'Management Dashboard',
  icons: {
    icon: '/logo-simplex-fv.png',
  },
}
