"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { storeAuthToken, storeRefreshToken } from '../../../services'

export default function AuthSuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Get tokens from URL parameters
        const token = searchParams.get('token') || searchParams.get('accessToken')
        const refreshToken = searchParams.get('refreshToken')
        
        if (token) {
          // Store the access token
          storeAuthToken(token, 24) // Store for 24 hours
          
          // Store refresh token if available
          if (refreshToken) {
            storeRefreshToken(refreshToken)
          }
          
          setStatus('success')
          
          // Redirect to home page after a brief delay
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        } else {
          // No token found, redirect to login
          setStatus('error')
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
        }
      } catch (error) {
        console.error('Auth success handling failed:', error)
        setStatus('error')
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      }
    }

    handleAuthSuccess()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đang xử lý đăng nhập...
            </h2>
            <p className="text-gray-600">
              Vui lòng chờ trong giây lát
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đăng nhập thành công!
            </h2>
            <p className="text-gray-600">
              Đang chuyển hướng về trang chủ...
            </p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Đăng nhập thất bại
            </h2>
            <p className="text-gray-600">
              Đang chuyển hướng về trang đăng nhập...
            </p>
          </>
        )}
      </div>
    </div>
  )
}