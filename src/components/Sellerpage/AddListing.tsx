"use client"
import React, { useState, useCallback } from 'react'
import { validateField, validateForm, getFieldError, hasFieldError,  ValidationError } from '../../Utils/validation'
import { useI18nContext } from '../../providers/I18nProvider'
import { useToast } from '../../hooks/useToast'
import { ToastContainer } from '../common/Toast'
import { createVehicle } from '../../services/Vehicle'
import { createBattery } from '../../services/Battery'

interface FormData {
  title: string;
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  location: string;
  bodyType: string;
  exteriorColor: string;
  interiorColor: string;
  batteryHealth: string;
  range: string;
  batteryCapacity: string;
  description: string;
  spec_weight: string;
  spec_voltage: string;
  spec_chemistry: string;
  spec_degradation: string;
  spec_chargingTime: string;
  spec_installation: string;
  spec_warrantyPeriod: string;
  spec_temperatureRange: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface InputProps {
  field: keyof FormData;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  form: FormData;
  errors: ValidationError[];
  handleChange: (field: keyof FormData, value: string) => void;
  handleBlur: (field: keyof FormData) => void;
}

interface SelectProps {
  field: keyof FormData;
  label: string;
  options: SelectOption[];
  required?: boolean;
  form: FormData;
  errors: ValidationError[];
  handleChange: (field: keyof FormData, value: string) => void;
  handleBlur: (field: keyof FormData) => void;
}

// Input component - moved outside to prevent re-creation
const Input = ({ field, label, placeholder, type = "text", required = false, form, errors, handleChange, handleBlur }: InputProps) => {
  // Handle input for number fields - only allow numbers
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const value = e.target.value
      // Allow empty string, numbers, and decimal point
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        handleChange(field, value)
      }
    } else {
      handleChange(field, e.target.value)
    }
  }

  // Handle key press for number fields - prevent non-numeric characters
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      // Allow: backspace, delete, tab, escape, enter, decimal point
      if ([8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true)) {
        return
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault()
      }
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={handleNumberInput}
        onKeyDown={handleKeyPress}
        onBlur={() => handleBlur(field)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-600 text-base font-medium ${
          hasFieldError(errors, field) ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {getFieldError(errors, field) && (
        <p className="mt-1 text-sm text-red-600">{getFieldError(errors, field)}</p>
      )}
    </div>
  )
}

// Select component - moved outside to prevent re-creation
const Select = ({ field, label, options, required = false, form, errors, handleChange, handleBlur }: SelectProps) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={form[field]}
      onChange={e => handleChange(field, e.target.value)}
      onBlur={() => handleBlur(field)}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 text-base font-medium ${
        hasFieldError(errors, field) ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="" className="text-gray-600">Select {label}</option>
      {options.map((opt: SelectOption) => (
        <option key={opt.value} value={opt.value} className="text-gray-900">{opt.label}</option>
      ))}
    </select>
    {getFieldError(errors, field) && (
      <p className="mt-1 text-sm text-red-600">{getFieldError(errors, field)}</p>
    )}
  </div>
)

