"use client"
import React from 'react'
import { useI18nContext } from '../../providers/I18nProvider'
import { isAuthenticated } from '../../services'

function LastContent() {
  const { t } = useI18nContext()
  
  // Handle navigation with authentication check for browsing
  const handleBrowseNavigation = () => {
    if (!isAuthenticated()) {
      window.location.href = '/login'
      return
    }
    window.location.href = '/browse'
  }
  
  return (
    <div className="py-20 px-6 bg-gradient-to-r from-green-500 to-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          {t('homepage.cta.title')}
        </h2>

        {/* Subtitle */}
        <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed">
          {t('homepage.cta.description')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Browse Listings Button */}
          <button 
            onClick={handleBrowseNavigation}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
          >
            {t('homepage.hero.browseBtn')}
          </button>

          {/* Create Account Button */}
          <a 
            href="/register"
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 text-center inline-block"
          >
            {t('homepage.cta.startBtn')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default LastContent
