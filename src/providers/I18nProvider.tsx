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
  
  // Don't block rendering - components will handle their own loading states
  // Just provide default values if still loading
  const contextValue = i18n.loading 
    ? { ...i18n, t: (key: string, fallback?: string) => fallback || key }
    : i18n
  
  return (
    <I18nContext.Provider value={contextValue}>
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