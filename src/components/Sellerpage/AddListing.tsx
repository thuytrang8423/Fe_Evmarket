"use client"
import React, { useState } from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'
import { createBattery, type CreateBatteryRequest } from '../../services/Battery'
import { createVehicle, type CreateVehicleRequest } from '../../services/Vehicle'
import { useToast } from '../../hooks/useToast'
import { ToastContainer } from '../common/Toast'

function AddListing() {
  const { t } = useI18nContext()
  const { toasts, success, error: showError, removeToast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [listingType, setListingType] = useState<'vehicle' | 'battery'>('vehicle')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const inputClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
  const selectClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
  const textareaClass = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
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
    batteryCapacity: '',
    chargingType: '',
    
    // Description
    description: '',
    features: [],
    
    // Images
    images: [],

    // Battery-only specifications
    spec_weight: '',
    spec_voltage: '',
    spec_chemistry: '',
    spec_degradation: '',
    spec_chargingTime: '',
    spec_installation: '',
    spec_warrantyPeriod: '',
    spec_temperatureRange: ''
  })

  const steps = listingType === 'vehicle'
    ? [
        { id: 1, title: t('seller.addListing.steps.basicInfo') },
        { id: 2, title: t('seller.addListing.steps.details') },
        { id: 3, title: t('seller.addListing.steps.battery') },
        { id: 4, title: t('seller.addListing.fields.uploadPhotos') },
        { id: 5, title: t('seller.addListing.steps.reviewSubmit') }
      ]
    : [
        { id: 1, title: t('seller.addListing.steps.basicInfo') },
        { id: 2, title: t('seller.addListing.steps.batteryDetails') },
        { id: 3, title: t('seller.addListing.steps.specifications') },
        { id: 4, title: t('seller.addListing.fields.uploadPhotos') },
        { id: 5, title: t('seller.addListing.steps.reviewSubmit') }
      ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const openFilePicker = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = () => {
      const files = Array.from(input.files || [])
      handleNewFiles(files)
    }
    input.click()
  }

  const handleNewFiles = (files: File[]) => {
    if (!files.length) return
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setUploadedImages(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...newPreviews])
    setError(null)
    // Remove old success message and show toast instead
    setUploadSuccess(null)
    success(t('toast.imageUploadSuccess', `Uploaded ${files.length} image${files.length > 1 ? 's' : ''} successfully!`))
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'))
    handleNewFiles(files)
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    success(t('toast.imageRemoveSuccess', 'Image removed successfully!'))
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
                  className={inputClass}
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
                  className={inputClass}
                  placeholder="$25,000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {listingType === 'vehicle' ? t('seller.addListing.fields.make') : 'Brand'}
                </label>
                {listingType === 'vehicle' ? (
                  <select
                    className={selectClass}
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
                ) : (
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g., CATL, BYD, LG"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    style={{ borderColor: colors.Border }}
                  />
                )}
              </div>

              {listingType === 'vehicle' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.model')}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Model 3"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.year')}
                </label>
                <select
                  className={selectClass}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  style={{ borderColor: colors.Border }}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {listingType === 'vehicle' && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.mileage')}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="45,000"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>
              )}
            </div>
          </div>
        )

      case 2:
        if (listingType === 'vehicle') return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.location')}
                </label>
                <input
                  type="text"
                  className={inputClass}
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
                  className={selectClass}
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
                  className={inputClass}
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
                  className={inputClass}
                  placeholder="Black"
                  value={formData.interiorColor}
                  onChange={(e) => handleInputChange('interiorColor', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>
            </div>
          </div>
        )
        // Battery step 2: Battery Details
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  Capacity (kWh)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="75"
                  value={formData.batteryCapacity}
                  onChange={(e) => handleInputChange('batteryCapacity', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.batteryHealth')}
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="90"
                  value={formData.batteryHealth}
                  onChange={(e) => handleInputChange('batteryHealth', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        if (listingType === 'vehicle') return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                  {t('seller.addListing.fields.batteryHealth')}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="85%"
                  value={formData.batteryHealth}
                  onChange={(e) => handleInputChange('batteryHealth', e.target.value)}
                  style={{ borderColor: colors.Border }}
                />
              </div>

              {listingType === 'vehicle' ? (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                    {t('seller.addListing.fields.range')}
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="310 miles"
                    value={formData.range}
                    onChange={(e) => handleInputChange('range', e.target.value)}
                    style={{ borderColor: colors.Border }}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>
                    Battery Capacity (kWh)
                  </label>
                  <input
                    type="number"
                    className={inputClass}
                    placeholder="75"
                    value={formData.batteryCapacity}
                    onChange={(e) => handleInputChange('batteryCapacity', e.target.value)}
                    style={{ borderColor: colors.Border }}
                  />
                </div>
              )}

              {listingType === 'vehicle' && (
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
              )}
            </div>
          </div>
        )
        // Battery step 3: Specifications
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>{t('seller.addListing.batterySpecs.weight')}</label>
                <input type="text" className={inputClass} placeholder="e.g., 528kg" value={formData.spec_weight} onChange={(e) => handleInputChange('spec_weight', e.target.value)} style={{ borderColor: colors.Border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>{t('seller.addListing.batterySpecs.voltage')}</label>
                <input type="text" className={inputClass} placeholder="e.g., 408V" value={formData.spec_voltage} onChange={(e) => handleInputChange('spec_voltage', e.target.value)} style={{ borderColor: colors.Border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>{t('seller.addListing.batterySpecs.chemistry')}</label>
                <input type="text" className={inputClass} placeholder="e.g., NMC" value={formData.spec_chemistry} onChange={(e) => handleInputChange('spec_chemistry', e.target.value)} style={{ borderColor: colors.Border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>{t('seller.addListing.batterySpecs.degradation')}</label>
                <input type="text" className={inputClass} placeholder="e.g., 27%" value={formData.spec_degradation} onChange={(e) => handleInputChange('spec_degradation', e.target.value)} style={{ borderColor: colors.Border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>{t('seller.addListing.batterySpecs.chargingTime')}</label>
                <input type="text" className={inputClass} placeholder="e.g., 30-80% in 35 min" value={formData.spec_chargingTime} onChange={(e) => handleInputChange('spec_chargingTime', e.target.value)} style={{ borderColor: colors.Border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>{t('seller.addListing.batterySpecs.installation')}</label>
                <input type="text" className={inputClass} placeholder="e.g., Professional required" value={formData.spec_installation} onChange={(e) => handleInputChange('spec_installation', e.target.value)} style={{ borderColor: colors.Border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>{t('seller.addListing.batterySpecs.warrantyPeriod')}</label>
                <input type="text" className={inputClass} placeholder="e.g., 4 years" value={formData.spec_warrantyPeriod} onChange={(e) => handleInputChange('spec_warrantyPeriod', e.target.value)} style={{ borderColor: colors.Border }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>{t('seller.addListing.batterySpecs.temperatureRange')}</label>
                <input type="text" className={inputClass} placeholder="e.g., -20°C to 60°C" value={formData.spec_temperatureRange} onChange={(e) => handleInputChange('spec_temperatureRange', e.target.value)} style={{ borderColor: colors.Border }} />
              </div>
            </div>
          </div>
        )

      case 4:
        // Upload Photos & Review Images
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center" style={{ color: colors.Text }}>{t('seller.addListing.fields.uploadPhotos')}</h3>
            {/* If no images yet, show a single centered add tile */}
            {imagePreviews.length === 0 ? (
              <div className="flex justify-center">
                <div
                  onClick={openFilePicker}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="w-44 h-44 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
                  style={{ borderColor: colors.Border }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-1 text-blue-600">
                    <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs" style={{ color: colors.SubText }}>{t('seller.addListing.fields.clickOrDrag')}</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-center">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border group w-44 h-44" style={{ borderColor: colors.Border }}>
                      <img
                        src={src}
                        alt={`upload-${idx}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {/* Add tile appended after existing images */}
                  <div
                    onClick={openFilePicker}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="w-44 h-44 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
                    style={{ borderColor: colors.Border }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-1 text-blue-600">
                      <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs" style={{ color: colors.SubText }}>{t('seller.addListing.fields.clickOrDrag')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      case 5:
        // Final Review & Submit (no uploader here)
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold" style={{ color: colors.Text }}>Review</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base text-black">
              <div>
                <p><span className="font-semibold">Title:</span> {formData.title || '-'}</p>
                <p><span className="font-semibold">Price:</span> {formData.price || '-'}</p>
                <p><span className="font-semibold">Year:</span> {formData.year || '-'}</p>
                <p><span className="font-semibold">Type:</span> {listingType}</p>
              </div>
              <div>
                {listingType === 'vehicle' ? (
                  <>
                    <p><span className="font-semibold">Make:</span> {formData.make || '-'}</p>
                    <p><span className="font-semibold">Model:</span> {formData.model || '-'}</p>
                    <p><span className="font-semibold">Mileage:</span> {formData.mileage || '-'}</p>
                    <p><span className="font-semibold">Range:</span> {formData.range || '-'}</p>
                  </>
                ) : (
                  <>
                    <p><span className="font-semibold">Brand:</span> {formData.make || '-'}</p>
                    <p><span className="font-semibold">Capacity:</span> {formData.batteryCapacity || '-'} kWh</p>
                    <p><span className="font-semibold">Health:</span> {formData.batteryHealth || '-'}%</p>
                    <p><span className="font-semibold">Chemistry:</span> {formData.spec_chemistry || '-'}</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.Text }}>Description</label>
              <textarea
                rows={4}
                className={textareaClass}
                placeholder="Add final notes before submitting"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                style={{ borderColor: colors.Border }}
              />
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
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: colors.Text }}>
          {t('seller.addListing.title')}
        </h2>
        <p className="text-sm mt-1" style={{ color: colors.SubText }}>
          {t('seller.addListing.subtitle')}
        </p>
      </div>

      {/* Type Toggle */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setListingType('vehicle')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            listingType === 'vehicle' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          Vehicle
        </button>
        <button
          onClick={() => setListingType('battery')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            listingType === 'battery' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          Battery
        </button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between whitespace-nowrap gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step.id <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.id}
              </div>
              <span className={`ml-2 text-xs md:text-sm font-medium ${
                step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`ml-2 w-8 h-0.5 ${
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
        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          {t('seller.addListing.buttons.previous')}
        </button>

        <div className="flex items-center gap-3">
          <button
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium transition-colors duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {t('seller.addListing.buttons.saveDraft')}
          </button>
          
          {currentStep < steps.length ? (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md"
            >
              {t('seller.addListing.buttons.next')}
            </button>
          ) : (
            <button
              onClick={async () => {
                setError(null)
                setSubmitting(true)
                try {
                  // Require at least one image before submit
                  if (!uploadedImages || uploadedImages.length === 0) {
                    setError('Please upload at least one image in Step 4 before submitting.')
                    setSubmitting(false)
                    return
                  }
                  if (listingType === 'vehicle') {
                    const payload: CreateVehicleRequest = {
                      title: formData.title,
                      description: formData.description,
                      price: Number(formData.price) || 0,
                      brand: formData.make,
                      model: formData.model,
                      year: Number(formData.year) || new Date().getFullYear(),
                      mileage: Number(formData.mileage) || 0,
                      images: uploadedImages,
                      specifications: {
                        batteryAndCharging: { range: formData.range },
                      }
                    }
                    const res = await createVehicle(payload)
                    if (!res.success) throw new Error(res.message)
                  } else {
                    const payload: CreateBatteryRequest = {
                      title: formData.title,
                      description: formData.description,
                      price: Number(formData.price) || 0,
                      brand: formData.make,
                      capacity: Number(formData.batteryCapacity) || 0,
                      year: Number(formData.year) || new Date().getFullYear(),
                      health: Number(formData.batteryHealth) || 0,
                      images: uploadedImages,
                      specifications: {
                        weight: formData.spec_weight,
                        voltage: formData.spec_voltage,
                        chemistry: formData.spec_chemistry,
                        degradation: formData.spec_degradation,
                        chargingTime: formData.spec_chargingTime,
                        installation: formData.spec_installation,
                        warrantyPeriod: formData.spec_warrantyPeriod,
                        temperatureRange: formData.spec_temperatureRange
                      }
                    }
                    const res = await createBattery(payload)
                    if (!res.success) throw new Error(res.message)
                  }
                  success(t('toast.listingCreateSuccess', 'Listing created successfully!'))
                  // Reset form after successful submission
                  setFormData({
                    title: '', make: '', model: '', year: '', price: '', mileage: '',
                    location: '', zipCode: '', bodyType: '', drivetrain: '', exteriorColor: '', interiorColor: '',
                    batteryHealth: '', range: '', batteryCapacity: '', chargingType: '',
                    description: '', features: [], images: [],
                    spec_weight: '', spec_voltage: '', spec_chemistry: '', spec_degradation: '',
                    spec_chargingTime: '', spec_installation: '', spec_warrantyPeriod: '', spec_temperatureRange: ''
                  })
                  setUploadedImages([])
                  setImagePreviews([])
                  setCurrentStep(1)
                } catch (e) {
                  showError(e instanceof Error ? e.message : t('toast.listingCreateFailed', 'Failed to create listing'))
                } finally {
                  setSubmitting(false)
                }
              }}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-60 shadow-md"
            >
              {submitting ? 'Publishing...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddListing
