"use client"
import React, { useState } from 'react'
import colors from '../Utils/Color'
import Image from 'next/image'
import { useI18nContext } from '../providers/I18nProvider'
import { usePathname } from 'next/navigation'

function Header() {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Track login status
  const { locale, changeLocale, t } = useI18nContext()
  const pathname = usePathname()
  
  const navigationItems = [
    { name: t('navigation.home'), href: '/' },
    { name: t('navigation.browse'), href: '/browse' },
    { name: t('navigation.sell'), href: '/sell' }
  ]

  // Function to check if a path is active
  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/home'
    }
    return pathname.startsWith(href)
  }

  const languages = [
    { name: 'English', code: 'en', flag: '🇺🇸' },
    { name: 'Việt Nam', code: 'vn', flag: '🇻🇳' }
  ]

  const handleLanguageChange = (languageCode: 'en' | 'vn') => {
    changeLocale(languageCode)
    setLanguageDropdownOpen(false)
  }

  // Get current language info
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            {/* Logo - Always visible */}
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
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
            </a>
          </div>

          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item, index) => {
              const isActive = isActivePath(item.href)
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'hover:text-blue-600'
                  }`}
                  style={!isActive ? {color: colors.Text} : {}}
                >
                  {item.name}
                </a>
              )
            })}
          </nav>

          {/* Right Side - Icons & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                >
                  <Image
                    src="/Language.svg"
                    alt="Language"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span className="text-lg">{currentLanguage.flag}</span>
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

              {/* Notifications - Only show when logged in */}
              {isLoggedIn && (
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300 relative">
                  <Image
                    src="/Notifications.svg"
                    alt="Notifications"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  {/* Notification dot */}
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                </button>
              )}

              {/* Profile / Login */}
              {isLoggedIn ? (
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                  <Image
                    src="/Profile.svg"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </button>
              ) : (
                <a
                  href="/login"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 inline-block"
                >
                  {t('common.login')}
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{color: colors.Text}}
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              {/* Navigation Links */}
              <div className="space-y-2">
                {navigationItems.map((item, index) => {
                  const isActive = isActivePath(item.href)
                  return (
                    <a
                      key={index}
                      href={item.href}
                      className={`block py-2 text-sm font-medium transition-colors duration-300 ${
                        isActive 
                          ? 'text-blue-600' 
                          : 'hover:text-blue-600'
                      }`}
                      style={!isActive ? {color: colors.Text} : {}}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  )
                })}
              </div>

              {/* Mobile Actions */}
              <div className="pt-3 border-t border-gray-200 space-y-3">
                {/* Language Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{color: colors.Text}}>
                    Language
                  </span>
                  <div className="flex gap-2">
                    {languages.map((language, index) => (
                      <button
                        key={index}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors duration-300 ${
                          locale === language.code 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'hover:bg-gray-50'
                        }`}
                        style={locale !== language.code ? {
                          borderColor: colors.Border,
                          color: colors.Text
                        } : {}}
                        onClick={() => handleLanguageChange(language.code as 'en' | 'vn')}
                      >
                        {language.flag} {language.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Icons */}
                <div className="flex justify-around pt-2">
                  {/* Notifications - Only show when logged in */}
                  {isLoggedIn && (
                    <button className="flex flex-col items-center gap-1 p-2">
                      <Image
                        src="/Notifications.svg"
                        alt="Notifications"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      <span className="text-xs" style={{color: colors.SubText}}>Notifications</span>
                    </button>
                  )}
                  
                  {isLoggedIn ? (
                    <button className="flex flex-col items-center gap-1 p-2">
                      <Image
                        src="/profile.svg"
                        alt="Profile"
                        width={20}
                        height={20}
                        className="w-5 h-5"
                      />
                      <span className="text-xs" style={{color: colors.SubText}}>Profile</span>
                    </button>
                  ) : (
                    <a
                      href="/login"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-300 inline-block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('common.login')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header