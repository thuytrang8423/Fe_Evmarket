"use client"
import React from 'react'
import colors from '../../Utils/Color'
import Image from 'next/image'
import { useI18nContext } from '../../providers/I18nProvider'

function VerifiedSeller() {
  const { t } = useI18nContext()
  
  const verifiedSellers = [
    {
      id: 1,
      name: 'John Smith',
      avatar: '/Homepage/Seller.png',
      verified: true,
      rating: 4.9
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      avatar: '/Homepage/Seller.png',
      verified: true,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Michael Chen',
      avatar: '/Homepage/Seller.png',
      verified: true,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Emma Davis',
      avatar: '/Homepage/Seller.png',
      verified: true,
      rating: 4.9
    },
    {
      id: 5,
      name: 'David Wilson',
      avatar: '/Homepage/Seller.png',
      verified: true,
      rating: 4.6
    },
    {
      id: 6,
      name: 'Jessica Brown',
      avatar: '/Homepage/Seller.png',
      verified: true,
      rating: 4.8
    }
  ]

  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{color: colors.Text}}>
            {t('homepage.verifiedSeller.title')}
          </h2>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
          >
            {t('common.viewAll')}
          </button>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {verifiedSellers.map((seller) => (
            <div 
              key={seller.id} 
              className="text-center"
            >
              {/* Avatar Container */}
              <div className="relative mb-4 flex justify-center">
                <div className="relative">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <Image
                      src={seller.avatar}
                      alt={seller.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Verified Tick */}
                  {seller.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Image
                        src="/Homepage/Tick.png"
                        alt="Verified"
                        width={12}
                        height={12}
                        className="w-3 h-3"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Name */}
              <h3 className="font-semibold text-sm mb-2" style={{color: colors.Text}}>
                {seller.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1">
                <Image
                  src="/Homepage/Star.svg"
                  alt="Star"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium" style={{color: colors.Text}}>
                  {seller.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VerifiedSeller
