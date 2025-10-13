"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ensureValidToken } from '@/services/Auth'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const token = await ensureValidToken()
        if (!mounted) return
        if (!token) {
          const query = searchParams?.toString() || ''
          const current = `/checkout${query ? `?${query}` : ''}`
          router.replace(`/login?redirect=${encodeURIComponent(current)}`)
          return
        }
        setReady(true)
      } catch {
        if (!mounted) return
        const query = searchParams?.toString() || ''
        const current = `/checkout${query ? `?${query}` : ''}`
        router.replace(`/login?redirect=${encodeURIComponent(current)}`)
      }
    })()
    return () => { mounted = false }
  }, [router, searchParams])

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-600">
          <div className="h-8 w-8 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
          <p>Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </div>
    )
  }
  return <>{children}</>
}
