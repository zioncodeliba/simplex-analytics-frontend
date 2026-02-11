'use client'

import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

export function LogoutButton() {
  const logout = async (): Promise<void> => {
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,

        {
          withCredentials: true,
        }
      )

      toast.success('Logged out successfully')
      const loginUrl =
        process.env.NEXT_PUBLIC_CLIENT_LOGIN ||
        'https://devreals2.simplex3d.com/authenticator/login'
      window.location.href = loginUrl
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
