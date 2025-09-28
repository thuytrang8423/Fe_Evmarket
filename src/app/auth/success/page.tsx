'use client'

import React, { useEffect, useState } from 'react'
import { storeAuthToken, clearAuthCache } from '../../../services'

export default function AuthSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Method 1: Get token from URL parameters (common pattern for OAuth callbacks)
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token') || urlParams.get('access_token') || urlParams.get('accessToken')
        
        if (token) {
          console.log('Storing token from Google OAuth URL parameters')
          // Store the token from Google OAuth
          storeAuthToken(token)
          
          // Clear auth cache to ensure fresh authentication check
          clearAuthCache()
          
          console.log('Google OAuth token stored successfully')
        } else {
          console.log('No token found in URL parameters')
          
          // Method 2: Try to call a "get current user session" endpoint
          // Some OAuth implementations store session on server and return it via API call
          try {
            const response = await fetch('https://evmarket-api-staging.onrender.com/api/v1/auth/session', {
              method: 'GET',
              credentials: 'include', // Include cookies that might have been set
              headers: {
                'Content-Type': 'application/json',
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              console.log('Session data from server:', data)
              
              if (data.token || data.access_token || data.accessToken) {
                const sessionToken = data.token || data.access_token || data.accessToken
                console.log('Storing token from session endpoint')
                storeAuthToken(sessionToken)
              } else if (data.data && (data.data.token || data.data.access_token || data.data.accessToken)) {
                const sessionToken = data.data.token || data.data.access_token || data.data.accessToken
                console.log('Storing token from session endpoint (nested)')
                storeAuthToken(sessionToken)
              }
            } else {
              console.log('Session endpoint returned:', response.status)
            }
          } catch (sessionError) {
            console.log('Could not fetch session, might be using cookies only:', sessionError)
          }
        }
        
        // Clear auth cache regardless to force fresh check
        clearAuthCache()
        
        // Wait a moment for token to be stored
        setTimeout(() => {
          const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          
          if (isDevelopment) {
            // If running locally, redirect to local homepage
            window.location.href = 'http://localhost:3000/'
          } else {
            // If on production, redirect to production homepage  
            window.location.href = '/'
          }
        }, 1500) // Increase delay to allow token processing
        
      } catch (error) {
        console.error('Error handling Google OAuth callback:', error)
        setError('Đã xảy ra lỗi trong quá trình xử lý đăng nhập')
        setIsProcessing(false)
      }
    }

    handleAuthSuccess()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 text-red-600">❌</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lỗi đăng nhập
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-green-300 border-t-green-600"></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Đăng nhập thành công!
        </h2>
        <p className="text-gray-600">
          Đang xử lý thông tin đăng nhập và chuyển hướng về trang chủ...
        </p>
        
        {/* Manual redirect button for fallback */}
        <button 
          onClick={() => window.location.href = window.location.hostname === 'localhost' ? 'http://localhost:3000/' : '/'}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Nhấn vào đây nếu không tự động chuyển hướng
        </button>
      </div>
    </div>
  )
}