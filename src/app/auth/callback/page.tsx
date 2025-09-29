"use client"
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { storeAuthToken, storeRefreshToken } from '../../../services'

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get tokens from URL parameters
        const token = searchParams.get('token') || searchParams.get('accessToken') || searchParams.get('access_token')
        const refreshToken = searchParams.get('refreshToken') || searchParams.get('refresh_token')
        const error = searchParams.get('error')
        
        if (error) {
          // Handle error case
          console.error('Auth error:', error)
          window.location.href = '/login?error=auth_failed'
          return
        }
        
        if (token) {
          // Store the access token
          storeAuthToken(token, 24) // Store for 24 hours
          
          // Store refresh token if available
          if (refreshToken) {
            storeRefreshToken(refreshToken)
          }
          
          // Redirect to home page immediately
          window.location.href = '/'
        } else {
          // No token found, redirect to login with error
          window.location.href = '/login?error=no_token'
        }
      } catch (error) {
        console.error('Auth callback handling failed:', error)
        window.location.href = '/login?error=callback_failed'
      }
    }

    handleAuthCallback()
  }, [searchParams])

  // Show minimal loading screen while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Redirecting...</p>
      </div>
    </div>
  )
}