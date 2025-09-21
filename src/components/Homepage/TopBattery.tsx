"use client"
import React from 'react'
import colors from '../../Utils/Color'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useI18nContext } from '../../providers/I18nProvider'

function TopBattery() {
  const { t } = useI18nContext()
  const router = useRouter()
  
  const handleBatteryClick = (batteryId: number) => {
    router.push(`/pin/${batteryId}`)
  }
  
  const batteryListings = [
    {
      id: 1,
      name: 'Tesla PowerWall',
      year: '2021',
      capacity: '13.5 kWh',
      price: '$5,800',
      image: '/Homepage/Pin.png',
      verified: true,
      popular: false,
      rating: 4.9,
      batteryHealth: '96% SoH'
    },
    {
      id: 2,
      name: 'Leaf Battery Pack',
      year: '2019',
      capacity: '40 kWh',
      price: '$3,200',
      image: '/Homepage/Pin.png',
      verified: false,
      popular: true,
      rating: 4.5,
      batteryHealth: '87% SoH'
    },
    {
      id: 3,
      name: 'LG Chem RESU',
      year: '2020',
      capacity: '9.8 kWh',
      price: '$4,900',
      image: '/Homepage/Pin.png',
      verified: false,
      popular: true,
      rating: 4.8,
      batteryHealth: '92% SoH'
    },
    {
      id: 4,
      name: '18650 Cells (x100)',
      year: '2022',
      capacity: '3.7V 3000mAh',
      price: '$450',
      image: '/Homepage/Pin.png',
      verified: false,
      popular: true,
      rating: 4.7,
      batteryHealth: '98% SoH'
    }
  ]

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{color: colors.Text}}>
            {t('homepage.topBattery.title')}
          </h2>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
          >
            {t('common.viewAll')}
          </button>
        </div>

        {/* Battery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {batteryListings.map((battery) => (
            <div 
              key={battery.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-200"
              onClick={() => handleBatteryClick(battery.id)}
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-cyan-50">
                {/* Battery Image */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Image
                    src={battery.image}
                    alt={battery.name}
                    width={200}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badges - Top Right (higher z-index to show above battery) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-20">
                  {battery.verified && (
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
                  {battery.popular && (
                    <div className="flex items-center">
                      <Image
                        src="/Homepage/Popular.svg"
                        alt="Popular"
                        width={80}
                        height={24}
                        className="h-6 w-auto"
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
                    {battery.name}
                  </h3>
                  <span className="text-lg font-bold" style={{color: colors.PriceText}}>
                    {battery.price}
                  </span>
                </div>

                {/* Year and Capacity */}
                <p className="text-sm mb-3" style={{color: colors.Description}}>
                  {battery.year} • {battery.capacity}
                </p>

                {/* Bottom Row */}
                <div className="flex justify-between items-center">
                  {/* Battery Health with Pin */}
                  <div className="flex items-center gap-1">
                    <Image
                      src="/Homepage/Pin.svg"
                      alt="Pin"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {battery.batteryHealth}
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
                      {battery.rating}
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

export default TopBattery
