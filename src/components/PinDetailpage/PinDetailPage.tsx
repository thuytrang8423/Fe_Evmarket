"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getBatteryById, type Battery } from '../../services'
import PinDetailHero from './PinDetailHero'
import PinSpecifications from './PinSpecifications'
import SellerInfo from '../CarDetailpage/SellerInfo'

function PinDetailPage() {
  const params = useParams()
  const [battery, setBattery] = useState<Battery | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBattery = async () => {
      try {
        const batteryId = params.id as string
        const response = await getBatteryById(batteryId)
        
        if (response.success && response.data) {
          // Handle both possible response structures
          const batteryData = (response.data as any).battery || response.data
          setBattery(batteryData as Battery)
        } else {
          setError(response.message || 'Failed to fetch battery details')
        }
      } catch (err) {
        setError('Failed to fetch battery details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBattery()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading battery details...</p>
        </div>
      </div>
    )
  }

  if (error || !battery) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Battery not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Create a mock vehicle object for SellerInfo compatibility
  const mockVehicleForSeller = {
    id: battery.id,
    title: battery.title,
    description: battery.description,
    price: battery.price,
    images: battery.images,
    status: battery.status,
    brand: battery.brand,
    model: '',
    year: battery.year,
    mileage: 0,
    specifications: {
      warranty: {
        basic: '',
        battery: '',
        drivetrain: ''
      },
      dimensions: {
        width: '',
        height: '',
        length: '',
        curbWeight: ''
      },
      performance: {
        topSpeed: '',
        motorType: '',
        horsepower: '',
        acceleration: ''
      },
      batteryAndCharging: {
        range: '',
        chargeTime: '',
        chargingSpeed: '',
        batteryCapacity: ''
      }
    },
    isAuction: false,
    auctionEndsAt: null,
    startingPrice: null,
    bidIncrement: null,
    depositAmount: null,
    isVerified: battery.isVerified,
    createdAt: battery.createdAt,
    updatedAt: battery.updatedAt,
    sellerId: battery.sellerId,
    seller: {
      id: battery.sellerId,
      name: 'EVMarket Battery Seller',
      avatar: ''
    }
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PinDetailHero battery={battery} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <PinSpecifications battery={battery} />
          </div>
          
          {/* Right Column - Seller Info */}
          <div className="lg:col-span-1">
            <SellerInfo vehicle={mockVehicleForSeller} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinDetailPage
