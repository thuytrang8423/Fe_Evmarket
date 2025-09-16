"use client"
import React, { useState } from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

function SearchContent() {
  const [searchValue, setSearchValue] = useState('')
  const { t } = useI18nContext()

  const brandTags = [
    'Tesla',
    'Nissan Leaf', 
    'Chevrolet Bolt',
    'BMW i3',
    'Lithium Ion',
    '18650 Cells',
    'PowerWall'
  ]

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold mb-8" style={{color: colors.Text}}>
          {t('homepage.search.title')}
        </h2>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5" 
                style={{color: colors.SubText}}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t('homepage.search.placeholder')}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
              style={{
                backgroundColor: '#ffffff',
                color: colors.Text,
              }}
            />
          </div>
        </div>

        {/* Brand Tags */}
        <div className="flex flex-wrap justify-center gap-3">
          {brandTags.map((brand, index) => (
            <button
              key={index}
              className="px-4 py-2 rounded-full border border-gray-300 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              style={{
                color: colors.SubText,
                backgroundColor: '#ffffff',
              }}
              onClick={() => setSearchValue(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchContent