"use client"
import React from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface CarDescriptionProps {
  car: {
    description: string
    features: string[]
    condition: {
      exterior: string
      interior: string
      mechanical: string
      battery: string
    }
  }
}

function CarDescription({ car }: CarDescriptionProps) {
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
            {car.description}
          </p>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h4 className="font-semibold mb-4" style={{color: colors.Text}}>
            Features & Equipment
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {car.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm" style={{color: colors.SubText}}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <h4 className="font-semibold mb-4" style={{color: colors.Text}}>
            Vehicle Condition
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2" style={{color: colors.Text}}>
                Exterior
              </div>
              <div className="text-sm" style={{color: colors.SubText}}>
                {car.condition.exterior}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2" style={{color: colors.Text}}>
                Interior
              </div>
              <div className="text-sm" style={{color: colors.SubText}}>
                {car.condition.interior}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2" style={{color: colors.Text}}>
                Mechanical
              </div>
              <div className="text-sm" style={{color: colors.SubText}}>
                {car.condition.mechanical}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2" style={{color: colors.Text}}>
                Battery Health
              </div>
              <div className="text-sm" style={{color: colors.SubText}}>
                {car.condition.battery}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDescription
