'use client'

import { useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const LOGIN_FALLBACK_URL = 'https://devreals2.simplex3d.com/authenticator/login'

const AuthGate = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlToken = searchParams?.get('token') ?? undefined
    const cookieToken = Cookies.get('token')
    const token = urlToken || cookieToken

    if (!token) return

    if (urlToken && urlToken !== cookieToken) {
      Cookies.set('token', urlToken)
    }

    const loginUrl =
      process.env.NEXT_PUBLIC_CLIENT_LOGIN ||
      process.env.CLIENT_LOGIN ||
      LOGIN_FALLBACK_URL

    const isLoginPath = pathname.endsWith('/login')

    const exchangeToken = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })

        Cookies.remove('token')

        const cleanParams = new URLSearchParams(searchParams?.toString())
        cleanParams.delete('token')
        const query = cleanParams.toString()

        const targetPath = isLoginPath
          ? pathname.replace(/\/login$/, '') || '/'
          : pathname
        const targetUrl = query ? `${targetPath}?${query}` : targetPath

        router.replace(targetUrl)
      } catch {
        Cookies.remove('token')
        window.location.href = loginUrl
      }
    }

    exchangeToken()
  }, [pathname, router, searchParams])

  return null
}

export default AuthGate
