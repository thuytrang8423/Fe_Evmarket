"use client"
import React, { useState } from 'react'
import { useI18nContext } from '../../providers/I18nProvider'
import colors from '../../Utils/Color'
import Image from 'next/image'
import { ChevronDown, Shield, RotateCcw, Headphones, CreditCard, Smartphone, Building2 } from 'lucide-react'

export default function Checkout() {
  const { t } = useI18nContext()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard')
  const [isOrderSummaryExpanded, setIsOrderSummaryExpanded] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    billingAddress: '',
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const orderData = {
    product: {
      name: 'Tesla Model 3 Standard Range Plus',
      brand: 'Tesla',
      year: 2021,
      batteryCapacity: '54 kWh',
      mileage: '25,000 km',
      condition: 'used',
      price: '850.000.000 ₫'
    },
    breakdown: {
      productPrice: '850.000.000 ₫',
      serviceFee: '5.000.000 ₫',
      vat: '85.500.000 ₫',
      discount: '-10.000.000 ₫',
      total: '930.500.000 ₫'
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Checkout Title */}
          <h1 className="text-3xl font-bold" style={{color: colors.Text}}>
            {t('checkout.title')}
          </h1>

          {/* Order Summary Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsOrderSummaryExpanded(!isOrderSummaryExpanded)}
            >
              <h2 className="text-lg font-semibold" style={{color: colors.Text}}>
                {t('checkout.orderSummary')}
              </h2>
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isOrderSummaryExpanded ? 'rotate-180' : ''
                }`}
                style={{color: colors.SubText}}
              />
            </div>
            
            {isOrderSummaryExpanded && (
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image
                      src="/Homepage/TopCar.png"
                      alt="Tesla Model 3"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                        {orderData.product.brand}
                      </span>
                      <h3 className="font-semibold" style={{color: colors.Text}}>
                        {orderData.product.name}
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm" style={{color: colors.SubText}}>
                      <p>{t('checkout.productDetails.year')}: {orderData.product.year}</p>
                      <p>{t('checkout.productDetails.batteryCapacity')}: {orderData.product.batteryCapacity}</p>
                      <p>{t('checkout.productDetails.mileage')}: {orderData.product.mileage}</p>
                      <p>{t('checkout.productDetails.condition')}: {t('checkout.productDetails.used')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">
                      {orderData.product.price}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6" style={{color: colors.Text}}>
              {t('checkout.paymentInfo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                  {t('checkout.personalInfo.fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{color: colors.Text}}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                  {t('checkout.personalInfo.email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{color: colors.Text}}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                  {t('checkout.personalInfo.phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0123 456 789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{color: colors.Text}}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                  {t('checkout.personalInfo.billingAddress')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  placeholder="123 Đường ABC, Quận 1, TP.HCM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{color: colors.Text}}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6" style={{color: colors.Text}}>
              {t('checkout.paymentMethod')}
            </h2>
            
            <div className="space-y-4">
              {/* Credit Card Option */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === 'creditCard' 
                    ? 'border-green-500 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod('creditCard')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium" style={{color: colors.Text}}>
                    {t('checkout.paymentMethods.creditCard')}
                  </span>
                </div>
              </div>
              
              {/* Credit Card Details Form - Completely separate, no container */}
              {selectedPaymentMethod === 'creditCard' && (
                <div className="mt-4 space-y-4">
                  {/* Row 1: Cardholder Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                      {t('checkout.paymentMethods.cardholderName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="NGUYEN VAN A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{color: colors.Text}}
                    />
                  </div>
                  
                  {/* Row 2: Card Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                      {t('checkout.paymentMethods.cardNumber')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{color: colors.Text}}
                    />
                  </div>
                  
                  {/* Row 3: Expiry Date and CVV */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                        {t('checkout.paymentMethods.expiryDate')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{color: colors.Text}}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                        {t('checkout.paymentMethods.cvv')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{color: colors.Text}}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* E-wallet Option */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === 'ewallet' 
                    ? 'border-green-500 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod('ewallet')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium" style={{color: colors.Text}}>
                    {t('checkout.paymentMethods.ewallet')}
                  </span>
                </div>
              </div>

              {/* Bank Transfer Option */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedPaymentMethod === 'bankTransfer' 
                    ? 'border-green-500 bg-green-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod('bankTransfer')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium" style={{color: colors.Text}}>
                    {t('checkout.paymentMethods.bankTransfer')}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm" style={{color: colors.SubText}}>
                  Tôi đồng ý với{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 underline">
                    Điều khoản và Điều kiện
                  </a>
                  {' '}cũng như{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 underline">
                    Chính sách Bảo mật
                  </a>
                  {' '}của EV Market.
                </span>
              </label>
            </div>

            {/* Complete Payment Button */}
            <button className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
              {t('checkout.completePayment')}
            </button>
          </div>
        </div>

        {/* Right Column - Order Details */}
        <div className="space-y-6">
          {/* Order Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4" style={{color: colors.Text}}>
              {t('checkout.orderDetails')}
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{color: colors.SubText}}>{t('checkout.orderBreakdown.productPrice')}</span>
                <span style={{color: colors.Text}}>{orderData.breakdown.productPrice}</span>
              </div>
              <div className="flex justify-between">
                <span style={{color: colors.SubText}}>{t('checkout.orderBreakdown.serviceFee')}</span>
                <span style={{color: colors.Text}}>{orderData.breakdown.serviceFee}</span>
              </div>
              <div className="flex justify-between">
                <span style={{color: colors.SubText}}>{t('checkout.orderBreakdown.vat')}</span>
                <span style={{color: colors.Text}}>{orderData.breakdown.vat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">{t('checkout.orderBreakdown.discount')}</span>
                <span className="text-green-600">{orderData.breakdown.discount}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold" style={{color: colors.Text}}>
                    {t('checkout.orderBreakdown.total')}
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {orderData.breakdown.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="space-y-4">
            {/* Secure Payment */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">
                    {t('checkout.security.securePayment')}
                  </h3>
                  <p className="text-sm text-green-600">
                    {t('checkout.security.secureDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">
                    {t('checkout.security.refundPolicy')}
                  </h3>
                  <p className="text-sm text-blue-600">
                    {t('checkout.security.refundDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">
                    {t('checkout.security.support24')}
                  </h3>
                  <p className="text-sm text-yellow-600">
                    {t('checkout.security.supportDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
