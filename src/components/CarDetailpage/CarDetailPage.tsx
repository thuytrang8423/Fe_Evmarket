"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getVehicleById, type Vehicle, type VehicleResponse } from '../../services'
import CarDetailHero from './CarDetailHero'
import CarDetailTabs from './CarDetailTabs'
import SellerInfo from './SellerInfo'
import colors from '../../Utils/Color'

function CarDetailPage() {
  const params = useParams()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const vehicleId = params.id as string
        const response = await getVehicleById(vehicleId)
        
        if (response.success && response.data) {
          // Handle both possible response structures
          const vehicleData = (response.data as any).vehicle || response.data
          setVehicle(vehicleData as Vehicle)
        } else {
          setError(response.message || 'Failed to fetch vehicle details')
        }
      } catch (err) {
        setError('Failed to fetch vehicle details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchVehicle()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Vehicle not found'}</p>
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <CarDetailHero vehicle={vehicle} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <CarDetailTabs vehicle={vehicle} />
          </div>
          
          {/* Right Column - Seller Info */}
          <div className="lg:col-span-1">
            <SellerInfo vehicle={vehicle} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailPage
