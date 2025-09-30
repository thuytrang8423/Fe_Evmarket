"use client"
import React, { useState } from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'
import { FilterState } from '../../types/product'

interface BrowseFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearFilters: () => void
  isOpen?: boolean
  availableBrands?: string[]
  className?: string
}

function BrowseFilters({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  isOpen = true,
  availableBrands = [],
  className = '' 
}: BrowseFiltersProps) {
  const { t } = useI18nContext()

  // Use availableBrands from props or fallback to default
  const brands = availableBrands.length > 0 ? availableBrands : [
    'Tesla',
    'Nissan', 
    'Chevrolet',
    'BMW',
    'Audi',
    'Hyundai',
    'Volkswagen',
    'LG',
    'BYD',
    'Generic'
  ]

  const handleInputChange = (field: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [field]: value })
  }

  const handleBrandToggle = (brand: string) => {
    const updatedBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand]
    handleInputChange('brands', updatedBrands)
  }

  return (
    <div className={`bg-white lg:border-r ${className} ${isOpen ? 'block' : 'hidden lg:block'}`} 
         style={{ borderColor: colors.Border }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: colors.Text }}>
            {t('browse.filters')}
          </h3>
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            {t('browse.clearAll')}
          </button>
        </div>

        {/* Search */}
        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: colors.Text }}>
            {t('browse.search')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              placeholder={t('browse.searchPlaceholder')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ 
                borderColor: colors.Border,
                color: colors.Text 
              }}
            />
            <svg 
              className="absolute right-3 top-2.5 w-5 h-5" 
              style={{ color: colors.SubText }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Product Type */}
        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: colors.Text }}>
            {t('browse.productType')}
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: t('browse.allProducts') },
              { value: 'vehicles', label: t('browse.vehicles') },
              { value: 'batteries', label: t('browse.batteries') }
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="productType"
                  value={option.value}
                  checked={filters.productType === option.value}
                  onChange={(e) => handleInputChange('productType', e.target.value)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm" style={{ color: colors.Text }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: colors.Text }}>
            {t('browse.priceRange')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1" style={{ color: colors.SubText }}>
                Min
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                placeholder="$0"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ 
                  borderColor: colors.Border,
                  color: colors.Text 
                }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: colors.SubText }}>
                Max
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                placeholder="$50000"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ 
                  borderColor: colors.Border,
                  color: colors.Text 
                }}
              />
            </div>
          </div>
        </div>

        {/* Brands */}
        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: colors.Text }}>
            {t('browse.brands')}
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm" style={{ color: colors.Text }}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Battery Health */}
        {(filters.productType === 'all' || filters.productType === 'batteries') && (
          <div className="space-y-3">
            <label className="block text-sm font-medium" style={{ color: colors.Text }}>
              {t('browse.batteryHealth')}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.batteryHealth}
                onChange={(e) => handleInputChange('batteryHealth', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs" style={{ color: colors.SubText }}>
                <span>0%</span>
                <span className="font-medium" style={{ color: colors.Text }}>
                  {filters.batteryHealth}%+
                </span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

        {/* Seller Verification */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={(e) => handleInputChange('verifiedOnly', e.target.checked)}
              className="mr-3 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm" style={{ color: colors.Text }}>
              {t('browse.verifiedOnly')}
            </span>
          </label>
        </div>

        {/* Reset Filters */}
        <div className="pt-4 border-t" style={{ borderColor: colors.Border }}>
          <button
            onClick={onClearFilters}
            className="w-full py-2 px-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
            style={{ 
              borderColor: colors.Border,
              color: colors.Text 
            }}
          >
            {t('browse.clearAll')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BrowseFilters
