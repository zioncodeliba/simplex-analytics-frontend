'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FolderSync } from 'lucide-react'
import { useGetCurrentUserQuery } from '@/services/userProfile'

const SyncButton = () => {
  const [loading, setLoading] = useState(false)
  const [fullLoading, setFullLoading] = useState(false)
  const router = useRouter()
  const { data: currentUser } = useGetCurrentUserQuery()
  const isAdmin = (currentUser?.user?.userType ?? '').toLowerCase() === 'admin'
  const handleSync = async () => {
    setLoading(true)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''
      if (!apiBase) {
        throw new Error('Missing NEXT_PUBLIC_API_URL')
      }
      const url = `${apiBase.replace(/\/$/, '')}/auth/sync-now`

      const res = await axios.get(url, {
        withCredentials: true,
      })

      if (res.status === 200) {
        toast.success('Sync completed successfully!')
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        throw new Error(res.data?.message || 'Sync failed')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleFullPosthogSync = async () => {
    setFullLoading(true)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''
      if (!apiBase) {
        throw new Error('Missing NEXT_PUBLIC_API_URL')
      }
      const url = `${apiBase.replace(/\/$/, '')}/auth/sync-posthog-full`

      const res = await axios.get(url, {
        withCredentials: true,
      })

      if (res.status === 200) {
        toast.success('PostHog full sync started')
      } else {
        throw new Error(res.data?.message || 'Full sync failed')
      }
    } catch (error) {
      const message =
        (error as Error)?.message || 'Error starting PostHog full sync'
      toast.error(message)
    } finally {
      setFullLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <button onClick={handleSync} disabled={loading} className='flex gap-2'>
        <FolderSync />
        {loading ? 'Syncing...' : 'Sync Now'}
      </button>
      {isAdmin && (
        <button
          onClick={handleFullPosthogSync}
          disabled={fullLoading}
          className='flex gap-2 text-xs text-gray-500'
        >
          <FolderSync className='w-4 h-4' />
          {fullLoading ? 'Full Syncing...' : 'PostHog Full Sync'}
        </button>
      )}
    </div>
  )
}

export default SyncButton
