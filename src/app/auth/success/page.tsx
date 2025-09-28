'use client'

import React, { useEffect, useState } from 'react'
import { storeAuthToken, clearAuthCache } from '../../../services'

export default function AuthSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        console.log('Google OAuth callback - processing authentication...')
        

        // Gọi API /refresh-token để lấy accessToken
        try {
          const response = await fetch('https://evmarket-api-staging.onrender.com/api/v1/auth/refresh-token', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          if (response.ok) {
            const data = await response.json()
            const token = data.accessToken || data.token || data.access_token
            if (token) {
              storeAuthToken(token)
              clearAuthCache()
              console.log('Google OAuth: accessToken stored from /refresh-token')
            } else {
              throw new Error('Không nhận được accessToken từ /refresh-token')
            }
          } else {
            throw new Error('Lỗi khi gọi /refresh-token: ' + response.status)
          }
        } catch (refreshError) {
          console.error('Lỗi khi gọi /refresh-token:', refreshError)
          throw new Error('Không thể lấy accessToken sau khi đăng nhập Google')
        }

        // Clear auth cache to force fresh check
        clearAuthCache()

        // Wait a moment for authentication to be processed
        setTimeout(() => {
          const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          if (isDevelopment) {
            window.location.href = 'http://localhost:3000/'
          } else {
            window.location.href = '/'
          }
        }, 1500)
        
      } catch (error) {
        console.error('Error handling Google OAuth callback:', error)
        setError(error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình xử lý đăng nhập')
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