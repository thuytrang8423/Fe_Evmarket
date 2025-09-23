"use client"
import React from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

import { Vehicle } from '../../services'

interface CarDescriptionProps {
  vehicle: Vehicle
}

function CarDescription({ vehicle }: CarDescriptionProps) {
  const { t } = useI18nContext()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6" style={{color: colors.Text}}>
          Description
        </h3>

        {/* Main Description */}
        <div className="mb-8">
          <p className="text-base leading-relaxed" style={{color: colors.SubText}}>
            {vehicle.description || 'No description available.'}
          </p>
        </div>

        {/* Vehicle Details */}
        <div className="mb-8">
          <h4 className="font-semibold mb-4" style={{color: colors.Text}}>
            Vehicle Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium" style={{color: colors.Text}}>Brand</span>
              <span className="text-sm" style={{color: colors.SubText}}>{vehicle.brand}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium" style={{color: colors.Text}}>Model</span>
              <span className="text-sm" style={{color: colors.SubText}}>{vehicle.model}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium" style={{color: colors.Text}}>Year</span>
              <span className="text-sm" style={{color: colors.SubText}}>{vehicle.year}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium" style={{color: colors.Text}}>Mileage</span>
              <span className="text-sm" style={{color: colors.SubText}}>{vehicle.mileage.toLocaleString()} miles</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium" style={{color: colors.Text}}>Status</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                vehicle.status === 'SOLD' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {vehicle.status}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium" style={{color: colors.Text}}>Verified</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                vehicle.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {vehicle.isVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Listing Information */}
        <div>
          <h4 className="font-semibold mb-4" style={{color: colors.Text}}>
            Listing Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2" style={{color: colors.Text}}>
                Listed Date
              </div>
              <div className="text-sm" style={{color: colors.SubText}}>
                {new Date(vehicle.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2" style={{color: colors.Text}}>
                Last Updated
              </div>
              <div className="text-sm" style={{color: colors.SubText}}>
                {new Date(vehicle.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDescription
