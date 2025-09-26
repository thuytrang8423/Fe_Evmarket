"use client"
import React from 'react'
import { Calendar, Gauge, Battery, Zap, MapPin, Shield } from 'lucide-react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

import { Vehicle } from '../../services'

interface CarSpecificationsProps {
  vehicle: Vehicle
}

function CarSpecifications({ vehicle }: CarSpecificationsProps) {
  const { t } = useI18nContext()

  const specs = vehicle.specifications

  const specSections = [
    {
      title: "Performance",
      icon: <Gauge size={20} />,
      items: [
        { label: "Top Speed", value: specs?.performance?.topSpeed || 'N/A' },
        { label: "0-60 mph", value: specs?.performance?.acceleration || 'N/A' },
        { label: "Motor Type", value: specs?.performance?.motorType || 'N/A' },
        { label: "Horsepower", value: specs?.performance?.horsepower || 'N/A' }
      ]
    },
    {
      title: "Battery & Charging",
      icon: <Battery size={20} />,
      items: [
        { label: "Battery Capacity", value: specs?.batteryAndCharging?.batteryCapacity || 'N/A' },
        { label: "Range", value: specs?.batteryAndCharging?.range || 'N/A' },
        { label: "Charging Speed", value: specs?.batteryAndCharging?.chargingSpeed || 'N/A' },
        { label: "Charge Time", value: specs?.batteryAndCharging?.chargeTime || 'N/A' }
      ]
    },
    {
      title: "Dimensions",
      icon: <MapPin size={20} />,
      items: [
        { label: "Length", value: specs?.dimensions?.length || 'N/A' },
        { label: "Width", value: specs?.dimensions?.width || 'N/A' },
        { label: "Height", value: specs?.dimensions?.height || 'N/A' },
        { label: "Curb Weight", value: specs?.dimensions?.curbWeight || 'N/A' }
      ]
    },
    {
      title: "Warranty",
      icon: <Shield size={20} />,
      items: [
        { label: "Basic Warranty", value: specs?.warranty?.basic || 'N/A' },
        { label: "Battery Warranty", value: specs?.warranty?.battery || 'N/A' },
        { label: "Drivetrain Warranty", value: specs?.warranty?.drivetrain || 'N/A' }
      ]
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6" style={{color: colors.Text}}>
          Specifications
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-blue-600">{section.icon}</div>
                <h4 className="font-semibold" style={{color: colors.Text}}>
                  {section.title}
                </h4>
              </div>
              
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center">
                    <span className="text-sm" style={{color: colors.SubText}}>
                      {item.label}
                    </span>
                    <span className="font-medium" style={{color: colors.Text}}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CarSpecifications
