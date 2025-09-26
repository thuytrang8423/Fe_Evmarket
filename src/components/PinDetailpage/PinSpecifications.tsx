"use client"
import React from 'react'
import { Battery as BatteryIcon, Zap, ThermometerSun, Shield } from 'lucide-react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'
import { Battery } from '../../services'

interface PinSpecificationsProps {
  battery: Battery
}

function PinSpecifications({ battery }: PinSpecificationsProps) {
  const { t } = useI18nContext()

  const specs = battery.specifications

  const specSections = [
    {
      title: "Electrical Specifications",
      icon: <Zap size={20} />,
      items: [
        { label: "Voltage", value: specs?.voltage || 'N/A' },
        { label: "Capacity", value: `${battery.capacity} kWh` },
        { label: "Chemistry", value: specs?.chemistry || 'N/A' },
        { label: "Charging Time", value: specs?.chargingTime || 'N/A' }
      ]
    },
    {
      title: "Physical Specifications",
      icon: <BatteryIcon size={20} />,
      items: [
        { label: "Weight", value: specs?.weight || 'N/A' },
        { label: "Installation", value: specs?.installation || 'N/A' },
        { label: "Degradation", value: specs?.degradation || 'N/A' },
        { label: "Health", value: `${battery.health}% SoH` }
      ]
    },
    {
      title: "Performance",
      icon: <ThermometerSun size={20} />,
      items: [
        { label: "Temperature Range", value: specs?.temperatureRange || 'N/A' },
        { label: "Battery Health", value: `${battery.health}%` },
        { label: "Year", value: battery.year.toString() },
        { label: "Status", value: battery.status }
      ]
    },
    {
      title: "Warranty & Safety",
      icon: <Shield size={20} />,
      items: [
        { label: "Warranty Period", value: specs?.warrantyPeriod || 'N/A' },
        { label: "Verified", value: battery.isVerified ? 'Yes' : 'No' },
        { label: "Brand", value: battery.brand },
        { label: "Created", value: new Date(battery.createdAt).toLocaleDateString() }
      ]
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6" style={{color: colors.Text}}>
          Technical Specifications
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

export default PinSpecifications
