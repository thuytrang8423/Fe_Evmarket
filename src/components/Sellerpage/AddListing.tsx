"use client"
import React, { useState, useCallback } from 'react'
import { validateField, validateForm, getFieldError, hasFieldError,  ValidationError } from '../../Utils/validation'
import { useI18nContext } from '../../providers/I18nProvider'
import { toast } from 'react-toastify'
import { createVehicle } from '../../services/Vehicle'
import { createBattery } from '../../services/Battery'

interface FormData {
  title: string;
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  batteryCapacity: string;
  health: string;
  description: string;
  specifications: {
    warranty: {
      basic: string;
      battery: string;
      drivetrain: string;
    };
    dimensions: {
      width: string;
      height: string;
      length: string;
      curbWeight: string;
    };
    performance: {
      topSpeed: string;
      motorType: string;
      horsepower: string;
      acceleration: string;
    };
    batteryAndCharging: {
      range: string;
      chargeTime: string;
      chargingSpeed: string;
      batteryCapacity: string;
    };
    // Battery-specific specifications
    batterySpecs?: {
      weight: string;
      voltage: string;
      chemistry: string;
      degradation: string;
      chargingTime: string;
      installation: string;
      warrantyPeriod: string;
      temperatureRange: string;
    };
  };
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
  handleChange: (field: keyof FormData, value: string | any) => void;
  handleBlur: (field: keyof FormData) => void;
}

