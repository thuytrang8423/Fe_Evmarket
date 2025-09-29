import React, { useRef } from 'react'
import { User, Camera, Shield, LogOut, Check } from 'lucide-react'
import Image from 'next/image'
import colors from '../../Utils/Color'
import VerifiedBadge from '../common/VerifiedBadge'
import { useI18nContext } from '../../providers/I18nProvider'
import { type User as UserType } from '../../services'

interface ProfileSidebarProps {
  user: UserType | null
  activeTab: string
  uploadingAvatar: boolean
  onTabChange: (tab: string) => void
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onLogout: () => void
}

function ProfileSidebar({ 
  user, 
  activeTab, 
  uploadingAvatar, 
  onTabChange, 
  onAvatarUpload, 
  onLogout 
}: ProfileSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useI18nContext()

  const tabs = [
    { id: 'profile', name: t('profile.sidebar.profile', 'Profile'), icon: User },
    { id: 'security', name: t('profile.sidebar.security', 'Security'), icon: Shield }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6" style={{borderColor: colors.Border}}>
      {/* User Avatar & Info */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 relative">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
                <span className="text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
            title={uploadingAvatar ? t('profile.sidebar.uploading', 'Uploading...') : t('profile.sidebar.uploadAvatar', 'Upload new avatar')}
          >
            {uploadingAvatar ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Camera size={16} />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onAvatarUpload}
            className="hidden"
          />
        </div>
        <h3 className="mt-4 font-semibold" style={{color: colors.Text}}>
          {user?.name}
        </h3>
        <p className="text-sm" style={{color: colors.SubText}}>
          {user?.email}
        </p>
        {user?.isVerified && (
          <div className="mt-2">
            <VerifiedBadge width={70} height={18} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                isActive
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'hover:bg-gray-50'
              }`}
              style={!isActive ? {color: colors.Text} : {}}
            >
              <Icon size={20} />
              <span className="font-medium">{tab.name}</span>
            </button>
          )
        })}
        
        
      </nav>
    </div>
  )
}

export default ProfileSidebar
