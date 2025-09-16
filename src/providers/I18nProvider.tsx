"use client"
import React, { createContext, useContext, ReactNode } from 'react'
import { useI18n } from '../hooks/useI18n'

type I18nContextType = {
  locale: 'en' | 'vn'
  changeLocale: (locale: 'en' | 'vn') => void
  t: (key: string, fallback?: string) => string
  loading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const i18n = useI18n()
  
  // Hiển thị loading nếu vẫn đang tải translations
  if (i18n.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18nContext() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nProvider')
  }
  return context
}