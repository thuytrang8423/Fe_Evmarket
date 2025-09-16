"use client"
import React, { useState } from 'react'
import colors from '../Utils/Color'
import Image from 'next/image'
import { useI18nContext } from '../providers/I18nProvider'

function Header() {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const { locale, changeLocale, t } = useI18nContext()
  
  const navigationItems = [
    { name: t('navigation.home'), href: '/', active: true },
    { name: t('navigation.browse'), href: '/browse', active: false },
    { name: t('navigation.sell'), href: '/sell', active: false }
  ]

  const languages = [
    { name: 'English', code: 'en', flag: '🇺🇸' },
    { name: 'Việt Nam', code: 'vn', flag: '🇻🇳' }
  ]

  const handleLanguageChange = (languageCode: 'en' | 'vn') => {
    changeLocale(languageCode)
    setLanguageDropdownOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="EcoTrade EV"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                EcoTrade EV
              </span>
            </div>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  item.active 
                    ? 'text-blue-600' 
                    : 'hover:text-blue-600'
                }`}
                style={!item.active ? {color: colors.Text} : {}}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Side - Icons */}
          <div className="flex items-center gap-4">
            {/* Language */}
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              >
                <Image
                  src="/Language.svg" // Fixed case sensitivity for production
                  alt="Language"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
              
              {/* Language Dropdown */}
              {languageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {languages.map((language, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-300 first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => handleLanguageChange(language.code as 'en' | 'vn')}
                      style={{color: colors.Text}}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                      {locale === language.code && (
                        <span className="ml-auto text-blue-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Overlay to close dropdown */}
              {languageDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setLanguageDropdownOpen(false)}
                />
              )}
            </div>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 relative">
              <Image
                src="/Notifications.svg" // Fixed case sensitivity for production
                alt="Notifications"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {/* Notification dot */}
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>

            {/* Profile */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
              <Image
                src="/Profile.svg" // Fixed case sensitivity for production
                alt="Profile"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header