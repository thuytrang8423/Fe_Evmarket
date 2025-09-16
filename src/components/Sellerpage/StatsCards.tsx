"use client"
import React from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

function StatsCards() {
  const { t } = useI18nContext()
  
  const stats = [
    {
      title: t('seller.stats.activeListings'),
      value: '2',
      change: `+5 ${t('seller.stats.active')}`,
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: t('seller.stats.totalViews'),
      value: '435',
      change: `+87 ${t('seller.stats.thisWeek')}`,
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: t('seller.stats.messages'),
      value: '23',
      change: `+5 ${t('seller.stats.thisWeek')}`,
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: t('seller.stats.totalEarnings'),
      value: '$19,900',
      change: `+3 ${t('seller.stats.itemsSold')}`,
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ borderColor: colors.Border }}
          >
            {/* Icon */}
            <div className={`inline-flex items-center justify-center p-3 rounded-lg ${stat.iconBg} ${stat.iconColor} mb-4`}>
              {stat.icon}
            </div>

            {/* Title */}
            <h3 
              className="text-sm font-medium mb-2"
              style={{ color: colors.SubText }}
            >
              {stat.title}
            </h3>

            {/* Value */}
            <p 
              className="text-3xl font-bold mb-2"
              style={{ color: colors.Text }}
            >
              {stat.value}
            </p>

            {/* Change */}
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
              <span className="text-green-600 font-medium">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsCards
