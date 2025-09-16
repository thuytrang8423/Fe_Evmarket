"use client"
import React from 'react'
import colors from '../../Utils/Color'
import Image from 'next/image'
import { useI18nContext } from '../../providers/I18nProvider'

function Reason() {
  const { t } = useI18nContext()
  
  const features = [
    {
      id: 1,
      icon: '/Homepage/VerifiedLogo.png',
      title: t('homepage.reasons.quality.title'),
      description: t('homepage.reasons.quality.description'),
      bgColor: 'bg-green-100'
    },
    {
      id: 2,
      icon: '/Homepage/PinLogo.png',
      title: t('homepage.reasons.secure.title'),
      description: t('homepage.reasons.secure.description'),
      bgColor: 'bg-blue-100'
    },
    {
      id: 3,
      icon: '/Homepage/SecurityLogo.png',
      title: t('homepage.reasons.support.title'),
      description: t('homepage.reasons.support.description'),
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{color: colors.Text}}>
            {t('homepage.reasons.title')}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="text-center"
            >
              {/* Icon Container */}
              <div className={`w-20 h-20 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-4" style={{color: colors.Text}}>
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-base leading-relaxed" style={{color: colors.SubText}}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reason
