"use client"
import React, { useState } from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { t } = useI18nContext()

  const tabs = [
    { 
      id: 'dashboard', 
      label: t('seller.tabs.dashboard'), 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'listings', 
      label: t('seller.tabs.listings'), 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )
    },
    { 
      id: 'add', 
      label: t('seller.tabs.addListing'), 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    }
  ]

  return (
    <div className="bg-white border-b" style={{ borderColor: colors.Border }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent hover:text-blue-600'
                }`}
                style={!isActive ? { color: colors.SubText } : {}}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TabNavigation
