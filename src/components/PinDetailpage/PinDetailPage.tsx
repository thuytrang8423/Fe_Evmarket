"use client"
import React from 'react'
import PinDetailHero from './PinDetailHero'
import PinSpecifications from './PinSpecifications'
import SellerInfo from '../CarDetailpage/SellerInfo'

// Mock data for demonstration
const mockPinData = {
  id: 1,
  name: 'Tesla PowerWall',
  year: '2021',
  price: '$5,800',
  images: [
    '/Homepage/Pin.png',
    '/Homepage/Pin.png',
    '/Homepage/Pin.png',
    '/Homepage/Pin.png'
  ],
  capacity: '13.5 kWh',
  voltage: '24V',
  batteryHealth: '96% SoH',
  type: 'Lithium Iron Phosphate (LiFePO4)',
  verified: true,
  popular: false,
  specifications: {
    electrical: {
      nominalVoltage: '24V',
      capacity: '13.5 kWh',
      energy: '13,500 Wh',
      maxDischarge: '5kW Continuous'
    },
    physical: {
      chemistry: 'Lithium Iron Phosphate (LiFePO4)',
      formFactor: 'Wall-mounted',
      weight: '114 kg (251 lbs)',
      dimensions: '1150 x 755 x 155 mm'
    },
    performance: {
      cycleLife: '6,000+ cycles',
      operatingTemp: '-20°C to +50°C',
      chargingTemp: '0°C to +45°C',
      storageTemp: '-20°C to +25°C'
    },
    safety: {
      certifications: ['UL 1973', 'UL 991', 'FCC Part 15', 'IEEE 1547'],
      protectionCircuit: 'Built-in BMS',
      shortCircuit: 'Yes',
      overcharge: 'Yes'
    }
  }
}

const mockSellerData = {
  name: 'EV Battery Solutions',
  avatar: undefined,
  rating: 4.9,
  reviewCount: 28,
  verified: true,
  joinDate: 'January 2020',
  location: 'Austin, TX',
  activeListings: 15,
  responseTime: '1 hour',
  description: "We specialize in high-quality battery solutions for electric vehicles and energy storage systems. All our batteries are tested and certified to meet industry standards. We provide comprehensive technical support and warranty coverage."
}

function PinDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <PinDetailHero pin={mockPinData} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <PinSpecifications pin={mockPinData} />
          </div>
          
          {/* Right Column - Seller Info */}
          <div className="lg:col-span-1">
            <SellerInfo seller={mockSellerData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PinDetailPage
