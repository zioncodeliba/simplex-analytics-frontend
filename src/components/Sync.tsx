'use client'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FolderSync } from 'lucide-react'

const SyncButton = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSync = async () => {
    setLoading(true)

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sync-now`,
        {
          withCredentials: true,
        }
      )

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

  return (
    <button onClick={handleSync} disabled={loading} className='flex gap-2'>
      <FolderSync />
      {loading ? 'Syncing...' : 'Sync Now'}
    </button>
  )
}

export default SyncButton
