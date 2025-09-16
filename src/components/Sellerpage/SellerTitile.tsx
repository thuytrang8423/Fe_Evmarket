"use client"
import React from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

function SellerTitle() {
  const { t } = useI18nContext()
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="space-y-2">
          <h1 
            className="text-3xl lg:text-4xl font-bold"
            style={{ color: colors.Text }}
          >
            {t('seller.dashboard.title')}
          </h1>
          <p 
            className="text-base lg:text-lg"
            style={{ color: colors.SubText }}
          >
            {t('seller.dashboard.subtitle')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SellerTitle