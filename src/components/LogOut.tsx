'use client'

import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const logout = async (): Promise<void> => {
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,

        {
          withCredentials: true,
        }
      )

      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>

      toast.error(err.response?.data?.message ?? 'Error logging out')
    }
  }

  return (
    <button
      onClick={logout}
      className='rounded bg-red-500 px-4 py-2 text-white'
    >
      Logout
    </button>
  )
}
