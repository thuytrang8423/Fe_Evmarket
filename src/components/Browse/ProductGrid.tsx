"use client"
import React, { useState } from 'react'
import colors from '../../Utils/Color'
import Image from 'next/image'
import { useI18nContext } from '../../providers/I18nProvider'

interface Product {
  id: number
  name: string
  year: string
  mileage?: string
  price: string
  image: string
  verified: boolean
  fastSale: boolean
  popular?: boolean
  rating: number
  sellPercentage?: string
  type: 'vehicle' | 'battery'
  batteryHealth?: number
  capacity?: string
  brand: string
}

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  className?: string
}

function ProductGrid({ 
  products = [], 
  isLoading = false,
  className = '' 
}: ProductGridProps) {
  const { t } = useI18nContext()
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 9

  // Mock data for demonstration - similar to TopEV.tsx but expanded
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Tesla Model 3',
      year: '2020',
      mileage: '30,455 miles',
      price: '$29,500',
      image: '/Homepage/TopCar.png',
      verified: true,
      fastSale: false,
      rating: 4.9,
      sellPercentage: '92% SoH',
      type: 'vehicle',
      brand: 'Tesla'
    },
    {
      id: 2,
      name: 'Nissan Leaf',
      year: '2019',
      mileage: '42,120 miles',
      price: '$16,800',
      image: '/Homepage/TopCar.png',
      verified: false,
      fastSale: true,
      rating: 4.7,
      sellPercentage: '85% SoH',
      type: 'vehicle',
      brand: 'Nissan'
    },
    {
      id: 3,
      name: 'Chevrolet Bolt',
      year: '2021',
      mileage: '18,670 miles',
      price: '$22,300',
      image: '/Homepage/TopCar.png',
      verified: false,
      fastSale: false,
      rating: 4.8,
      sellPercentage: '94% SoH',
      type: 'vehicle',
      brand: 'Chevrolet'
    },
    {
      id: 4,
      name: 'BMW i3',
      year: '2019',
      mileage: '35,210 miles',
      price: '$19,900',
      image: '/Homepage/TopCar.png',
      verified: false,
      fastSale: false,
      rating: 4.6,
      sellPercentage: '88% SoH',
      type: 'vehicle',
      brand: 'BMW'
    },
    {
      id: 5,
      name: 'Tesla PowerWall',
      year: '2021',
      price: '$5,800',
      image: '/Homepage/TopCar.png',
      verified: true,
      fastSale: false,
      popular: true,
      rating: 4.9,
      type: 'battery',
      capacity: '13.5 kWh',
      batteryHealth: 95,
      brand: 'Tesla'
    },
    {
      id: 6,
      name: 'Leaf Battery Pack',
      year: '2019',
      price: '$3,200',
      image: '/Homepage/TopCar.png',
      verified: false,
      fastSale: false,
      rating: 4.5,
      type: 'battery',
      capacity: '40 kWh',
      batteryHealth: 87,
      brand: 'Nissan'
    },
    {
      id: 7,
      name: 'LG Chem RESU',
      year: '2020',
      price: '$4,900',
      image: '/Homepage/TopCar.png',
      verified: false,
      fastSale: true,
      rating: 4.4,
      type: 'battery',
      capacity: '9.8 kWh',
      batteryHealth: 92,
      brand: 'LG'
    },
    {
      id: 8,
      name: '18650 Cells (x100)',
      year: '2022',
      price: '$450',
      image: '/Homepage/TopCar.png',
      verified: false,
      fastSale: false,
      popular: true,
      rating: 4.7,
      type: 'battery',
      capacity: '3.7V 3000mAh',
      batteryHealth: 98,
      brand: 'Generic'
    },
    {
      id: 9,
      name: 'Audi e-tron',
      year: '2020',
      mileage: '25,890 miles',
      price: '$35,900',
      image: '/Homepage/TopCar.png',
      verified: true,
      fastSale: true,
      rating: 4.8,
      sellPercentage: '90% SoH',
      type: 'vehicle',
      brand: 'Audi'
    },
    {
      id: 10,
      name: 'Hyundai Kona Electric',
      year: '2021',
      mileage: '15,230 miles',
      price: '$24,500',
      image: '/Homepage/TopCar.png',
      verified: false,
      fastSale: false,
      popular: true,
      rating: 4.6,
      sellPercentage: '96% SoH',
      type: 'vehicle',
      brand: 'Hyundai'
    },
    {
      id: 11,
      name: 'Tesla Model Y',
      year: '2022',
      mileage: '12,450 miles',
      price: '$52,800',
      image: '/Homepage/TopCar.png',
      verified: true,
      fastSale: false,
      rating: 4.9,
      sellPercentage: '98% SoH',
      type: 'vehicle',
      brand: 'Tesla'
    },
    {
      id: 12,
      name: 'BYD Blade Battery',
      year: '2021',
      price: '$6,200',
      image: '/Homepage/TopCar.png',
      verified: true,
      fastSale: true,
      rating: 4.7,
      type: 'battery',
      capacity: '60 kWh',
      batteryHealth: 94,
      brand: 'BYD'
    },
    {
      id: 13,
      name: 'Volkswagen ID.4',
      year: '2021',
      mileage: '18,760 miles',
      price: '$28,900',
      image: '/Homepage/TopCar.png',
      verified: false,
      fastSale: false,
      rating: 4.5,
      sellPercentage: '93% SoH',
      type: 'vehicle',
      brand: 'Volkswagen'
    }
  ]

  const displayProducts = products.length > 0 ? products : mockProducts
  
  // Pagination logic
  const totalPages = Math.ceil(displayProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentProducts = displayProducts.slice(startIndex, endIndex)

  const sortOptions = [
    { value: 'newest', label: t('browse.sortOptions.newest') },
    { value: 'priceLow', label: t('browse.sortOptions.priceLow') },
    { value: 'priceHigh', label: t('browse.sortOptions.priceHigh') },
    { value: 'rating', label: t('browse.sortOptions.rating') }
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p style={{ color: colors.SubText }}>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-sm" style={{ color: colors.SubText }}>
            Showing <span className="font-medium" style={{ color: colors.Text }}>
              {startIndex + 1}-{Math.min(endIndex, displayProducts.length)}
            </span> of <span className="font-medium" style={{ color: colors.Text }}>
              {displayProducts.length}
            </span> {t('browse.results')}
          </p>
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: colors.Text }}>
            {t('browse.sortBy')}:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ 
              borderColor: colors.Border,
              color: colors.Text 
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {currentProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-sm mx-auto">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto" style={{ color: colors.SubText }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2" style={{ color: colors.Text }}>
              {t('browse.noResults')}
            </h3>
            <p className="text-sm" style={{ color: colors.SubText }}>
              {t('browse.noResultsDesc')}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Product Image */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badges - Top Right (higher z-index to show above car) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-20">
                  {product.verified && (
                    <div className="flex items-center">
                      <Image
                        src="/Homepage/Verified.svg"
                        alt="Verified"
                        width={81}
                        height={20}
                        className="h-5 w-auto"
                      />
                    </div>
                  )}
                  {product.fastSale && (
                    <div className="flex items-center">
                      <Image
                        src="/Homepage/Sale.svg"
                        alt="Fast Sale"
                        width={89}
                        height={20}
                        className="h-5 w-auto"
                      />
                    </div>
                  )}
                  {product.popular && (
                    <div className="flex items-center">
                      <Image
                        src="/Homepage/Popular.svg"
                        alt="Popular"
                        width={89}
                        height={20}
                        className="h-5 w-auto"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Name and Price */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg" style={{color: colors.Text}}>
                    {product.name}
                  </h3>
                  <span className="text-lg font-bold" style={{color: colors.PriceText}}>
                    {product.price}
                  </span>
                </div>

                {/* Year and Mileage/Capacity */}
                <p className="text-sm mb-3" style={{color: colors.Description}}>
                  {product.year} {product.mileage && `• ${product.mileage}`}
                  {product.capacity && `• ${product.capacity}`}
                </p>

                {/* Bottom Row */}
                <div className="flex justify-between items-center">
                  {/* Battery Health or Sell Percentage with Pin */}
                  <div className="flex items-center gap-1">
                    <Image
                      src="/Homepage/Pin.svg"
                      alt="Pin"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {product.sellPercentage || `${product.batteryHealth}% SoH`}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Image
                      src="/Homepage/Star.svg"
                      alt="Star"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium" style={{color: colors.Text}}>
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Previous Button */}
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            style={{ 
              borderColor: colors.Border,
              color: colors.Text 
            }}
          >
            {t('browse.previous')}
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                currentPage === page 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
              style={{ 
                borderColor: currentPage === page ? '#2563eb' : colors.Border,
                color: currentPage === page ? 'white' : colors.Text 
              }}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
            style={{ 
              borderColor: colors.Border,
              color: colors.Text 
            }}
          >
            {t('browse.next')}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
