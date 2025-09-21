"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, Share2, Flag } from 'lucide-react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface CarDetailHeroProps {
  car: {
    id: number
    name: string
    year: string
    price: string
    images: string[]
    batteryCapacity: string
    range: string
    condition: string
    year_badge: string
    verified: boolean
    fastSale: boolean
  }
}

function CarDetailHero({ car }: CarDetailHeroProps) {
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
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src={car.images[selectedImageIndex]}
                alt={car.name}
                fill
                className="object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {car.verified && (
                  <Image
                    src="/Homepage/Verified.svg"
                    alt="Verified"
                    width={81}
                    height={20}
                    className="h-5 w-auto"
                  />
                )}
                {car.fastSale && (
                  <Image
                    src="/Homepage/Sale.svg"
                    alt="Fast Sale"
                    width={89}
                    height={20}
                    className="h-5 w-auto"
                  />
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 overflow-x-auto">
              {car.images.map((image, index) => (
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
                    src={image}
                    alt={`${car.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{color: colors.Text}}>
                {car.name} {car.year}
              </h1>
              <div className="text-4xl font-bold" style={{color: colors.PriceText}}>
                {car.price}
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Battery Capacity</div>
                <div className="text-lg font-semibold" style={{color: colors.Text}}>
                  {car.batteryCapacity}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Range</div>
                <div className="text-lg font-semibold" style={{color: colors.Text}}>
                  {car.range}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Condition</div>
                <div className="text-lg font-semibold" style={{color: colors.Text}}>
                  {car.condition}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Contact Seller
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Make Offer
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
                {isWishlisted ? 'Saved' : 'Save'}
              </button>
              
              <button className="flex items-center justify-center gap-2 py-2 px-4 border-2 border-gray-300 text-gray-700 hover:border-gray-400 rounded-lg transition-all duration-200">
                <Share2 size={16} />
                Share
              </button>
              
              <button className="flex items-center justify-center gap-2 py-2 px-4 border-2 border-gray-300 text-gray-700 hover:border-gray-400 rounded-lg transition-all duration-200">
                <Flag size={16} />
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailHero
