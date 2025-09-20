import React from 'react'
import { Mail, Save } from 'lucide-react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'
import { type User as UserType } from '../../services'

interface ProfileTabProps {
  user: UserType | null
  formData: {
    name: string
    email: string
  }
  saving: boolean
  onInputChange: (field: string, value: string) => void
  onSave: () => void
}

function ProfileTab({ user, formData, saving, onInputChange, onSave }: ProfileTabProps) {
  const { t } = useI18nContext()
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{color: colors.Text}}>
        {t('profile.profileTab.title', 'Profile Information')}
      </h2>
      
      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
            {t('profile.profileTab.fullName', 'Full Name')}
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            style={{
              borderColor: colors.Border,
              color: colors.Text
            }}
            placeholder={t('profile.profileTab.fullNamePlaceholder', 'Enter your full name')}
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
            {t('profile.profileTab.email', 'Email Address')}
          </label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              style={{
                borderColor: colors.Border,
                color: colors.Text
              }}
              placeholder={t('profile.profileTab.emailPlaceholder', 'Enter your email address')}
            />
            <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
              {t('profile.profileTab.accountRole', 'Account Role')}
            </label>
            <div className="px-4 py-3 rounded-lg border bg-gray-50" style={{borderColor: colors.Border}}>
              <span className="capitalize" style={{color: colors.SubText}}>
                {user?.role.toLowerCase()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
              {t('profile.profileTab.memberSince', 'Member Since')}
            </label>
            <div className="px-4 py-3 rounded-lg border bg-gray-50" style={{borderColor: colors.Border}}>
              <span style={{color: colors.SubText}}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t('profile.profileTab.saving', 'Saving...')}
              </>
            ) : (
              <>
                <Save size={16} />
                {t('profile.profileTab.saveChanges', 'Save Changes')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileTab
