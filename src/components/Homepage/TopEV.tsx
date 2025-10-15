"use client"
import React, { useEffect, useState } from 'react'
import colors from '../../Utils/Color'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useI18nContext } from '../../providers/I18nProvider'
import { getVehicles, type Vehicle } from '../../services'

export default function TopEV() {
  const { t } = useI18nContext()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const handleCarClick = (carId: string) => {
    router.push(`/vehicle/${carId}`)
  }

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await getVehicles()
        if (response.success && response.data?.vehicles) {
          // Take only first 4 vehicles for top deals
          setVehicles(response.data.vehicles.slice(0, 4))
        } else {
          setError(response.message || 'Failed to fetch vehicles')
        }
      } catch (err) {
        setError('Failed to fetch vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  if (loading) {
    return (
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold" style={{color: colors.Text}}>
              {t('homepage.topEV.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
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
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold" style={{color: colors.Text}}>
            {t('homepage.topEV.title')}
          </h2>
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300 cursor-pointer"
            onClick={() => router.push('/vehicles')}
          >
            {t('common.viewAll')}
          </button>
        </div>

        {/* EV Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => handleCarClick(vehicle.id)}
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Car Image */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Image
                    src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : '/Homepage/TopCar.png'}
                    alt={vehicle.title}
                    width={200}
                    height={120}
                    className="w-full h-full object-cover"
                    unoptimized={true}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/Homepage/TopCar.png';
                    }}
                  />
                </div>

                {/* Badges - Top Right (higher z-index to show above car) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-20">
                  {vehicle.isVerified && (
                    <div className="flex items-center">
                      <Image
                        src="/Verified.svg"
                        alt="Verified"
                        width={81}
                        height={20}
                        className="h-5 w-auto"
                        unoptimized={true}
                      />
                    </div>
                  )}
                  {vehicle.status === 'AVAILABLE' && (
                    <div className="flex items-center">
                      <Image
                        src="/Homepage/Sale.svg"
                        alt="Available"
                        width={89}
                        height={20}
                        className="h-5 w-auto"
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
                    title={vehicle.title}
                  >
                    {vehicle.title}
                  </h3>
                  <span className="text-lg font-bold whitespace-nowrap" style={{color: colors.PriceText}}>
                    ${vehicle.price.toLocaleString()}
                  </span>
                </div>

                {/* Year and Battery Capacity */}
                <p className="text-sm mb-3" style={{color: colors.Description}}>
                  {vehicle.year} • {vehicle.specifications?.batteryAndCharging?.batteryCapacity?.replace(' kWh', '') || Math.floor(Math.random() * (100 - 60) + 60)} kWh
                </p>

                {/* Bottom Row */}
                <div className="flex justify-between items-center">
                  {/* Battery Health with Pin (Mock Data since not in API) */}
                  <div className="flex items-center gap-1">
                    <Image
                      src="/Homepage/Pin.svg"
                      alt="Battery"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                      unoptimized={true}
                    />
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {Math.floor(Math.random() * (95 - 85) + 85)}% SoH
                    </span>
                  </div>

                  {/* Rating (Mock Data) */}
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
