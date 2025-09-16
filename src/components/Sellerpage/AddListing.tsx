"use client"
import React, { useState } from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

function AddListing() {
  const { t } = useI18nContext()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    
    // Location
    location: '',
    zipCode: '',
    
    // Vehicle Details
    bodyType: '',
    drivetrain: '',
    exteriorColor: '',
    interiorColor: '',
    
    // Battery & Performance
    batteryHealth: '',
    range: '',
    chargingType: '',
    
    // Description
    description: '',
    features: [],
    
    // Images
    images: []
  })

  const steps = [
    { id: 1, title: t('seller.addListing.steps.basicInfo') },
    { id: 2, title: t('seller.addListing.steps.details') },
    { id: 3, title: t('seller.addListing.steps.battery') },
    { id: 4, title: t('seller.addListing.steps.description') },
    { id: 5, title: t('seller.addListing.steps.photos') }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.listingTitle')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2020 Tesla Model 3 Long Range"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.price')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="$25,000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.make')}
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  style={{ borderColor: colors.Border }}
                >
                  <option value="">Select Make</option>
                  <option value="tesla">Tesla</option>
                  <option value="nissan">Nissan</option>
                  <option value="bmw">BMW</option>
                  <option value="audi">Audi</option>
                  <option value="volkswagen">Volkswagen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.model')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Model 3"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.year')}
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  style={{ borderColor: colors.Border }}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.mileage')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="45,000"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.location')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.bodyType')}
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.bodyType}
                  onChange={(e) => handleInputChange('bodyType', e.target.value)}
                  style={{ borderColor: colors.Border }}
                >
                  <option value="">Select Body Type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="coupe">Coupe</option>
                  <option value="wagon">Wagon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.exteriorColor')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pearl White"
                  value={formData.exteriorColor}
                  onChange={(e) => handleInputChange('exteriorColor', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.interiorColor')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Black"
                  value={formData.interiorColor}
                  onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.batteryHealth')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="85%"
                  value={formData.batteryHealth}
                  onChange={(e) => handleInputChange('batteryHealth', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.range')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="310 miles"
                  value={formData.range}
                  onChange={(e) => handleInputChange('range', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.chargingType')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Level 1', 'Level 2', 'DC Fast Charging', 'Tesla Supercharger'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm" style={{ color: colors.Text }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                {t('seller.addListing.fields.description')}
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your vehicle..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                style={{ borderColor: colors.Border }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                {t('seller.addListing.fields.features')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'Autopilot', 'Premium Interior', 'Glass Roof', 'Heated Seats',
                  'Premium Audio', 'Navigation', 'Parking Sensors', 'Backup Camera'
                ].map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm" style={{ color: colors.Text }}>{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{ borderColor: colors.Border }}>
              <svg className="w-12 h-12 mx-auto mb-4" style={{ color: colors.SubText }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-lg font-medium mb-2" style={{ color: colors.Text }}>
                {t('seller.addListing.fields.uploadPhotos')}
              </h3>
              <p className="text-sm mb-4" style={{ color: colors.SubText }}>
                {t('seller.addListing.fields.photosTip')}
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                {t('seller.addListing.fields.selectPhotos')}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: colors.Text }}>
          {t('seller.addListing.title')}
        </h2>
        <p className="text-sm mt-1" style={{ color: colors.SubText }}>
          {t('seller.addListing.subtitle')}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step.id <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.id}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`ml-4 w-12 h-0.5 ${
                  step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8" style={{ borderColor: colors.Border }}>
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2 border rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          style={{ 
            color: colors.Text,
            borderColor: colors.Border 
          }}
        >
          {t('seller.addListing.buttons.previous')}
        </button>

        <div className="flex items-center gap-3">
          <button
            className="px-6 py-2 border rounded-lg font-medium transition-colors duration-200 hover:bg-gray-50"
            style={{ 
              color: colors.Text,
              borderColor: colors.Border 
            }}
          >
            {t('seller.addListing.buttons.saveDraft')}
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              {t('seller.addListing.buttons.next')}
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
            >
              {t('seller.addListing.buttons.publish')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddListing
