// Login.jsx
'use client'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Shield, CheckCircle, XCircle } from 'lucide-react'
import '../../styles/login.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const Login = () => {
  const [loading, setLoading] = useState(true)
  const [hasToken, setHasToken] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      setHasToken(true)
      fetchData(token)
    } else {
      setHasToken(false)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async (token: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })

      localStorage.setItem('simplex_name', res.data.name)
      router.push('/')
      Cookies.remove('token')
    } catch {
      Cookies.remove('token')
      setHasToken(false)
    } finally {
      setLoading(false)
    }
  }

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className='auth-container'>
        <div className='loading-wrapper'>
          <div className='spinner-container'>
            <div className='spinner'>
              <div className='spinner-icon'>
                <Shield color='#ffffff' size={32} />
              </div>
            </div>
          </div>
          <p className='loading-text'>Verifying Authentication</p>
          <p className='sub-text'>Please wait...</p>
        </div>
      </div>
    )
  }
  if (!hasToken) {
    return (
      <div className='auth-container'>
        <div className='auth-card'>
          <div className='icon-center'>
            <div className='icon-container icon-error'>
              <XCircle color='#ef4444' size={64} />
            </div>
          </div>
          <h1 className='heading'>Access Denied</h1>
          <p className='text-content'>
            Authentication token not found. Please log in to continue.
          </p>
          <div className='divider '>
            <Link
              className='btn-primary'
              target='_blank'
              href={
                process.env.CLIENT_LOGIN ||
                'https://devreals2.simplex3d.com/authenticator/login'
              }
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='auth-container'>
      <div className='auth-card auth-card-wide'>
        <div className='icon-center'>
          <div className='icon-container icon-success'>
            <CheckCircle color='#22c55e' size={64} />
          </div>
        </div>
        <h1 className='heading'>Authentication Successful</h1>
        <p className='text-content text-margin'>
          Your session is verified and active
        </p>

        <div className='data-box'>
          <pre className='data-pre'>Login Successfully</pre>
        </div>

        <div className='button-group'>
          <Link href={'/'} className='btn-primary btn-flex'>
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
