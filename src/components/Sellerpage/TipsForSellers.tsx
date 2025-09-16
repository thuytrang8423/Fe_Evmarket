"use client"
import React from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

function TipsForSellers() {
  const { t } = useI18nContext()
  
  const tips = [
    {
      title: t('seller.tips.detailedDesc'),
      description: t('seller.tips.detailedDescTip'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: t('seller.tips.qualityPhotos'),
      description: t('seller.tips.qualityPhotosTip'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: t('seller.tips.respondQuickly'),
      description: t('seller.tips.respondTip'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: t('seller.tips.batteryReports'),
      description: t('seller.tips.batteryTip'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" style={{ borderColor: colors.Border }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="text-lg font-semibold"
          style={{ color: colors.Text }}
        >
          {t('seller.tips.title')}
        </h3>
        <button 
          className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors duration-200 hover:bg-gray-50"
          style={{ 
            color: colors.Text,
            borderColor: colors.Border 
          }}
        >
          {t('seller.tips.viewGuide')}
        </button>
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
            {/* Icon */}
            <div className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
              {tip.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 
                className="text-sm font-medium mb-1"
                style={{ color: colors.Text }}
              >
                {tip.title}
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.Description }}
              >
                {tip.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TipsForSellers
