"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface SearchSuggestion {
  text: string
  type: 'brand' | 'model' | 'category'
  category?: string
  score?: number
}

function SearchContent() {
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const { t } = useI18nContext()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const brandTags = [
    'Tesla',
    'Nissan Leaf', 
    'Chevrolet Bolt',
    'BMW i3',
    'Lithium Ion',
    '18650 Cells',
    'PowerWall'
  ]

  // Extended search database for better suggestions
  const searchDatabase: SearchSuggestion[] = [
    // Car brands
    { text: 'Tesla', type: 'brand' },
    { text: 'Tesla Model 3', type: 'model', category: 'Tesla' },
    { text: 'Tesla Model S', type: 'model', category: 'Tesla' },
    { text: 'Tesla Model X', type: 'model', category: 'Tesla' },
    { text: 'Tesla Model Y', type: 'model', category: 'Tesla' },
    { text: 'Tesla Cybertruck', type: 'model', category: 'Tesla' },
    
    { text: 'Nissan', type: 'brand' },
    { text: 'Nissan Leaf', type: 'model', category: 'Nissan' },
    { text: 'Nissan Ariya', type: 'model', category: 'Nissan' },
    
    { text: 'BMW', type: 'brand' },
    { text: 'BMW i3', type: 'model', category: 'BMW' },
    { text: 'BMW i4', type: 'model', category: 'BMW' },
    { text: 'BMW iX', type: 'model', category: 'BMW' },
    
    { text: 'Chevrolet', type: 'brand' },
    { text: 'Chevrolet Bolt', type: 'model', category: 'Chevrolet' },
    { text: 'Chevrolet Bolt EV', type: 'model', category: 'Chevrolet' },
    { text: 'Chevrolet Volt', type: 'model', category: 'Chevrolet' },
    
    { text: 'VinFast', type: 'brand' },
    { text: 'VinFast VF8', type: 'model', category: 'VinFast' },
    { text: 'VinFast VF9', type: 'model', category: 'VinFast' },
    
    { text: 'Hyundai', type: 'brand' },
    { text: 'Hyundai Kona Electric', type: 'model', category: 'Hyundai' },
    { text: 'Hyundai Ioniq 5', type: 'model', category: 'Hyundai' },
    
    { text: 'Ford', type: 'brand' },
    { text: 'Ford Mustang Mach-E', type: 'model', category: 'Ford' },
    { text: 'Ford F-150 Lightning', type: 'model', category: 'Ford' },
    
    // Battery types
    { text: 'Lithium Ion', type: 'category' },
    { text: 'LiFePO4', type: 'category' },
    { text: 'NMC Battery', type: 'category' },
    { text: 'LTO Battery', type: 'category' },
    { text: '18650 Cells', type: 'category' },
    { text: '21700 Cells', type: 'category' },
    { text: 'PowerWall', type: 'category' },
    { text: 'Home Battery', type: 'category' },
    { text: 'EV Battery Pack', type: 'category' },
    
    // Common search terms
    { text: 'Electric Vehicle', type: 'category' },
    { text: 'EV Battery', type: 'category' },
    { text: 'Used Tesla', type: 'category' },
    { text: 'Second Hand EV', type: 'category' },
    { text: 'Electric Car', type: 'category' },
  ]

  // Fuzzy search function
  const fuzzySearch = (query: string, text: string): number => {
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    
    // Exact match gets highest score
    if (textLower.includes(queryLower)) {
      return textLower.indexOf(queryLower) === 0 ? 100 : 80
    }
    
    // Character matching
    let score = 0
    let queryIndex = 0
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score += 10
        queryIndex++
      }
    }
    
    // Bonus for matching all characters
    if (queryIndex === queryLower.length) {
      score += 20
    }
    
    return score
  }

  // Get search suggestions
  const getSuggestions = (query: string): SearchSuggestion[] => {
    if (!query.trim() || query.length < 2) {
      return []
    }

    const scoredSuggestions = searchDatabase
      .map(item => ({
        ...item,
        score: fuzzySearch(query, item.text)
      }))
      .filter(item => item.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ score, ...item }) => item)

    return scoredSuggestions
  }

  // Handle input change and update suggestions
  const handleInputChange = (value: string) => {
    setSearchValue(value)
    const newSuggestions = getSuggestions(value)
    setSuggestions(newSuggestions)
    setShowSuggestions(newSuggestions.length > 0)
    setSelectedSuggestionIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0) {
        handleSuggestionClick(suggestions[selectedSuggestionIndex])
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const handleSearch = () => {
    if (searchValue.trim()) {
      setShowSuggestions(false)
      router.push(`/browse?search=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchValue(suggestion.text)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    router.push(`/browse?search=${encodeURIComponent(suggestion.text)}`)
  }

  const handleTagClick = (brand: string) => {
    setSearchValue(brand)
    setShowSuggestions(false)
    router.push(`/browse?search=${encodeURIComponent(brand)}`)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'brand':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      case 'model':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        )
      case 'category':
        return (
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold mb-8" style={{color: colors.Text}}>
          {t('homepage.search.title')}
        </h2>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative flex">
            <div className="relative flex-1">
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
                ref={searchInputRef}
                type="text"
                placeholder={t('homepage.search.placeholder')}
                value={searchValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true)
                  }
                }}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                style={{
                  backgroundColor: '#ffffff',
                  color: colors.Text,
                }}
              />
              
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.text}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`flex items-center px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
                        selectedSuggestionIndex === index 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {suggestion.text}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {suggestion.type === 'brand' && 'Thương hiệu'}
                          {suggestion.type === 'model' && 'Mẫu xe'}
                          {suggestion.type === 'category' && 'Danh mục'}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-400">
                        {suggestion.score ? Math.round(suggestion.score * 100) : 100}% match
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-r-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {t('homepage.search.searchBtn')}
            </button>
          </div>
        </div>

        {/* Brand Tags */}
        <div className="flex flex-wrap justify-center gap-3">
          {brandTags.map((brand, index) => (
            <button
              key={index}
              className="px-4 py-2 rounded-full border border-gray-300 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105"
              style={{
                color: colors.SubText,
                backgroundColor: '#ffffff',
              }}
              onClick={() => handleTagClick(brand)}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Quick Access Info */}
        <div className="mt-8 text-sm" style={{color: colors.SubText}}>
          <p>{t('homepage.search.quickTip', 'Click on tags for quick search or type your own keywords')}</p>
        </div>
      </div>
    </div>
  )
}

export default SearchContent