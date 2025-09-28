'use client'

import React, { useEffect } from 'react'

export default function AuthSuccessPage() {
  useEffect(() => {
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    
    if (isDevelopment) {
      // If running locally, redirect to local homepage
      window.location.href = 'http://localhost:3000/'
    } else {
      // If on production, redirect to production homepage  
      window.location.href = '/'
    }
  }, [])

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
          Đang chuyển hướng về trang chủ...
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