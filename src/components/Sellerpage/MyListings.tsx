"use client"
import React, { useState } from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'
import Image from 'next/image'

function MyListings() {
  const { t } = useI18nContext()
  const [filter, setFilter] = useState('all')

  // Mock listings data
  const listings = [
    {
      id: 1,
      title: '2020 Tesla Model 3 Long Range',
      price: '$32,900',
      status: 'active',
      views: 245,
      messages: 12,
      posted: '2 days ago',
      image: '/Homepage/TopCar.png',
      specs: {
        mileage: '45,000 miles',
        battery: '85% health',
        location: 'San Francisco, CA'
      }
    },
    {
      id: 2,
      title: '2019 Nissan Leaf SV Plus',
      price: '$18,500',
      status: 'active',
      views: 89,
      messages: 5,
      posted: '1 week ago',
      image: '/Homepage/Car.png',
      specs: {
        mileage: '32,000 miles',
        battery: '92% health',
        location: 'Los Angeles, CA'
      }
    },
    {
      id: 3,
      title: '2018 BMW i3 REX',
      price: '$22,000',
      status: 'sold',
      views: 156,
      messages: 8,
      posted: '2 weeks ago',
      image: '/Homepage/TopCar.png',
      specs: {
        mileage: '28,500 miles',
        battery: '88% health',
        location: 'Oakland, CA'
      }
    }
  ]

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true
    return listing.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'sold':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('seller.listings.active')
      case 'sold':
        return t('seller.listings.sold')
      case 'pending':
        return t('seller.listings.pending')
      default:
        return status
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.Text }}>
            {t('seller.listings.title')}
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.SubText }}>
            {t('seller.listings.subtitle')}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            style={filter !== 'all' ? { color: colors.Text } : {}}
          >
            {t('seller.listings.all')}
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              filter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            style={filter !== 'active' ? { color: colors.Text } : {}}
          >
            {t('seller.listings.active')}
          </button>
          <button
            onClick={() => setFilter('sold')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              filter === 'sold'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            style={filter !== 'sold' ? { color: colors.Text } : {}}
          >
            {t('seller.listings.sold')}
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div 
            key={listing.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            style={{ borderColor: colors.Border }}
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover"
              />
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                  {getStatusText(listing.status)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title and Price */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold" style={{ color: colors.Text }}>
                  {listing.title}
                </h3>
                <span className="text-lg font-bold" style={{ color: colors.PriceText }}>
                  {listing.price}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" style={{ color: colors.SubText }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm" style={{ color: colors.Description }}>
                    {listing.specs.mileage} • {listing.specs.battery}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" style={{ color: colors.SubText }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm" style={{ color: colors.Description }}>
                    {listing.specs.location}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm mb-4" style={{ color: colors.SubText }}>
                <div className="flex items-center gap-4">
                  <span>{listing.views} {t('seller.listings.views')}</span>
                  <span>{listing.messages} {t('seller.listings.messages')}</span>
                </div>
                <span>{listing.posted}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button 
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  {t('seller.listings.edit')}
                </button>
                <button 
                  className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                  style={{ 
                    color: colors.Text,
                    borderColor: colors.Border 
                  }}
                >
                  {t('seller.listings.view')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4" style={{ color: colors.SubText }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium mb-2" style={{ color: colors.Text }}>
            {t('seller.listings.noListings')}
          </h3>
          <p className="text-sm" style={{ color: colors.SubText }}>
            {t('seller.listings.noListingsDesc')}
          </p>
        </div>
      )}
    </div>
  )
}

export default MyListings
