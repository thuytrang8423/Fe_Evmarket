"use client"
import React from 'react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

function RecentActivity() {
  const { t } = useI18nContext()
  
  const activities = [
    {
      type: 'message',
      title: t('seller.activity.newMessage'),
      description: t('seller.activity.messageDesc'),
      time: `2 ${t('seller.activity.hoursAgo')}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      type: 'view',
      title: t('seller.activity.listingViews'),
      description: t('seller.activity.viewsDesc'),
      time: `6 ${t('seller.activity.hoursAgo')}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      type: 'profile',
      title: t('seller.activity.profileVisit'),
      description: t('seller.activity.profileDesc'),
      time: t('seller.activity.yesterday'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      type: 'review',
      title: t('seller.activity.newReview'),
      description: t('seller.activity.reviewDesc'),
      time: `2 ${t('seller.activity.daysAgo')}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" style={{ borderColor: colors.Border }}>
      {/* Header */}
      <h3 
        className="text-lg font-semibold mb-6"
        style={{ color: colors.Text }}
      >
        {t('seller.activity.title')}
      </h3>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            {/* Icon */}
            <div className={`inline-flex items-center justify-center p-2 rounded-lg ${activity.iconBg} ${activity.iconColor} flex-shrink-0`}>
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 
                  className="text-sm font-medium"
                  style={{ color: colors.Text }}
                >
                  {activity.title}
                </h4>
                <span 
                  className="text-xs"
                  style={{ color: colors.SubText }}
                >
                  {activity.time}
                </span>
              </div>
              <p 
                className="text-sm mt-1"
                style={{ color: colors.Description }}
              >
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity
