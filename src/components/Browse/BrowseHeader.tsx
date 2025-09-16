"use client"
import React from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface BrowseHeaderProps {
  onToggleFilter: () => void
  isFilterOpen: boolean
}

function BrowseHeader({ onToggleFilter, isFilterOpen }: BrowseHeaderProps) {
  const { t } = useI18nContext()

  return (
    <div className="bg-white border-b" style={{ borderColor: colors.Border }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 
              className="text-3xl lg:text-4xl font-bold"
              style={{ color: colors.Text }}
            >
              {t('browse.title')}
            </h1>
            <p 
              className="text-base lg:text-lg"
              style={{ color: colors.SubText }}
            >
              {t('browse.subtitle')}
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={onToggleFilter}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" style={{ color: colors.Text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium" style={{ color: colors.Text }}>
              {t('browse.filters')}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BrowseHeader