interface SelectProps {
  field: keyof FormData;
  label: string;
  options: SelectOption[];
  required?: boolean;
  form: FormData;
  errors: ValidationError[];
  handleChange: (field: keyof FormData, value: string | any) => void;
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
        value={typeof form[field] === 'string' ? form[field] as string : ''}
        onChange={handleNumberInput}
        onKeyDown={handleKeyPress}
        onBlur={() => handleBlur(field)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-base font-medium ${
          hasFieldError(errors, field) ? 'border-red-500' : 'border-[#d1d5db]'
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
      value={typeof form[field] === 'string' ? form[field] as string : ''}
      onChange={e => handleChange(field, e.target.value)}
      onBlur={() => handleBlur(field)}
      className={`w-full px-4 py-3 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 text-base font-medium ${
        hasFieldError(errors, field) ? 'border-red-500' : 'border-[#d1d5db]'
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

// Specifications Modal Component
const SpecificationsModal = ({ isOpen, onClose, form, errors, handleChange, handleBlur, t, required, listingType }: {
  isOpen: boolean;
  onClose: () => void;
  form: FormData;
  errors: ValidationError[];
  handleChange: (field: keyof FormData, value: string | any) => void;
  handleBlur: (field: keyof FormData) => void;
  t: (key: string, fallback?: string) => string;
  required: boolean;
  listingType: 'vehicle' | 'battery';
}) => {
  if (!isOpen) return null;

  const handleSpecChange = (section: string, field: string, value: string) => {
    const newSpecs = { ...form.specifications };
    (newSpecs as any)[section] = { ...(newSpecs as any)[section], [field]: value };
    const newForm = { ...form, specifications: newSpecs };
    // Update the entire form to trigger re-render
    handleChange('specifications' as keyof FormData, newSpecs as any);
  };

  const handleSpecBlur = (section: string, field: string) => {
    handleBlur(`specifications.${section}.${field}` as keyof FormData);
  };

  const handleSave = () => {
    if (required) {
      // Validate all required fields are filled based on listing type
      const specs = form.specifications;
      let allFilled = false;
      
      if (listingType === 'vehicle') {
        // Vehicle specifications validation
        allFilled = Boolean(
          specs.warranty.basic && specs.warranty.battery && specs.warranty.drivetrain &&
          specs.dimensions.width && specs.dimensions.height && specs.dimensions.length && specs.dimensions.curbWeight &&
          specs.performance.topSpeed && specs.performance.motorType && specs.performance.horsepower && specs.performance.acceleration &&
          specs.batteryAndCharging.range && specs.batteryAndCharging.chargeTime && specs.batteryAndCharging.chargingSpeed && specs.batteryAndCharging.batteryCapacity
        );
      } else {
        // Battery specifications validation
        allFilled = Boolean(
          specs.batterySpecs?.weight && specs.batterySpecs?.voltage && specs.batterySpecs?.chemistry && specs.batterySpecs?.degradation &&
          specs.batterySpecs?.chargingTime && specs.batterySpecs?.installation && specs.batterySpecs?.warrantyPeriod && specs.batterySpecs?.temperatureRange
        );
      }
      
      if (!allFilled) {
        toast.error(t('seller.addListing.validation.allSpecsRequired', 'All specification fields are required'));
        return;
      }
    }
    
    // Show success toast
    toast.success(t('seller.addListing.specifications.saved', 'Specifications saved successfully!'));
    
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl border-2 border-[#d1d5db] shadow-xl p-0 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#16a085] to-[#3498db] rounded-t-2xl p-8 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              {listingType === 'vehicle' 
                ? t('seller.addListing.specifications.title', 'Vehicle Specifications')
                : t('seller.addListing.specifications.batteryTitle', 'Battery Specifications')
              }
            </h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          {listingType === 'vehicle' ? (
            <>
              {/* Warranty Section */}
               <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                 <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.warranty.title', 'Warranty')}</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.warranty.basic', 'Basic Warranty')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form.specifications.warranty.basic}
                      onChange={e => handleSpecChange('warranty', 'basic', e.target.value)}
                      onBlur={() => handleSpecBlur('warranty', 'basic')}
                      placeholder={t('seller.addListing.placeholders.basicWarranty', '4 years / 50,000 miles')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.warranty.battery', 'Battery Warranty')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form.specifications.warranty.battery}
                      onChange={e => handleSpecChange('warranty', 'battery', e.target.value)}
                      onBlur={() => handleSpecBlur('warranty', 'battery')}
                      placeholder={t('seller.addListing.placeholders.batteryWarranty', '8 years / 120,000 miles')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.warranty.drivetrain', 'Drivetrain Warranty')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form.specifications.warranty.drivetrain}
                      onChange={e => handleSpecChange('warranty', 'drivetrain', e.target.value)}
                      onBlur={() => handleSpecBlur('warranty', 'drivetrain')}
                      placeholder={t('seller.addListing.placeholders.drivetrainWarranty', '8 years / 120,000 miles')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Battery Specifications */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.batterySpecs.title', 'Battery Specifications')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batterySpecs.weight', 'Weight')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.batterySpecs?.weight || ''}
                      onChange={e => handleSpecChange('batterySpecs', 'weight', e.target.value)}
                      onBlur={() => handleSpecBlur('batterySpecs', 'weight')}
                      placeholder={t('seller.addListing.placeholders.weight', '400')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batterySpecs.voltage', 'Voltage')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.batterySpecs?.voltage || ''}
                      onChange={e => handleSpecChange('batterySpecs', 'voltage', e.target.value)}
                      onBlur={() => handleSpecBlur('batterySpecs', 'voltage')}
                      placeholder={t('seller.addListing.placeholders.voltage', '450')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batterySpecs.chemistry', 'Chemistry')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form.specifications.batterySpecs?.chemistry || ''}
                      onChange={e => handleSpecChange('batterySpecs', 'chemistry', e.target.value)}
                      onBlur={() => handleSpecBlur('batterySpecs', 'chemistry')}
                      placeholder={t('seller.addListing.placeholders.chemistry', 'NMC')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batterySpecs.degradation', 'Degradation')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form.specifications.batterySpecs?.degradation || ''}
                      onChange={e => handleSpecChange('batterySpecs', 'degradation', e.target.value)}
                      onBlur={() => handleSpecBlur('batterySpecs', 'degradation')}
                      placeholder={t('seller.addListing.placeholders.degradation', '24% (76% capacity)')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batterySpecs.chargingTime', 'Charging Time')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.batterySpecs?.chargingTime || ''}
                      onChange={e => handleSpecChange('batterySpecs', 'chargingTime', e.target.value)}
                      onBlur={() => handleSpecBlur('batterySpecs', 'chargingTime')}
                      placeholder={t('seller.addListing.placeholders.chargingTime', '48')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batterySpecs.installation', 'Installation')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form.specifications.batterySpecs?.installation || ''}
                      onChange={e => handleSpecChange('batterySpecs', 'installation', e.target.value)}
                      onBlur={() => handleSpecBlur('batterySpecs', 'installation')}
                      placeholder={t('seller.addListing.placeholders.installation', 'Professional required')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batterySpecs.warrantyPeriod', 'Warranty Period')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.batterySpecs?.warrantyPeriod || ''}
                      onChange={e => handleSpecChange('batterySpecs', 'warrantyPeriod', e.target.value)}
                      onBlur={() => handleSpecBlur('batterySpecs', 'warrantyPeriod')}
                      placeholder={t('seller.addListing.placeholders.warrantyPeriod', '4')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batterySpecs.temperatureRange', 'Temperature Range')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form.specifications.batterySpecs?.temperatureRange || ''}
                      onChange={e => handleSpecChange('batterySpecs', 'temperatureRange', e.target.value)}
                      onBlur={() => handleSpecBlur('batterySpecs', 'temperatureRange')}
                      placeholder={t('seller.addListing.placeholders.temperatureRange', '-20°C to 60°C')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {listingType === 'vehicle' && (
            <>
              {/* Dimensions Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                 <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.dimensions.title', 'Dimensions')}</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.dimensions.width', 'Width')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.dimensions.width}
                      onChange={e => handleSpecChange('dimensions', 'width', e.target.value)}
                      onBlur={() => handleSpecBlur('dimensions', 'width')}
                      placeholder={t('seller.addListing.placeholders.width', '78.8 in')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.dimensions.height', 'Height')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.dimensions.height}
                      onChange={e => handleSpecChange('dimensions', 'height', e.target.value)}
                      onBlur={() => handleSpecBlur('dimensions', 'height')}
                      placeholder={t('seller.addListing.placeholders.height', '62 in')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.dimensions.length', 'Length')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.dimensions.length}
                      onChange={e => handleSpecChange('dimensions', 'length', e.target.value)}
                      onBlur={() => handleSpecBlur('dimensions', 'length')}
                      placeholder={t('seller.addListing.placeholders.length', '180.9 in')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.dimensions.curbWeight', 'Curb Weight')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.dimensions.curbWeight}
                      onChange={e => handleSpecChange('dimensions', 'curbWeight', e.target.value)}
                      onBlur={() => handleSpecBlur('dimensions', 'curbWeight')}
                      placeholder={t('seller.addListing.placeholders.curbWeight', '4249 lbs')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Performance Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                 <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.performance.title', 'Performance')}</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.performance.topSpeed', 'Top Speed')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.performance.topSpeed}
                      onChange={e => handleSpecChange('performance', 'topSpeed', e.target.value)}
                      onBlur={() => handleSpecBlur('performance', 'topSpeed')}
                      placeholder={t('seller.addListing.placeholders.topSpeed', '123 mph')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.performance.motorType', 'Motor Type')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form.specifications.performance.motorType}
                      onChange={e => handleSpecChange('performance', 'motorType', e.target.value)}
                      onBlur={() => handleSpecBlur('performance', 'motorType')}
                      placeholder={t('seller.addListing.placeholders.motorType', 'Single Motor RWD')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.performance.horsepower', 'Horsepower')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.performance.horsepower}
                      onChange={e => handleSpecChange('performance', 'horsepower', e.target.value)}
                      onBlur={() => handleSpecBlur('performance', 'horsepower')}
                      placeholder={t('seller.addListing.placeholders.horsepower', '674 hp')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.performance.acceleration', 'Acceleration (0-60 mph)')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.performance.acceleration}
                      onChange={e => handleSpecChange('performance', 'acceleration', e.target.value)}
                      onBlur={() => handleSpecBlur('performance', 'acceleration')}
                      placeholder={t('seller.addListing.placeholders.acceleration', '5.6 seconds')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Battery & Charging Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                 <h4 className="text-base font-semibold text-gray-800 mb-3">{t('seller.addListing.specifications.batteryCharging.title', 'Battery & Charging')}</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batteryCharging.range', 'Range')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.batteryAndCharging.range}
                      onChange={e => handleSpecChange('batteryAndCharging', 'range', e.target.value)}
                      onBlur={() => handleSpecBlur('batteryAndCharging', 'range')}
                      placeholder={t('seller.addListing.placeholders.specRange', '348 miles (EPA)')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batteryCharging.chargeTime', 'Charge Time')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="text"
                      value={form.specifications.batteryAndCharging.chargeTime}
                      onChange={e => handleSpecChange('batteryAndCharging', 'chargeTime', e.target.value)}
                      onBlur={() => handleSpecBlur('batteryAndCharging', 'chargeTime')}
                      placeholder={t('seller.addListing.placeholders.chargeTime', '33 minutes (10-80%)')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batteryCharging.chargingSpeed', 'Charging Speed')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.batteryAndCharging.chargingSpeed}
                      onChange={e => handleSpecChange('batteryAndCharging', 'chargingSpeed', e.target.value)}
                      onBlur={() => handleSpecBlur('batteryAndCharging', 'chargingSpeed')}
                      placeholder={t('seller.addListing.placeholders.chargingSpeed', '197 kW')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      {t('seller.addListing.specifications.batteryCharging.batteryCapacity', 'Battery Capacity')} {required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.specifications.batteryAndCharging.batteryCapacity}
                      onChange={e => handleSpecChange('batteryAndCharging', 'batteryCapacity', e.target.value)}
                      onBlur={() => handleSpecBlur('batteryAndCharging', 'batteryCapacity')}
                      placeholder={t('seller.addListing.placeholders.specBatteryCapacity', '74 kWh')}
                      className="w-full px-3 py-2 bg-[#f9fafb] border border-[#d1d5db] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-3 mb-2">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-400 text-gray-700 rounded-[10px] hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium"
          >
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white rounded-[10px] hover:from-[#2BC973] hover:to-[#3B7AE8] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-medium shadow-md"
          >
            {t('seller.addListing.buttons.saveSpecs', 'Save Specifications')}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddListing() {
  const { t } = useI18nContext()
  const [listingType, setListingType] = useState<'vehicle' | 'battery'>('vehicle')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [showSpecsModal, setShowSpecsModal] = useState(false)
  const [specsRequired, setSpecsRequired] = useState(false)
  
  const [form, setForm] = useState<FormData>({
    title: '', make: '', model: '', year: '', price: '', mileage: '',
    batteryCapacity: '', health: '', description: '',
    specifications: {
      warranty: { basic: '', battery: '', drivetrain: '' },
      dimensions: { width: '', height: '', length: '', curbWeight: '' },
      performance: { topSpeed: '', motorType: '', horsepower: '', acceleration: '' },
      batteryAndCharging: { range: '', chargeTime: '', chargingSpeed: '', batteryCapacity: '' },
      batterySpecs: { weight: '', voltage: '', chemistry: '', degradation: '', chargingTime: '', installation: '', warrantyPeriod: '', temperatureRange: '' }
    }
  })

  // Handle input change (no validation on change)
  const handleChange = useCallback((field: keyof FormData, value: string | any) => {
    if (field === 'specifications') {
      setForm(prev => ({ ...prev, specifications: value }))
    } else {
      setForm(prev => ({ ...prev, [field]: value }))
    }
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
    toast.success(t('toast.imageUploadSuccess', `Uploaded ${newFiles.length} image${newFiles.length > 1 ? 's' : ''} successfully!`))
  }

  const removeImage = (idx: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idx))
    setImagePreviews(prev => prev.filter((_, i) => i !== idx))
    toast.success(t('toast.imageRemoveSuccess', 'Image removed successfully!'))
  }

  const handleSubmit = async () => {
    if (!uploadedImages.length) {
      toast.error(t('seller.addListing.validation.uploadImageRequired'))
      return
    }

    const validation = validateForm(form, listingType, specsRequired)
    if (!validation.isValid) {
      setErrors(validation.errors)
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
          specifications: form.specifications
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
          health: Number(form.health),
          images: uploadedImages,
          specifications: form.specifications.batterySpecs
        }
        result = await createBattery(batteryPayload)
      }

      console.log('API result:', result)
      
      if (!result.success) {
        toast.error(result.message || t('toast.createFailed', 'Failed to create listing'))
        return
      }

      toast.success(t('seller.addListing.validation.listingCreatedSuccess'))
      
      // Reset form
      setForm({
        title: '', make: '', model: '', year: '', price: '', mileage: '',
        batteryCapacity: '', health: '', description: '',
        specifications: {
          warranty: { basic: '', battery: '', drivetrain: '' },
          dimensions: { width: '', height: '', length: '', curbWeight: '' },
          performance: { topSpeed: '', motorType: '', horsepower: '', acceleration: '' },
          batteryAndCharging: { range: '', chargeTime: '', chargingSpeed: '', batteryCapacity: '' },
          batterySpecs: { weight: '', voltage: '', chemistry: '', degradation: '', chargingTime: '', installation: '', warrantyPeriod: '', temperatureRange: '' }
        }
      })
      setUploadedImages([])
      setImagePreviews([])
      setErrors([])
      setShowSpecsModal(false)
      setSpecsRequired(false)
      
    } catch (e) {
      console.error('Error in handleSubmit:', e)
      const errorMessage = e instanceof Error ? e.message : t('toast.createFailed', 'Failed to create listing')
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Single form render function
  const renderForm = () => {
    return (
      <div className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.addListing.steps.basicInfo')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input field="title" label={t('seller.addListing.fields.listingTitle')} placeholder={t('seller.addListing.placeholders.listingTitle')} required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="price" label={t('seller.addListing.fields.price')} placeholder={t('seller.addListing.placeholders.price')} type="number" required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            <Input field="make" label={t('seller.addListing.fields.brand')} placeholder={t('seller.addListing.placeholders.brand')} required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
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
        </div>


        {/* Battery Details - Only for Battery listings */}
        {listingType === 'battery' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.addListing.steps.batteryDetails')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input field="batteryCapacity" label={t('seller.addListing.fields.batteryCapacity')} placeholder="75" type="number" required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
              <Input field="health" label={t('seller.addListing.fields.health')} placeholder="85" type="number" required form={form} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
            </div>
          </div>
        )}

        {/* Specifications Button */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.addListing.steps.specifications')}</h3>
          <button
            type="button"
            onClick={() => {
              setSpecsRequired(true);
              setShowSpecsModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white rounded-lg hover:from-[#2BC973] hover:to-[#3B7AE8] font-medium shadow-md"
          >
            {listingType === 'vehicle' 
              ? t('seller.addListing.buttons.addVehicleSpecifications', 'Add Vehicle Specifications')
              : t('seller.addListing.buttons.addBatterySpecifications', 'Add Battery Specifications')
            } 
          </button>
          <p className="text-sm text-gray-600 mt-2">
            {t('seller.addListing.specifications.required', 'Specifications are required and must be completed.')}
          </p>
        </div>

        {/* Photos */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('seller.addListing.fields.uploadPhotos')}</h3>
          {imagePreviews.length === 0 ? (
            <div className="flex justify-center">
              <label className="w-64 h-48 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <span className="text-4xl text-blue-600 mb-2">+</span>
                <span className="text-sm text-gray-600 font-medium">{t('seller.addListing.fields.selectPhotos')}</span>
                <span className="text-xs text-gray-500 mt-1">{t('seller.addListing.fields.clickOrDrag')}</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
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

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">{t('seller.addListing.fields.description')} *</label>
          <textarea
            value={form.description}
            onChange={e => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            rows={5}
            placeholder={t('seller.addListing.placeholders.description')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400 text-base font-medium ${
              hasFieldError(errors, 'description') ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {getFieldError(errors, 'description') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError(errors, 'description')}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t('seller.addListing.title')}</h2>
        <p className="text-sm text-gray-600 mt-1">{t('seller.addListing.subtitle')}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setListingType('vehicle')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            listingType === 'vehicle' ? 'bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {t('seller.listings.vehicle')}
        </button>
        <button
          onClick={() => setListingType('battery')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            listingType === 'battery' ? 'bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {t('seller.listings.battery')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        {renderForm()}
      </div>

      {/* Specifications Modal */}
      <SpecificationsModal
        isOpen={showSpecsModal}
        onClose={() => setShowSpecsModal(false)}
        form={form}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        t={t}
        required={specsRequired}
        listingType={listingType}
      />

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-gradient-to-r from-[#3DDC84] to-[#4285F4] text-white rounded-lg hover:from-[#2BC973] hover:to-[#3B7AE8] disabled:opacity-60 font-medium shadow-md"
        >
          {submitting ? t('seller.addListing.buttons.creating') : t('seller.addListing.buttons.createListing')}
        </button>
      </div>
    </div>
  )
}

export default AddListing