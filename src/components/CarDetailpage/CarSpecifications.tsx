"use client"
import React from 'react'
import { Calendar, Gauge, Battery, Zap, MapPin, Shield } from 'lucide-react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface CarSpecificationsProps {
  car: {
    specifications: {
      performance: {
        topSpeed: string
        acceleration: string
        motorType: string
        horsepower: string
      }
      battery: {
        capacity: string
        range: string
        chargingSpeed: string
        chargeTime: string
      }
      dimensions: {
        length: string
        width: string
        height: string
        curbWeight: string
      }
      warranty: {
        basic: string
        battery: string
        drivetrain: string
      }
    }
  }
}

function CarSpecifications({ car }: CarSpecificationsProps) {
  const { t } = useI18nContext()

  const specSections = [
    {
      title: "Technical Specifications",
      icon: <Gauge size={20} />,
      content: "Performance",
      items: [
        { label: "Top Speed", value: car.specifications.performance.topSpeed },
        { label: "0-60 mph", value: car.specifications.performance.acceleration },
        { label: "Motor Type", value: car.specifications.performance.motorType },
        { label: "Horsepower", value: car.specifications.performance.horsepower }
      ]
    },
    {
      title: "Battery & Charging",
      icon: <Battery size={20} />,
      content: "Battery & Charging",
      items: [
        { label: "Battery Capacity", value: car.specifications.battery.capacity },
        { label: "Range (EPA)", value: car.specifications.battery.range },
        { label: "Charging Speed", value: car.specifications.battery.chargingSpeed },
        { label: "Charge Time (0-80%)", value: car.specifications.battery.chargeTime }
      ]
    },
    {
      title: "Dimensions",
      icon: <MapPin size={20} />,
      content: "Dimensions",
      items: [
        { label: "Length", value: car.specifications.dimensions.length },
        { label: "Width", value: car.specifications.dimensions.width },
        { label: "Height", value: car.specifications.dimensions.height },
        { label: "Curb Weight", value: car.specifications.dimensions.curbWeight }
      ]
    },
    {
      title: "Warranty",
      icon: <Shield size={20} />,
      content: "Warranty",
      items: [
        { label: "Basic Warranty", value: car.specifications.warranty.basic },
        { label: "Battery Warranty", value: car.specifications.warranty.battery },
        { label: "Drivetrain Warranty", value: car.specifications.warranty.drivetrain }
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
                  {section.content}
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