function AddListing() {
  const { t } = useI18nContext()
  const { toasts, success, error: showError, removeToast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [listingType, setListingType] = useState<'vehicle' | 'battery'>('vehicle')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  
  const [form, setForm] = useState<FormData>({
    title: '', make: '', model: '', year: '', price: '', mileage: '',
    location: '', bodyType: '', exteriorColor: '', interiorColor: '',
    batteryHealth: '', range: '', batteryCapacity: '', description: '',
    spec_weight: '', spec_voltage: '', spec_chemistry: '', spec_degradation: '',
    spec_chargingTime: '', spec_installation: '', spec_warrantyPeriod: '', spec_temperatureRange: ''
  })

  // Handle input change (no validation on change)
  const handleChange = useCallback((field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  // Handle validation on blur (when user leaves the field)
  const handleBlur = useCallback((field: keyof FormData) => {
    const value = form[field]
    const error = validateField(field, value, listingType)
    
    if (error) {
      setErrors(prev => [...prev.filter(e => e.field !== field), { field, message: error }])
    } else {
      setErrors(prev => prev.filter(e => e.field !== field))
    }
  }, [form, listingType])

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files)
    const previews = newFiles.map(f => URL.createObjectURL(f))
    setUploadedImages(prev => [...prev, ...newFiles])
    setImagePreviews(prev => [...prev, ...previews])
    success(t('toast.imageUploadSuccess', `Uploaded ${newFiles.length} image${newFiles.length > 1 ? 's' : ''} successfully!`))
  }

  const removeImage = (idx: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idx))
    setImagePreviews(prev => prev.filter((_, i) => i !== idx))
    success(t('toast.imageRemoveSuccess', 'Image removed successfully!'))
  }

  const handleSubmit = async () => {
    if (!uploadedImages.length) {
      showError(t('seller.addListing.validation.uploadImageRequired'))
      return
    }

    const validation = validateForm(form, listingType)
    if (!validation.isValid) {
      setErrors(validation.errors)
      setCurrentStep(1) // Go back to first step with errors
      return
    }

    setSubmitting(true)
    try {
      // API call
      let result
      if (listingType === 'vehicle') {
        const vehiclePayload = {
          title: form.title,
          description: form.description,
          price: Number(form.price),
          brand: form.make, // API expects 'brand', form uses 'make'
          model: form.model,
          year: Number(form.year),
          mileage: Number(form.mileage),
          images: uploadedImages,
          specifications: { batteryAndCharging: { range: form.range } }
        }
        result = await createVehicle(vehiclePayload)
      } else {
        const batteryPayload = {
          title: form.title,
          description: form.description,
          price: Number(form.price),
          brand: form.make, // API expects 'brand', form uses 'make'
          capacity: Number(form.batteryCapacity),
          year: Number(form.year),
          health: Number(form.batteryHealth),
          images: uploadedImages,
          specifications: {
            weight: form.spec_weight || undefined,
            voltage: form.spec_voltage || undefined,
            chemistry: form.spec_chemistry || undefined,
            degradation: form.spec_degradation || undefined,
            chargingTime: form.spec_chargingTime || undefined,
            installation: form.spec_installation || undefined,
            warrantyPeriod: form.spec_warrantyPeriod || undefined,
            temperatureRange: form.spec_temperatureRange || undefined
          }
        }
        result = await createBattery(batteryPayload)
      }

      console.log('API result:', result)
      
      if (!result.success) {
        showError(result.message || t('toast.createFailed', 'Failed to create listing'))
        return
      }

      success(t('seller.addListing.validation.listingCreatedSuccess'))
      
      // Reset form
      setForm({
        title: '', make: '', model: '', year: '', price: '', mileage: '',
        location: '', bodyType: '', exteriorColor: '', interiorColor: '',
        batteryHealth: '', range: '', batteryCapacity: '', description: '',
        spec_weight: '', spec_voltage: '', spec_chemistry: '', spec_degradation: '',
        spec_chargingTime: '', spec_installation: '', spec_warrantyPeriod: '', spec_temperatureRange: ''
      })
      setUploadedImages([])
      setImagePreviews([])
      setCurrentStep(1)
      setErrors([])
      
    } catch (e) {
      console.error('Error in handleSubmit:', e)
      const errorMessage = e instanceof Error ? e.message : t('toast.createFailed', 'Failed to create listing')
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const steps = listingType === 'vehicle'
    ? [t('seller.addListing.steps.basicInfo'), t('seller.addListing.steps.details'), t('seller.addListing.steps.battery'), t('seller.addListing.steps.photos'), t('seller.addListing.steps.reviewSubmit')]
    : [t('seller.addListing.steps.basicInfo'), t('seller.addListing.steps.batteryDetails'), t('seller.addListing.steps.specifications'), t('seller.addListing.steps.photos'), t('seller.addListing.steps.reviewSubmit')]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input field="title" label={t('seller.addListing.fields.listingTitle')} placeholder={t('seller.addListing.placeholders.listingTitle')} required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="price" label={t('seller.addListing.fields.price')} placeholder={t('seller.addListing.placeholders.price')} type="number" required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            {listingType === 'vehicle' ? (
              <Select field="make" label={t('seller.addListing.fields.make')} required options={[
                { value: 'tesla', label: 'Tesla' },
                { value: 'nissan', label: 'Nissan' },
                { value: 'bmw', label: 'BMW' }
              ]} form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            ) : (
              <Input field="make" label={t('seller.addListing.fields.make')} placeholder={t('seller.addListing.placeholders.brand')} required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            )}
            {listingType === 'vehicle' && (
              <Input field="model" label={t('seller.addListing.fields.model')} placeholder={t('seller.addListing.placeholders.model')} required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            )}
            <Select field="year" label={t('seller.addListing.fields.year')} required options={
              Array.from({ length: 10 }, (_, i) => 2025 - i).map(y => ({ value: y.toString(), label: y.toString() }))
            } form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            {listingType === 'vehicle' && (
              <Input field="mileage" label={t('seller.addListing.fields.mileage')} placeholder={t('seller.addListing.placeholders.mileage')} type="number" required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            )}
          </div>
        )

      case 2:
        if (listingType === 'vehicle') return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input field="location" label={t('seller.addListing.fields.location')} placeholder="Hà Nội, Việt Nam" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Select field="bodyType" label={t('seller.addListing.fields.bodyType')} options={[
              { value: 'sedan', label: t('seller.addListing.bodyTypeOptions.sedan') },
              { value: 'suv', label: t('seller.addListing.bodyTypeOptions.suv') },
              { value: 'hatchback', label: t('seller.addListing.bodyTypeOptions.hatchback') }
            ]} form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="exteriorColor" label={t('seller.addListing.fields.exteriorColor')} placeholder="Trắng ngọc trai" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="interiorColor" label={t('seller.addListing.fields.interiorColor')} placeholder="Đen" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
          </div>
        )
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input field="batteryCapacity" label={t('seller.addListing.fields.batteryCapacity')} placeholder="75" type="number" required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="batteryHealth" label={t('seller.addListing.fields.batteryHealth')} placeholder={t('seller.addListing.placeholders.batteryHealth')} type="number" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
          </div>
        )

      case 3:
        if (listingType === 'vehicle') return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input field="batteryHealth" label={t('seller.addListing.fields.batteryHealth')} placeholder={t('seller.addListing.placeholders.batteryHealth')} type="number" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="range" label={t('seller.addListing.fields.range')} placeholder={t('seller.addListing.placeholders.range')} type="number" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
          </div>
        )
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input field="spec_weight" label={t('seller.addListing.batterySpecs.weight')} placeholder={t('seller.addListing.placeholders.weight')} type="number" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="spec_voltage" label={t('seller.addListing.batterySpecs.voltage')} placeholder={t('seller.addListing.placeholders.voltage')} type="number" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="spec_chemistry" label={t('seller.addListing.batterySpecs.chemistry')} placeholder={t('seller.addListing.placeholders.chemistry')} form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="spec_degradation" label={t('seller.addListing.batterySpecs.degradation')} placeholder={t('seller.addListing.placeholders.degradation')} type="number" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="spec_chargingTime" label={t('seller.addListing.batterySpecs.chargingTime')} placeholder={t('seller.addListing.placeholders.chargingTime')} form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="spec_installation" label={t('seller.addListing.batterySpecs.installation')} placeholder={t('seller.addListing.placeholders.installation')} form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="spec_warrantyPeriod" label={t('seller.addListing.batterySpecs.warrantyPeriod')} placeholder={t('seller.addListing.placeholders.warrantyPeriod')} type="number" form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="spec_temperatureRange" label={t('seller.addListing.batterySpecs.temperatureRange')} placeholder={t('seller.addListing.placeholders.temperatureRange')} form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center text-gray-800">{t('seller.addListing.fields.uploadPhotos')}</h3>
            {imagePreviews.length === 0 ? (
              // Centered layout when no photos
              <div className="flex justify-center">
                <label className="w-64 h-48 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <span className="text-4xl text-blue-600 mb-2">+</span>
                  <span className="text-sm text-gray-600 font-medium">{t('seller.addListing.fields.selectPhotos')}</span>
                  <span className="text-xs text-gray-500 mt-1">{t('seller.addListing.actions.clickOrDrag')}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleImageUpload(e.target.files)}
                  />
                </label>
              </div>
            ) : (
              // Grid layout when photos are present
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt="" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {t('seller.addListing.actions.remove')}
                    </button>
                  </div>
                ))}
                <label className="w-full h-32 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  <span className="text-3xl text-blue-600">+</span>
                  <span className="text-xs text-gray-600">{t('seller.addListing.fields.selectPhotos')}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleImageUpload(e.target.files)}
                  />
                </label>
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-5">
            <h3 className="text-xl font-bold text-gray-900">{t('seller.addListing.steps.reviewSubmit')}</h3>
            
            {/* Basic Information */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.addListing.steps.basicInfo')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.listingTitle')}:</span>
                  <span className="text-base font-semibold text-gray-900">{form.title || '-'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.price')}:</span>
                  <span className="text-base font-bold text-gray-900">{form.price ? `$${Number(form.price).toLocaleString()}` : '-'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.year')}:</span>
                  <span className="text-base font-semibold text-gray-900">{form.year || '-'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.make')}:</span>
                  <span className="text-base font-semibold text-gray-900">{form.make || '-'}</span>
                </div>
                {listingType === 'vehicle' && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.model')}:</span>
                      <span className="text-base font-semibold text-gray-900">{form.model || '-'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.mileage')}:</span>
                      <span className="text-base font-semibold text-gray-900">{form.mileage ? `${Number(form.mileage).toLocaleString()} km` : '-'}</span>
                    </div>
                  </>
                )}
                {listingType === 'battery' && (
                  <>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.batteryCapacity')}:</span>
                      <span className="text-base font-semibold text-gray-900">{form.batteryCapacity ? `${form.batteryCapacity} kWh` : '-'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.batteryHealth')}:</span>
                      <span className="text-base font-semibold text-gray-900">{form.batteryHealth ? `${form.batteryHealth}%` : '-'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Vehicle Specific Details */}
            {listingType === 'vehicle' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.addListing.steps.details')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.location')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.location || '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.bodyType')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.bodyType || '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.exteriorColor')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.exteriorColor || '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.interiorColor')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.interiorColor || '-'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Battery Specific Details */}
            {listingType === 'vehicle' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.addListing.steps.battery')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.batteryHealth')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.batteryHealth ? `${form.batteryHealth}%` : '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.fields.range')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.range ? `${form.range} km` : '-'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Battery Specifications */}
            {listingType === 'battery' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.addListing.steps.specifications')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.batterySpecs.weight')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.spec_weight ? `${form.spec_weight} kg` : '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.batterySpecs.voltage')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.spec_voltage ? `${form.spec_voltage} V` : '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.batterySpecs.chemistry')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.spec_chemistry || '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.batterySpecs.degradation')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.spec_degradation ? `${form.spec_degradation}%` : '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.batterySpecs.chargingTime')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.spec_chargingTime || '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.batterySpecs.installation')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.spec_installation || '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.batterySpecs.warrantyPeriod')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.spec_warrantyPeriod ? `${form.spec_warrantyPeriod} years` : '-'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[110px]">{t('seller.addListing.batterySpecs.temperatureRange')}:</span>
                    <span className="text-base font-semibold text-gray-900">{form.spec_temperatureRange || '-'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Images */}
            {imagePreviews.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.addListing.fields.uploadPhotos')}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt="" className="w-full h-32 object-cover rounded-lg" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {t('seller.addListing.actions.remove')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">{t('seller.addListing.fields.description')} *</label>
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                rows={5}
                placeholder={t('seller.addListing.placeholders.description')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-600 text-base font-medium ${
                  hasFieldError(errors, 'description') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getFieldError(errors, 'description') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'description')}</p>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t('seller.addListing.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">{t('seller.addListing.subtitle')}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setListingType('vehicle')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            listingType === 'vehicle' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {t('seller.listings.vehicle')}
        </button>
        <button
          onClick={() => setListingType('battery')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            listingType === 'battery' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          {t('seller.listings.battery')}
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i + 1 <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-xs font-medium ${
              i + 1 <= currentStep ? 'text-gray-800' : 'text-gray-600'
            }`}>{step}</span>
            {i < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-400 ml-2" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {renderStep()}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {t('seller.addListing.buttons.previous')}
        </button>
        
        {currentStep < steps.length ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md"
          >
            {t('seller.addListing.buttons.next')}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 font-medium shadow-md"
          >
            {submitting ? t('seller.addListing.buttons.creating') : t('seller.addListing.buttons.createListing')}
          </button>
        )}
      </div>
    </div>
  )
}

export default AddListing