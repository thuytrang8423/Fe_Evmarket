"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, Share2, Flag, Battery as BatteryIcon, Zap } from 'lucide-react'
import colors from '../../Utils/Color'
import VerifiedBadge from '../common/VerifiedBadge'
import { useI18nContext } from '../../providers/I18nProvider'

import { Battery } from '../../services'

interface PinDetailHeroProps {
  battery: Battery
}

function PinDetailHero({ battery }: PinDetailHeroProps) {
  const { t } = useI18nContext()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={battery.images[selectedImageIndex] || '/Homepage/Pin.png'}
                alt={battery.title}
                fill
                className="object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {battery.isVerified && (
                  <VerifiedBadge width={81} height={20} />
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 overflow-x-auto">
              {battery.images && battery.images.length > 0 ? battery.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index 
                      ? 'border-blue-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image || '/Homepage/Pin.png'}
                    alt={`${battery.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              )) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                  <BatteryIcon size={24} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{color: colors.Text}}>
                {battery.title} ({battery.year})
              </h1>
              <div className="text-4xl font-bold" style={{color: colors.PriceText}}>
                ${battery.price.toLocaleString()}
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <BatteryIcon size={20} className="text-blue-600" />
                </div>
                <div className="text-sm text-gray-600">{t('vehicleDetail.capacity')}</div>
                <div className="text-lg font-semibold" style={{color: colors.Text}}>
                  {battery.capacity} kWh
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Zap size={20} className="text-blue-600" />
                </div>
                <div className="text-sm text-gray-600">{t('vehicleDetail.voltage')}</div>
                <div className="text-lg font-semibold" style={{color: colors.Text}}>
                  {battery.specifications?.voltage || t('vehicleDetail.na')}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600">{t('vehicleDetail.health')}</div>
                <div className="text-lg font-semibold text-green-600">
                  {battery.health}% {t('vehicleDetail.soh')}
                </div>
              </div>
            </div>

            {/* Battery Type */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">{t('vehicleDetail.batteryType')}</div>
              <div className="text-lg font-semibold" style={{color: colors.Text}}>
                {battery.specifications?.chemistry || t('vehicleDetail.na')}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg">
                {t('vehicleDetail.buyNow')}
              </button>
              <button className="flex-1 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                {t('vehicleDetail.makeOffer')}
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 border-2 rounded-lg transition-all duration-200 ${
                  isWishlisted 
                    ? 'border-red-500 text-red-500 bg-red-50' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                {isWishlisted ? t('vehicleDetail.saved') : t('vehicleDetail.save')}
              </button>
              
              <button className="flex items-center justify-center gap-2 py-2 px-4 border-2 border-gray-300 text-gray-700 hover:border-gray-400 rounded-lg transition-all duration-200">
                <Share2 size={16} />
                {t('vehicleDetail.share')}
              </button>
              
              <button className="flex items-center justify-center gap-2 py-2 px-4 border-2 border-gray-300 text-gray-700 hover:border-gray-400 rounded-lg transition-all duration-200">
                <Flag size={16} />
                {t('vehicleDetail.report')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinDetailHero
