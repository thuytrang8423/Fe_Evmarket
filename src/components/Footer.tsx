"use client"
import React from 'react'
import colors from '../Utils/Color'
import Image from 'next/image'
import { useI18nContext } from '../providers/I18nProvider'

function Footer() {
  const { t } = useI18nContext()
  
  const quickLinks = [
    { name: t('navigation.home'), href: '/' },
    { name: t('footer.marketplace.browse'), href: '/browse-evs' },
    { name: t('footer.marketplace.batteries'), href: '/browse-batteries' },
    { name: t('navigation.sell'), href: '/sell' },
    { name: 'My Account', href: '/account' }
  ]

  const resources = [
    { name: t('footer.support.help'), href: '/guide/buying' },
    { name: t('footer.support.contact'), href: '/guide/battery' },
    { name: t('footer.support.safety'), href: '/safety' },
    { name: t('footer.support.faq'), href: '/faq' },
    { name: t('footer.company.blog'), href: '/blog' }
  ]

  const socialMedia = [
    { name: 'Facebook', icon: '/facebook.png', href: '#' },
    { name: 'Twitter', icon: '/twitter.png', href: '#' },
    { name: 'Instagram', icon: '/instagram.png', href: '#' },
    { name: 'LinkedIn', icon: '/linkedin.png', href: '#' }
  ]

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' }
  ]

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
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
            
            {/* Description */}
            <p className="text-sm mb-6 leading-relaxed" style={{color: colors.SubText}}>
              {t('footer.tagline')}
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center"
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{color: colors.Text}}>
              {t('footer.marketplace.title')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-blue-600 transition-colors duration-300"
                    style={{color: colors.SubText}}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4" style={{color: colors.Text}}>
              {t('footer.support.title')}
            </h3>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.href}
                    className="text-sm hover:text-blue-600 transition-colors duration-300"
                    style={{color: colors.SubText}}
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-semibold mb-4" style={{color: colors.Text}}>
              {t('footer.company.title')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5">
                  <svg className="w-5 h-5" style={{color: colors.SubText}} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="text-sm" style={{color: colors.SubText}}>
                  {t('footer.contact.address')}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5">
                  <svg className="w-5 h-5" style={{color: colors.SubText}} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                  </svg>
                </div>
                <span className="text-sm" style={{color: colors.SubText}}>
                  {t('footer.contact.phone')}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5">
                  <svg className="w-5 h-5" style={{color: colors.SubText}} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <span className="text-sm" style={{color: colors.SubText}}>
                  {t('footer.contact.email')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm" style={{color: colors.SubText}}>
              {t('footer.copyright')}
            </p>
            
            {/* Legal Links */}
            <div className="flex gap-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm hover:text-blue-600 transition-colors duration-300"
                  style={{color: colors.SubText}}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
