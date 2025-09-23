"use client"
import React, { useState } from 'react'
import { Vehicle } from '../../services'
import CarDescription from './CarDescription'
import CarSpecifications from './CarSpecifications'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface CarDetailTabsProps {
  vehicle: Vehicle
}

function CarDetailTabs({ vehicle }: CarDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications'>('description')
  const { t } = useI18nContext()

  // Function to get localized status
  const getLocalizedStatus = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return t('vehicleDetail.available')
      case 'SOLD':
        return t('vehicleDetail.sold')
      case 'DELISTED':
        return t('vehicleDetail.delisted')
      default:
        return status
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'description'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('vehicleDetail.description')}
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === 'specifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('vehicleDetail.specifications')}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div>
            {/* Description Content - Extract from CarDescription */}
            <h3 className="text-xl font-bold mb-6" style={{color: colors.Text}}>
              {t('vehicleDetail.vehicleDescription')}
            </h3>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{color: colors.SubText}}>
                      {t('vehicleDetail.brand')}
                    </span>
                    <span className="font-semibold" style={{color: colors.Text}}>
                      {vehicle.brand}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{color: colors.SubText}}>
                      {t('vehicleDetail.model')}
                    </span>
                    <span className="font-semibold" style={{color: colors.Text}}>
                      {vehicle.model}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{color: colors.SubText}}>
                      {t('vehicleDetail.year')}
                    </span>
                    <span className="font-semibold" style={{color: colors.Text}}>
                      {vehicle.year}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{color: colors.SubText}}>
                      {t('vehicleDetail.mileage')}
                    </span>
                    <span className="font-semibold" style={{color: colors.Text}}>
                      {vehicle.mileage.toLocaleString()} km
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{color: colors.SubText}}>
                      {t('vehicleDetail.status')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.status === 'AVAILABLE' 
                        ? 'bg-green-100 text-green-700'
                        : vehicle.status === 'SOLD'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {getLocalizedStatus(vehicle.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" style={{color: colors.SubText}}>
                      {t('vehicleDetail.verified')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      vehicle.isVerified 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {vehicle.isVerified ? t('vehicleDetail.verified') : t('vehicleDetail.notVerified')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Text */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-semibold mb-3" style={{color: colors.Text}}>
                  {t('vehicleDetail.aboutThisVehicle')}
                </h4>
                <p className="text-sm leading-relaxed" style={{color: colors.SubText}}>
                  {vehicle.description || t('vehicleDetail.noDescription')}
                </p>
              </div>

              {/* Dates */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs" style={{color: colors.SubText}}>
                      {t('vehicleDetail.listedOn')}
                    </span>
                    <p className="font-medium" style={{color: colors.Text}}>
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs" style={{color: colors.SubText}}>
                      {t('vehicleDetail.lastUpdated')}
                    </span>
                    <p className="font-medium" style={{color: colors.Text}}>
                      {new Date(vehicle.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div>
            {/* Specifications Content - Extract from CarSpecifications */}
            <h3 className="text-xl font-bold mb-6" style={{color: colors.Text}}>
              {t('vehicleDetail.specifications')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                      <path d="M12 2v2"/>
                      <path d="M12 20v2"/>
                      <path d="m4.93 4.93 1.41 1.41"/>
                      <path d="m17.66 17.66 1.41 1.41"/>
                      <path d="M2 12h2"/>
                      <path d="M20 12h2"/>
                      <path d="m6.34 17.66-1.41 1.41"/>
                      <path d="m19.07 4.93-1.41 1.41"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold" style={{color: colors.Text}}>
                    {t('vehicleDetail.performance')}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.topSpeed')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.performance?.topSpeed || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.acceleration')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.performance?.acceleration || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.motorType')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.performance?.motorType || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.horsepower')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.performance?.horsepower || t('vehicleDetail.na')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Battery & Charging */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="16" height="10" x="2" y="7" rx="2" ry="2"/>
                      <line x1="22" x2="22" y1="11" y2="13"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold" style={{color: colors.Text}}>
                    {t('vehicleDetail.batteryCharging')}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.batteryCapacity')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.batteryAndCharging?.batteryCapacity || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.range')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.batteryAndCharging?.range || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.chargingSpeed')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.batteryAndCharging?.chargingSpeed || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.chargeTime')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.batteryAndCharging?.chargeTime || t('vehicleDetail.na')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold" style={{color: colors.Text}}>
                    {t('vehicleDetail.dimensions')}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.length')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.dimensions?.length || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.width')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.dimensions?.width || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.height')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.dimensions?.height || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.curbWeight')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.dimensions?.curbWeight || t('vehicleDetail.na')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warranty */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <h4 className="font-semibold" style={{color: colors.Text}}>
                    {t('vehicleDetail.warranty')}
                  </h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.basicWarranty')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.warranty?.basic || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.batteryWarranty')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.warranty?.battery || t('vehicleDetail.na')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {t('vehicleDetail.drivetrainWarranty')}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {vehicle.specifications?.warranty?.drivetrain || t('vehicleDetail.na')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarDetailTabs
