"use client"
import React from 'react'
import CarDetailHero from './CarDetailHero'
import CarSpecifications from './CarSpecifications'
import CarDescription from './CarDescription'
import SellerInfo from './SellerInfo'

// Mock data for demonstration
const mockCarData = {
  id: 1,
  name: 'Tesla Model 3',
  year: '2023',
  price: '$45,000',
  images: [
    '/Homepage/TopCar.png',
    '/Homepage/TopCar.png',
    '/Homepage/TopCar.png',
    '/Homepage/TopCar.png'
  ],
  batteryCapacity: '75 kWh',
  range: '358 miles',
  condition: 'Excellent',
  year_badge: '2023',
  verified: true,
  fastSale: false,
  specifications: {
    performance: {
      topSpeed: '162 mph',
      acceleration: '3.1 seconds',
      motorType: 'Dual Motor AWD',
      horsepower: '450 hp'
    },
    battery: {
      capacity: '75 kWh',
      range: '358 miles',
      chargingSpeed: '250 kW',
      chargeTime: '27 minutes'
    },
    dimensions: {
      length: '184.8 in',
      width: '72.8 in',
      height: '56.8 in',
      curbWeight: '4,048 lbs'
    },
    warranty: {
      basic: '4 years / 50,000 miles',
      battery: '8 years / 120,000 miles',
      drivetrain: '8 years / 120,000 miles'
    }
  },
  description: "This 2023 Tesla Model 3 is in excellent condition with low mileage. It features the latest Autopilot hardware and software, premium interior with white seats, and has been meticulously maintained. The vehicle comes with all original documentation and has never been in an accident.",
  features: [
    "Autopilot with Full Self-Driving Capability",
    "Premium Interior with White Seats",
    "Glass Roof with UV Protection",
    "Tesla Mobile Connector",
    "Premium Audio System",
    "Heated Front and Rear Seats",
    "15\" Touchscreen Display",
    "Over-the-air Software Updates",
    "Supercharger Access",
    "Mobile App Connectivity"
  ],
  conditionDetails: {
    exterior: "Excellent - No visible scratches or dents. Paint is in perfect condition.",
    interior: "Like new - All surfaces clean and undamaged. Non-smoker vehicle.",
    mechanical: "Perfect working order - All systems functioning properly. Recently serviced.",
    battery: "96% State of Health - Excellent battery performance with minimal degradation."
  }
}

const mockSellerData = {
  name: 'John Smith',
  avatar: undefined,
  rating: 4.8,
  reviewCount: 14,
  verified: true,
  joinDate: 'March 2021',
  location: 'San Francisco, CA',
  activeListings: 3,
  responseTime: '2 hours',
  description: "I'm a Tesla enthusiast and have been buying and selling electric vehicles for over 3 years. I ensure all my vehicles are thoroughly inspected and come with complete maintenance records. I believe in honest descriptions and transparent transactions."
}

function CarDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <CarDetailHero car={mockCarData} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 bg-">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <CarDescription car={{
              description: mockCarData.description,
              features: mockCarData.features,
              condition: mockCarData.conditionDetails
            }} />
            <CarSpecifications car={mockCarData} />
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

export default CarDetailPage
