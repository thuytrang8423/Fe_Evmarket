"use client"
import React from 'react'
import { Battery, Zap, ThermometerSun, Shield } from 'lucide-react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface PinSpecificationsProps {
  pin: {
    specifications: {
      electrical: {
        nominalVoltage: string
        capacity: string
        energy: string
        maxDischarge: string
      }
      physical: {
        chemistry: string
        formFactor: string
        weight: string
        dimensions: string
      }
      performance: {
        cycleLife: string
        operatingTemp: string
        chargingTemp: string
        storageTemp: string
      }
      safety: {
        certifications: string[]
        protectionCircuit: string
        shortCircuit: string
        overcharge: string
      }
    }
  }
}

function PinSpecifications({ pin }: PinSpecificationsProps) {
  const { t } = useI18nContext()

  const specSections = [
    {
      title: "Electrical Specifications",
      icon: <Zap size={20} />,
      items: [
        { label: "Nominal Voltage", value: pin.specifications.electrical.nominalVoltage },
        { label: "Capacity", value: pin.specifications.electrical.capacity },
        { label: "Energy", value: pin.specifications.electrical.energy },
        { label: "Max Discharge Rate", value: pin.specifications.electrical.maxDischarge }
      ]
    },
    {
      title: "Physical Properties",
      icon: <Battery size={20} />,
      items: [
        { label: "Chemistry", value: pin.specifications.physical.chemistry },
        { label: "Form Factor", value: pin.specifications.physical.formFactor },
        { label: "Weight", value: pin.specifications.physical.weight },
        { label: "Dimensions", value: pin.specifications.physical.dimensions }
      ]
    },
    {
      title: "Performance",
      icon: <ThermometerSun size={20} />,
      items: [
        { label: "Cycle Life", value: pin.specifications.performance.cycleLife },
        { label: "Operating Temp", value: pin.specifications.performance.operatingTemp },
        { label: "Charging Temp", value: pin.specifications.performance.chargingTemp },
        { label: "Storage Temp", value: pin.specifications.performance.storageTemp }
      ]
    },
    {
      title: "Safety & Protection",
      icon: <Shield size={20} />,
      items: [
        { label: "Protection Circuit", value: pin.specifications.safety.protectionCircuit },
        { label: "Short Circuit", value: pin.specifications.safety.shortCircuit },
        { label: "Overcharge Protection", value: pin.specifications.safety.overcharge }
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

        {/* Certifications */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold mb-3" style={{color: colors.Text}}>
            Certifications & Standards
          </h4>
          <div className="flex flex-wrap gap-2">
            {pin.specifications.safety.certifications.map((cert, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinSpecifications
