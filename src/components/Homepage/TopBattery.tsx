"use client"
import React, { useEffect, useState } from 'react'
import colors from '../../Utils/Color'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useI18nContext } from '../../providers/I18nProvider'
import { getBatteries, type Battery } from '../../services/Battery'

function TopBattery() {
  const { t } = useI18nContext()
  const router = useRouter()
  const [batteries, setBatteries] = useState<Battery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const handleBatteryClick = (batteryId: string) => {
    router.push(`/pin/${batteryId}`)
  }

  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        const response = await getBatteries()
        if (response.success && response.data?.batteries) {
          // Take only first 4 batteries for top deals
          setBatteries(response.data.batteries.slice(0, 4))
        } else {
          setError(response.message || 'Failed to fetch batteries')
        }
      } catch (err) {
        setError('Failed to fetch batteries')
      } finally {
        setLoading(false)
      }
    }

    fetchBatteries()
  }, [])

  if (loading) {
    return (
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold" style={{color: colors.Text}}>
              {t('homepage.topBattery.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-200">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{color: colors.Text}}>
            {t('homepage.topBattery.title')}
          </h2>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 cursor-pointer"
            onClick={() => router.push('/batteries')}
          >
            {t('common.viewAll')}
          </button>
        </div>

        {/* Battery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {batteries.map((battery) => (
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
                    src={battery.images && battery.images.length > 0 ? battery.images[0] : '/Homepage/Pin.png'}
                    alt={battery.title}
                    width={200}
                    height={120}
                    className="w-full h-full object-cover"
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/Homepage/Pin.png';
                    }}
                  />
                </div>

                {/* Badges - Top Right (higher z-index to show above battery) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-20">
                  {battery.isVerified && (
                    <div className="flex items-center">
                      <Image
                        src="/Homepage/Verified.svg"
                        alt="Verified"
                        width={81}
                        height={20}
                        className="h-5 w-auto"
                        unoptimized={true}
                      />
                    </div>
                  )}
                  {battery.status === 'AVAILABLE' && (
                    <div className="flex items-center">
                      <Image
                        src="/Homepage/Popular.svg"
                        alt="Popular"
                        width={80}
                        height={24}
                        className="h-6 w-auto"
                        unoptimized={true}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Name and Price */}
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    className="font-semibold text-lg truncate pr-2 max-w-[180px]" 
                    style={{color: colors.Text}}
                    title={battery.title}
                  >
                    {battery.title}
                  </h3>
                  <span className="text-lg font-bold whitespace-nowrap" style={{color: colors.PriceText}}>
                    ${battery.price.toLocaleString()}
                  </span>
                </div>

                {/* Year and Capacity */}
                <p className="text-sm mb-3" style={{color: colors.Description}}>
                  {battery.year} • {battery.capacity} kWh
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
                      unoptimized={true}
                    />
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {battery.health}% SoH
                    </span>
                  </div>

                  {/* Rating (Mock Data since not in API) */}
                  <div className="flex items-center gap-1">
                    <Image
                      src="/Homepage/Star.svg"
                      alt="Star"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                      unoptimized={true}
                    />
                    <span className="text-sm font-medium" style={{color: colors.Text}}>
                      {(Math.random() * (5 - 4) + 4).toFixed(1)}
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