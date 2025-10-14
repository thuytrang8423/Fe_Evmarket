"use client"
import React from 'react'
import colors from '../../Utils/Color'
import Image from 'next/image'
import { useI18nContext } from '../../providers/I18nProvider'
import { isAuthenticated } from '../../services'
import { useRouter } from 'next/navigation'

function Content() {
  const { t } = useI18nContext()
  const router = useRouter()
  
  // Handle navigation with authentication check
  const handleSellNavigation = () => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    router.push('/sell')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight" style={{color: colors.Text}}>
              {t('homepage.hero.title', 'The Trusted Marketplace')}
              <br />
              {' '}
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                {t('homepage.hero.subtitle', 'Second-hand EVs')}
              </span>
            </h1>
            
            <div className="space-y-4">
              <p className="text-lg" style={{color: colors.SubText}}>
                {t('homepage.hero.description1', 'Buy and sell pre-owned electric vehicles and batteries with confidence.')}
              </p>
              <p className="text-lg" style={{color: colors.SubText}}>
                {t('homepage.hero.description2', 'Verified sellers, battery health reports, and secure transactions.')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/browse"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center inline-block"
              >
                {t('homepage.hero.browseBtn', 'Browse EVs')}
              </a>
              <button 
                onClick={handleSellNavigation}
                className="px-8 py-4 border-2 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg text-center"
                style={{
                  color: colors.Text,
                  borderColor: colors.SubText
                }}
              >
                {t('homepage.hero.sellBtn', 'Sell Your EV')}
              </button>
            </div>
          </div>

          {/* Right Content - Car Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/Homepage/Car.png"
                alt="Electric Vehicle"
                width={600}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-gradient-to-br from-blue-400 to-green-500 rounded-full opacity-25 blur-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content