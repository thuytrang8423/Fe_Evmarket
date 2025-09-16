"use client"
import React from 'react'
import colors from '../../Utils/Color'
import Image from 'next/image'
import { useI18nContext } from '../../providers/I18nProvider'

function TopEV() {
  const { t } = useI18nContext()
  
  const evDeals = [
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
      sellPercentage: '92% Soft'
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
      sellPercentage: '85% SoH'
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
      sellPercentage: '94% Soft'
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
      sellPercentage: '88% SoH'
    }
  ]

  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{color: colors.Text}}>
            {t('homepage.topEV.title')}
          </h2>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
          >
            {t('common.viewAll')}
          </button>
        </div>

        {/* EV Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {evDeals.map((ev) => (
            <div 
              key={ev.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Car Image */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Image
                    src={ev.image}
                    alt={ev.name}
                    width={200}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badges - Top Right (higher z-index to show above car) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-20">
                  {ev.verified && (
                    <div className="flex items-center">
                      <Image
                        src="/HomePage/Verified.svg"
                        alt="Verified"
                        width={81}
                        height={20}
                        className="h-5 w-auto"
                      />
                    </div>
                  )}
                  {ev.fastSale && (
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
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Name and Price */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg" style={{color: colors.Text}}>
                    {ev.name}
                  </h3>
                  <span className="text-lg font-bold" style={{color: colors.PriceText}}>
                    {ev.price}
                  </span>
                </div>

                {/* Year and Mileage */}
                <p className="text-sm mb-3" style={{color: colors.Description}}>
                  {ev.year} • {ev.mileage}
                </p>

                {/* Bottom Row */}
                <div className="flex justify-between items-center">
                  {/* Sell Percentage with Pin */}
                  <div className="flex items-center gap-1">
                    <Image
                      src="/Homepage/Pin.svg"
                      alt="Pin"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {ev.sellPercentage}
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
                      {ev.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopEV
