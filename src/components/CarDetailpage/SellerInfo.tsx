"use client"
import React from 'react'
import Image from 'next/image'
import { Star, Shield, MessageCircle } from 'lucide-react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface SellerInfoProps {
  seller: {
    name: string
    avatar?: string
    rating: number
    reviewCount: number
    verified: boolean
    joinDate: string
    location: string
    activeListings: number
    responseTime: string
    description: string
  }
}

function SellerInfo({ seller }: SellerInfoProps) {
  const { t } = useI18nContext()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6" style={{color: colors.Text}}>
          Seller Information
        </h3>

        {/* Seller Profile */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
              {seller.avatar ? (
                <Image
                  src={seller.avatar}
                  alt={seller.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
                  <span className="text-white text-xl font-bold">
                    {seller.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {seller.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Shield size={12} className="text-white" />
              </div>
            )}
          </div>

          {/* Seller Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-lg" style={{color: colors.Text}}>
                {seller.name}
              </h4>
              {seller.verified && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="font-medium" style={{color: colors.Text}}>
                  {seller.rating}
                </span>
              </div>
              <span className="text-sm" style={{color: colors.SubText}}>
                ({seller.reviewCount} reviews)
              </span>
            </div>

            <div className="space-y-1 text-sm" style={{color: colors.SubText}}>
              <p>📍 {seller.location}</p>
              <p>📅 Member since {seller.joinDate}</p>
              <p>🚗 {seller.activeListings} active listings</p>
              <p>⚡ Usually responds in {seller.responseTime}</p>
            </div>
          </div>
        </div>

        {/* Seller Description */}
        <div className="mb-6">
          <p className="text-sm leading-relaxed" style={{color: colors.SubText}}>
            {seller.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <MessageCircle size={16} />
            Contact Seller
          </button>
          
          <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
            View All Listings
          </button>
        </div>
      </div>
    </div>
  )
}

export default SellerInfo
