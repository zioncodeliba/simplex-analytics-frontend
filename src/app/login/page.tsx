import Login from '@/components/pages/Login'
import { Metadata } from 'next'
const page = () => {
  return <Login />
}

export default page
export const metadata: Metadata = {
  title: 'Login',
  icons: {
    icon: '/logo-simplex-fv.png',
  },
}
