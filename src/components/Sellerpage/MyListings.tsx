"use client"
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'
import Image from 'next/image'
import {
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
  type Vehicle
} from '../../services/Vehicle'
import {
  getMyBatteries,
  updateBattery,
  deleteBattery,
  type Battery,
  // getBatteries
} from '../../services/Battery'
import { toast } from 'react-toastify'
import { 
  validateField,
  validateForm,
  getFieldError,
  hasFieldError,
  parseApiValidationErrors,
  ValidationError
} from '../../Utils/validation'

type ListingType = 'vehicle' | 'battery'

function MyListings() {
  const { t } = useI18nContext()
  const [filter, setFilter] = useState<'all' | 'active' | 'sold'>('all')
  const [tab, setTab] = useState<ListingType>('vehicle')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [batteries, setBatteries] = useState<Battery[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editType, setEditType] = useState<ListingType>('vehicle')
  const [editId, setEditId] = useState<string | null>(null)
  const [editImages, setEditImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    year: '',
    mileage: '',
    description: '',
    brand: '',
    model: '',
    status: 'AVAILABLE',
    capacity: '',
    health: '',
    // Vehicle specifications
    specifications: {
      warranty: {
        basic: '',
        battery: '',
        drivetrain: ''
      },
      dimensions: {
        width: '',
        height: '',
        length: '',
        curbWeight: ''
      },
      performance: {
        topSpeed: '',
        motorType: '',
        horsepower: '',
        acceleration: ''
      },
      batteryAndCharging: {
        range: '',
        chargeTime: '',
        chargingSpeed: '',
        batteryCapacity: ''
      },
      // Battery specifications
      batterySpecs: {
        weight: '',
        voltage: '',
        chemistry: '',
        degradation: '',
        chargingTime: '',
        installation: '',
        warrantyPeriod: '',
        temperatureRange: ''
      }
    }
  })

  const setApiErrors = (errors: Record<string, string>) => {
    const validationErrors = Object.entries(errors).map(([field, message]) => ({ field, message }))
    setValidationErrors(validationErrors)
  }

  // Helper functions for styling
  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
    const errorClass = "border-red-500 focus:ring-red-500"
    return hasFieldError(validationErrors, fieldName) ? `${baseClass} ${errorClass}` : baseClass
  }

  const ErrorMessage = ({ fieldName }: { fieldName: string }) => {
    const error = getFieldError(validationErrors, fieldName)
    return error ? (
      <p className="mt-1 text-sm text-red-600">{error}</p>
    ) : null
  }

  // Handle input change (no validation on change)
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // Handle specification change
  const handleSpecChange = useCallback((section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [section]: {
          ...prev.specifications[section as keyof typeof prev.specifications],
          [field]: value
        }
      }
    }))
  }, [])

  // Handle number input - only allow numbers for specific fields
  const handleNumberInput = useCallback((field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Check if field should only accept numbers
    const numberFields = ['price', 'year', 'mileage', 'capacity', 'health']
    
    if (numberFields.includes(field)) {
      // Allow empty string, numbers, and decimal point
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        handleInputChange(field, value)
      }
    } else {
      handleInputChange(field, value)
    }
  }, [handleInputChange])

  // Handle key press for number fields - prevent non-numeric characters
  const handleNumberKeyPress = useCallback((field: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    const numberFields = ['price', 'year', 'mileage', 'capacity', 'health']
    
    if (numberFields.includes(field)) {
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
  }, [])

  // Handle validation on blur (when user leaves the field)
  const handleInputBlur = useCallback((field: string) => {
    const value = formData[field as keyof typeof formData]
    const error = validateField(field, value, editType)
    
    if (error) {
      setValidationErrors(prev => [...prev.filter(err => err.field !== field), { field, message: error }])
    } else {
      setValidationErrors(prev => prev.filter(err => err.field !== field))
    }
  }, [formData, editType])

  // Image handling functions
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
    setNewImages(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...newPreviews])
    toast.success(t('toast.imageUploadSuccess', `Uploaded ${files.length} image${files.length > 1 ? 's' : ''} successfully!`))
  }

  const removeExistingImage = (index: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== index))
    toast.success(t('toast.imageRemoveSuccess', 'Image removed successfully!'))
  }

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    toast.success(t('toast.imageRemoveSuccess', 'Image removed successfully!'))
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [vRes, bRes] = await Promise.all([getMyVehicles(), getMyBatteries()])
        if (vRes.success) setVehicles(vRes.data?.vehicles || [])
        if (bRes.success) setBatteries(bRes.data?.batteries || [])
        if (!vRes.success || !bRes.success) setError(vRes.message || bRes.message)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load listings')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const listings = useMemo(() => {
    if (tab === 'vehicle') return vehicles.map(v => ({
      id: v.id,
      type: 'vehicle' as const,
      title: v.title,
      price: `$${Number(v.price).toLocaleString()}`,
      status: v.status === 'SOLD' ? 'sold' : 'active',
      image: v.images?.[0] || '/Homepage/TopCar.png',
      specs: { 
        mileage: `${v.mileage?.toLocaleString()} km`, 
        battery: v.specifications?.batteryAndCharging?.range ? `${v.specifications.batteryAndCharging.range} km range` : '', 
        year: v.year ? `${v.year}` : '',
        brand: v.brand || '',
        model: v.model || ''
      }
    }))
    return batteries.map(b => ({
      id: b.id,
      type: 'battery' as const,
      title: b.title,
      price: `$${Number(b.price).toLocaleString()}`,
      status: b.status === 'SOLD' ? 'sold' : 'active',
      image: b.images?.[0] || '/Homepage/Car.png',
      specs: { 
        capacity: b.capacity ? `${b.capacity} kWh` : '', 
        health: `${b.health}% health`, 
        year: b.year ? `${b.year}` : '',
        brand: b.brand || ''
      }
    }))
  }, [tab, vehicles, batteries])

  const filteredListings = listings.filter(l => (filter === 'all' ? true : l.status === filter))

  const openEdit = (item: { id: string, type: ListingType }) => {
    setEditType(item.type)
    setEditId(item.id)
    
    if (item.type === 'vehicle') {
      const v = vehicles.find(v => v.id === item.id)
      const formData = {
        title: v?.title || '',
        price: String(v?.price ?? ''),
        year: String(v?.year ?? ''),
        mileage: String(v?.mileage ?? ''),
        description: v?.description || '',
        brand: v?.brand || '',
        model: v?.model || '',
        status: v?.status || 'AVAILABLE',
        capacity: '',
        health: '',
        specifications: {
          warranty: {
            basic: v?.specifications?.warranty?.basic || '',
            battery: v?.specifications?.warranty?.battery || '',
            drivetrain: v?.specifications?.warranty?.drivetrain || ''
          },
          dimensions: {
            width: v?.specifications?.dimensions?.width || '',
            height: v?.specifications?.dimensions?.height || '',
            length: v?.specifications?.dimensions?.length || '',
            curbWeight: v?.specifications?.dimensions?.curbWeight || ''
          },
          performance: {
            topSpeed: v?.specifications?.performance?.topSpeed || '',
            motorType: v?.specifications?.performance?.motorType || '',
            horsepower: v?.specifications?.performance?.horsepower || '',
            acceleration: v?.specifications?.performance?.acceleration || ''
          },
          batteryAndCharging: {
            range: v?.specifications?.batteryAndCharging?.range || '',
            chargeTime: v?.specifications?.batteryAndCharging?.chargeTime || '',
            chargingSpeed: v?.specifications?.batteryAndCharging?.chargingSpeed || '',
            batteryCapacity: v?.specifications?.batteryAndCharging?.batteryCapacity || ''
          },
          batterySpecs: {
            weight: '',
            voltage: '',
            chemistry: '',
            degradation: '',
            chargingTime: '',
            installation: '',
            warrantyPeriod: '',
            temperatureRange: ''
          }
        }
      }
      setFormData(formData)
      setEditImages(v?.images || [])
    } else {
      const b = batteries.find(b => b.id === item.id)
      const formData = {
        title: b?.title || '',
        price: String(b?.price ?? ''),
        year: String(b?.year ?? ''),
        mileage: '',
        description: b?.description || '',
        brand: b?.brand || '',
        model: '',
        status: 'AVAILABLE',
        capacity: String(b?.capacity ?? ''),
        health: String(b?.health ?? ''),
        specifications: {
          warranty: {
            basic: '',
            battery: '',
            drivetrain: ''
          },
          dimensions: {
            width: '',
            height: '',
            length: '',
            curbWeight: ''
          },
          performance: {
            topSpeed: '',
            motorType: '',
            horsepower: '',
            acceleration: ''
          },
          batteryAndCharging: {
            range: '',
            chargeTime: '',
            chargingSpeed: '',
            batteryCapacity: ''
          },
          batterySpecs: {
            weight: b?.specifications?.weight || '',
            voltage: b?.specifications?.voltage || '',
            chemistry: b?.specifications?.chemistry || '',
            degradation: b?.specifications?.degradation || '',
            chargingTime: b?.specifications?.chargingTime || '',
            installation: b?.specifications?.installation || '',
            warrantyPeriod: b?.specifications?.warrantyPeriod || '',
            temperatureRange: b?.specifications?.temperatureRange || ''
          }
        }
      }
      setFormData(formData)
      setEditImages(b?.images || [])
    }
    
    setNewImages([])
    setImagePreviews([])
    setValidationErrors([])
    setIsModalOpen(true)
  }

  const onDelete = async (item: { id: string, type: ListingType }) => {
    if (!confirm(t('seller.listings.deleteConfirm'))) return
    try {
      if (item.type === 'vehicle') {
        const res = await deleteVehicle(item.id)
        if (!res.success) throw new Error(res.message)
        setVehicles(prev => prev.filter(v => v.id !== item.id))
        toast.success(t('toast.vehicleDeleteSuccess', 'Vehicle deleted successfully!'))
      } else {
        const res = await deleteBattery(item.id)
        if (!res.success) throw new Error(res.message)
        setBatteries(prev => prev.filter(b => b.id !== item.id))
        toast.success(t('toast.batteryDeleteSuccess', 'Battery deleted successfully!'))
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t('toast.deleteFailed', 'Delete failed'))
    }
  }

  const onSave = async () => {
    if (!editId) {
      toast.error(t('toast.editIdNotFound', 'Edit ID not found'))
      return
    }
    
      console.log('onSave called with:', { editId, editType, formData })

      try {
        // Map formData fields to validation format based on editType
        let validationData
        if (editType === 'vehicle') {
          validationData = {
            title: formData.title,
            description: formData.description,
            price: formData.price,
            make: formData.brand, // Map brand to make for validation
            model: formData.model,
            year: formData.year,
            mileage: formData.mileage
          }
        } else {
          validationData = {
            title: formData.title,
            description: formData.description,
            price: formData.price,
            year: formData.year,
            batteryCapacity: formData.capacity, // Map capacity to batteryCapacity for validation
            batteryHealth: formData.health,
            ...(formData.brand && { make: formData.brand }) // Only add make if brand has value
          }
        }
        
        console.log('validationData mapped:', validationData)
        
        // Validate form data
        const validationResult = validateForm(validationData, editType)
        console.log('Validation result:', validationResult)

      if (!validationResult.isValid) {
        console.log('Validation failed:', validationResult.errors)
        console.log('Validation errors details:', validationResult.errors.map(e => ({ field: e.field, message: e.message })))
        setValidationErrors(validationResult.errors)
        toast.error(`Validation failed: ${validationResult.errors.map(e => `${e.field}: ${e.message}`).join(', ')}`)
        return
      }

      let result
      if (editType === 'vehicle') {
        const payload = {
          title: formData.title,
          price: Number(formData.price) || undefined,
          year: Number(formData.year) || undefined,
          mileage: Number(formData.mileage) || undefined,
          description: formData.description,
          brand: formData.brand,
          model: formData.model,
          status: formData.status as 'AVAILABLE' | 'SOLD' | 'DELISTED',
          images: newImages.length > 0 ? newImages : undefined,
          specifications: formData.specifications
        }
        console.log('Updating vehicle with payload:', payload)
        result = await updateVehicle(editId, payload)
      } else {
        const payload = {
          title: formData.title,
          price: Number(formData.price) || undefined,
          year: Number(formData.year) || undefined,
          capacity: Number(formData.capacity) || undefined,
          health: Number(formData.health) || undefined,
          description: formData.description,
          brand: formData.brand,
          images: newImages.length > 0 ? newImages : undefined,
          specifications: formData.specifications.batterySpecs
        }
        console.log('Updating battery with payload:', payload)
        result = await updateBattery(editId, payload)
      }

      console.log('API result:', result)

      if (!result.success) {
        console.log('API call failed:', result)
        // Handle API validation errors
        if ((result as any).errors || (result as any).details) {
          const apiErrors = parseApiValidationErrors(result as any)
          const apiValidationErrors = Object.entries(apiErrors).map(([field, message]) => ({
            field,
            message
          }))
          setValidationErrors(apiValidationErrors)
        } else {
          toast.error(result.message || t('seller.listings.updateError'))
        }
        return
      }

      // Update local state
      if (editType === 'vehicle') {
        const updatedVehicle = (result.data as any)?.vehicle || result.data
        setVehicles(prev => prev.map(v => v.id === editId ? { ...v, ...updatedVehicle } : v))
        toast.success(t('toast.vehicleUpdated', 'Vehicle updated successfully!'))
      } else {
        const updatedBattery = (result.data as any)?.battery || result.data
        setBatteries(prev => prev.map(b => b.id === editId ? { ...b, ...updatedBattery } : b))
        toast.success(t('toast.batteryUpdated', 'Battery updated successfully!'))
      }
      
      setIsModalOpen(false)
    } catch (e) {
      console.error('Error in onSave:', e)
      toast.error(e instanceof Error ? e.message : t('toast.updateFailed', 'Update failed'))
    }
  }

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'active':
  //       return 'bg-green-100 text-green-800'
  //     case 'sold':
  //       return 'bg-gray-100 text-gray-800'
  //     default:
  //       return 'bg-gray-100 text-gray-800'
  //   }
  // }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: colors.Text }}>{t('seller.listings.title')}</h2>
          <p className="text-sm mt-1" style={{ color: colors.SubText }}>{t('seller.listings.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTab('vehicle')} 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab==='vehicle'
                ?'bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white shadow-md'
                :'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {t('seller.listings.vehicle')}
          </button>
          <button 
            onClick={() => setTab('battery')} 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              tab==='battery'
                ?'bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white shadow-md'
                :'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {t('seller.listings.battery')}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => setFilter('all')} 
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            filter==='all'
              ?'bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white shadow-md'
              :'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {t('seller.listings.all')}
        </button>
        <button 
          onClick={() => setFilter('active')} 
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            filter==='active'
              ?'bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white shadow-md'
              :'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {t('seller.listings.active')}
        </button>
        <button 
          onClick={() => setFilter('sold')} 
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
            filter==='sold'
              ?'bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white shadow-md'
              :'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {t('seller.listings.sold')}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3DDC84]"></div>
        </div>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 flex flex-col h-[500px]">
            {/* Image Section */}
            <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                  item.status === 'active' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {item.status === 'active' ? t('seller.listings.available') : t('seller.listings.soldStatus')}
                </span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
                  {item.type === 'vehicle' ? t('seller.listings.electricVehicle') : t('seller.listings.battery')}
                </span>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                  {item.specs.brand && (
                    <p className="text-sm text-gray-600 font-medium">
                      {item.specs.brand} 
                      {'model' in item.specs && item.specs.model ? ` ${item.specs.model}` : ''}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600">{item.price}</span>
                </div>
              </div>
              
              {/* Specifications */}
              <div className="space-y-2 mb-6 flex-1">
                {item.type === 'vehicle' ? (
                  <>
                    {item.specs.year && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.year}</span>
                      </div>
                    )}
                    {item.specs.mileage && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.mileage}</span>
                      </div>
                    )}
                    {item.specs.battery && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.battery}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {item.specs.year && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.year}</span>
                      </div>
                    )}
                    {item.specs.capacity && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.capacity}</span>
                      </div>
                    )}
                    {item.specs.health && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>{item.specs.health}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Action Buttons - Fixed at bottom */}
              <div className="flex items-center gap-3 mt-auto">
                <button 
                  onClick={() => openEdit({ id: item.id, type: tab })} 
                  className="flex-1 bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-[#2BC973] hover:to-[#3B7AE8] transition-colors shadow-sm min-w-0"
                >
                  {t('seller.listings.edit')}
                </button>
                <button 
                  onClick={() => onDelete({ id: item.id, type: tab })} 
                  className="flex-shrink-0 w-12 h-12 border-2 border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-colors flex items-center justify-center"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium" style={{ color: colors.Text }}>{t('seller.listings.noListings')}</h3>
          <p className="text-sm" style={{ color: colors.SubText }}>{t('seller.listings.noListingsDesc')}</p>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border-2 border-[#d1d5db] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#16a085] to-[#3498db] rounded-t-2xl p-8 mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  {editType === 'vehicle' ? t('seller.listings.editVehicle') : t('seller.listings.editBattery')}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-white hover:text-gray-200"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  {t('seller.listings.form.title')} <span className="text-red-600 font-bold">*</span>
                </label>
                <input
                  className={getInputClass('title')}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  onBlur={() => handleInputBlur('title')}
                  placeholder={t('seller.listings.form.titlePlaceholder')} 
                />
                <ErrorMessage fieldName="title" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  {t('seller.listings.form.price')} <span className="text-red-600 font-bold">*</span>
                </label>
                <input type="number" className={getInputClass('price')} value={formData.price} onChange={(e) => handleNumberInput('price', e)} onKeyDown={(e) => handleNumberKeyPress('price', e)} onBlur={() => handleInputBlur('price')} placeholder={t('seller.listings.form.pricePlaceholder')} />
                <ErrorMessage fieldName="price" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  {t('seller.listings.form.year')} <span className="text-red-600 font-bold">*</span>
                </label>
                <input type="number" className={getInputClass('year')} value={formData.year} onChange={(e) => handleNumberInput('year', e)} onKeyDown={(e) => handleNumberKeyPress('year', e)} onBlur={() => handleInputBlur('year')} placeholder={t('seller.listings.form.yearPlaceholder')} />
                <ErrorMessage fieldName="year" />
              </div>
              {editType === 'vehicle' ? (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.listings.form.mileage')} <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input type="number" className={getInputClass('mileage')} value={formData.mileage || ''} onChange={(e) => handleNumberInput('mileage', e)} onKeyDown={(e) => handleNumberKeyPress('mileage', e)} onBlur={() => handleInputBlur('mileage')} placeholder={t('seller.listings.form.mileagePlaceholder')} />
                    <ErrorMessage fieldName="mileage" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.listings.form.brand')} <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input className={getInputClass('brand')} value={formData.brand || ''} onChange={(e) => handleInputChange('brand', e.target.value)} onBlur={() => handleInputBlur('brand')} placeholder={t('seller.listings.form.brandPlaceholder')} />
                    <ErrorMessage fieldName="brand" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.listings.form.model')} <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input className={getInputClass('model')} value={formData.model || ''} onChange={(e) => handleInputChange('model', e.target.value)} onBlur={() => handleInputBlur('model')} placeholder={t('seller.listings.form.modelPlaceholder')} />
                    <ErrorMessage fieldName="model" />
                  </div>
                 
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.listings.form.capacity')} <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input type="number" className={getInputClass('capacity')} value={formData.capacity || ''} onChange={(e) => handleNumberInput('capacity', e)} onKeyDown={(e) => handleNumberKeyPress('capacity', e)} onBlur={() => handleInputBlur('capacity')} placeholder={t('seller.listings.form.capacityPlaceholder')} />
                    <ErrorMessage fieldName="capacity" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.listings.form.health')} <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input type="number" className={getInputClass('health')} value={formData.health || ''} onChange={(e) => handleNumberInput('health', e)} onKeyDown={(e) => handleNumberKeyPress('health', e)} onBlur={() => handleInputBlur('health')} placeholder={t('seller.listings.form.healthPlaceholder')} />
                    <ErrorMessage fieldName="health" />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  {t('seller.listings.form.description')} <span className="text-red-600 font-bold">*</span>
                </label>
                <textarea className={getInputClass('description')} rows={4} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} onBlur={() => handleInputBlur('description')} placeholder={t('seller.listings.form.descriptionPlaceholder')} />
                <ErrorMessage fieldName="description" />
              </div>

              {/* Specifications Section */}
              {editType === 'vehicle' ? (
                <>
                  {/* Vehicle Specifications */}
                  <div className="md:col-span-2">
                    <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.warranty.title', 'Warranty Information')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.warranty.basic', 'Basic Warranty')}
                        </label>
                        <input
                          type="text"
                          value={formData.specifications.warranty.basic}
                          onChange={e => handleSpecChange('warranty', 'basic', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.basicWarranty', '4 years / 50,000 miles')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.warranty.battery', 'Battery Warranty')}
                        </label>
                        <input
                          type="text"
                          value={formData.specifications.warranty.battery}
                          onChange={e => handleSpecChange('warranty', 'battery', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.batteryWarranty', '8 years / 120,000 miles')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.warranty.drivetrain', 'Drivetrain Warranty')}
                        </label>
                        <input
                          type="text"
                          value={formData.specifications.warranty.drivetrain}
                          onChange={e => handleSpecChange('warranty', 'drivetrain', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.drivetrainWarranty', '8 years / 120,000 miles')}
                          className={getInputClass('')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.dimensions.title', 'Dimensions')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.dimensions.width', 'Width')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.dimensions.width}
                          onChange={e => handleSpecChange('dimensions', 'width', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.width', '78.8 in')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.dimensions.height', 'Height')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.dimensions.height}
                          onChange={e => handleSpecChange('dimensions', 'height', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.height', '62 in')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.dimensions.length', 'Length')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.dimensions.length}
                          onChange={e => handleSpecChange('dimensions', 'length', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.length', '180.9 in')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.dimensions.curbWeight', 'Curb Weight')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.dimensions.curbWeight}
                          onChange={e => handleSpecChange('dimensions', 'curbWeight', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.curbWeight', '4249 lbs')}
                          className={getInputClass('')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.performance.title', 'Performance')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.performance.topSpeed', 'Top Speed')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.performance.topSpeed}
                          onChange={e => handleSpecChange('performance', 'topSpeed', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.topSpeed', '123 mph')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.performance.motorType', 'Motor Type')}
                        </label>
                        <input
                          type="text"
                          value={formData.specifications.performance.motorType}
                          onChange={e => handleSpecChange('performance', 'motorType', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.motorType', 'Single Motor RWD')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.performance.horsepower', 'Horsepower')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.performance.horsepower}
                          onChange={e => handleSpecChange('performance', 'horsepower', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.horsepower', '674 hp')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.performance.acceleration', 'Acceleration (0-60 mph)')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.performance.acceleration}
                          onChange={e => handleSpecChange('performance', 'acceleration', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.acceleration', '5.6 seconds')}
                          className={getInputClass('')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.batteryCharging.title', 'Battery & Charging')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batteryCharging.range', 'Range')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.batteryAndCharging.range}
                          onChange={e => handleSpecChange('batteryAndCharging', 'range', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.specRange', '348 miles (EPA)')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batteryCharging.chargeTime', 'Charge Time')}
                        </label>
                        <input
                          type="text"
                          value={formData.specifications.batteryAndCharging.chargeTime}
                          onChange={e => handleSpecChange('batteryAndCharging', 'chargeTime', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.chargeTime', '33 minutes (10-80%)')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batteryCharging.chargingSpeed', 'Charging Speed')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.batteryAndCharging.chargingSpeed}
                          onChange={e => handleSpecChange('batteryAndCharging', 'chargingSpeed', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.chargingSpeed', '197 kW')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batteryCharging.batteryCapacity', 'Battery Capacity')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.batteryAndCharging.batteryCapacity}
                          onChange={e => handleSpecChange('batteryAndCharging', 'batteryCapacity', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.specBatteryCapacity', '74 kWh')}
                          className={getInputClass('')}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Battery Specifications */}
                  <div className="md:col-span-2">
                    <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.batterySpecs.title', 'Battery Specifications')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batterySpecs.weight', 'Weight')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.batterySpecs.weight}
                          onChange={e => handleSpecChange('batterySpecs', 'weight', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.weight', '400')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batterySpecs.voltage', 'Voltage')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.batterySpecs.voltage}
                          onChange={e => handleSpecChange('batterySpecs', 'voltage', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.voltage', '450')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batterySpecs.chemistry', 'Chemistry')}
                        </label>
                        <input
                          type="text"
                          value={formData.specifications.batterySpecs.chemistry}
                          onChange={e => handleSpecChange('batterySpecs', 'chemistry', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.chemistry', 'NMC')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batterySpecs.degradation', 'Degradation')}
                        </label>
                        <input
                          type="text"
                          value={formData.specifications.batterySpecs.degradation}
                          onChange={e => handleSpecChange('batterySpecs', 'degradation', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.degradation', '24% (76% capacity)')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batterySpecs.chargingTime', 'Charging Time')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.batterySpecs.chargingTime}
                          onChange={e => handleSpecChange('batterySpecs', 'chargingTime', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.chargingTime', '48')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batterySpecs.installation', 'Installation')}
                        </label>
                        <input
                          type="text"
                          value={formData.specifications.batterySpecs.installation}
                          onChange={e => handleSpecChange('batterySpecs', 'installation', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.installation', 'Professional required')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batterySpecs.warrantyPeriod', 'Warranty Period')}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.specifications.batterySpecs.warrantyPeriod}
                          onChange={e => handleSpecChange('batterySpecs', 'warrantyPeriod', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.warrantyPeriod', '4')}
                          className={getInputClass('')}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          {t('seller.addListing.specifications.batterySpecs.temperatureRange', 'Temperature Range')}
                        </label>
                        <input
                          type="text"
                          value={formData.specifications.batterySpecs.temperatureRange}
                          onChange={e => handleSpecChange('batterySpecs', 'temperatureRange', e.target.value)}
                          placeholder={t('seller.addListing.placeholders.temperatureRange', '-20°C to 60°C')}
                          className={getInputClass('')}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Image Management Section */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">{t('seller.addListing.fields.uploadPhotos')}</label>
                
                {/* Existing Images */}
                {editImages.length > 0 && (
                  <div className="mb-4">
                    {/* <h4 className="text-sm font-medium mb-2">Hình ảnh hiện tại:</h4> */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {editImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`existing-${index}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Images */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">{t('seller.listings.newImages')}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`new-${index}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            onClick={() => removeNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add Images Button */}
                <button
                  onClick={openFilePicker}
                  className="w-full py-4 px-6 border-2 border-dashed border-gray-400 rounded-lg text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{t('seller.listings.addNewImages')}</span>
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-3 mb-2">
              <button 
                onClick={()=>setIsModalOpen(false)} 
                className="px-6 py-2 border border-gray-400 text-gray-700 rounded-[10px] hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium"
              >
                {t('seller.listings.cancel')}
              </button>
              <button 
                onClick={onSave} 
                className="px-6 py-2 bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white rounded-[10px] hover:from-[#2BC973] hover:to-[#3B7AE8] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-medium shadow-md"
              >
                {t('seller.listings.saveChanges')}
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyListings
