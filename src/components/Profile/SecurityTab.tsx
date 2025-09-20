import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'

interface SecurityTabProps {
  formData: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  showPasswords: {
    current: boolean
    new: boolean
    confirm: boolean
  }
  onInputChange: (field: string, value: string) => void
  onTogglePassword: (field: 'current' | 'new' | 'confirm') => void
  onUpdatePassword: () => void
}

function SecurityTab({ 
  formData, 
  showPasswords, 
  onInputChange, 
  onTogglePassword, 
  onUpdatePassword 
}: SecurityTabProps) {
  const { t } = useI18nContext()
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{color: colors.Text}}>
        {t('profile.securityTab.title', 'Security Settings')}
      </h2>
      
      <div className="space-y-6">
        {/* Change Password */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{color: colors.Text}}>
            {t('profile.securityTab.changePassword', 'Change Password')}
          </h3>
          
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                {t('profile.securityTab.currentPassword', 'Current Password')}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => onInputChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  style={{
                    borderColor: colors.Border,
                    color: colors.Text
                  }}
                  placeholder={t('profile.securityTab.currentPasswordPlaceholder', 'Enter your current password')}
                />
                <button
                  type="button"
                  onClick={() => onTogglePassword('current')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title={showPasswords.current ? t('profile.securityTab.hidePassword', 'Hide password') : t('profile.securityTab.showPassword', 'Show password')}
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                {t('profile.securityTab.newPassword', 'New Password')}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => onInputChange('newPassword', e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  style={{
                    borderColor: colors.Border,
                    color: colors.Text
                  }}
                  placeholder={t('profile.securityTab.newPasswordPlaceholder', 'Enter your new password')}
                />
                <button
                  type="button"
                  onClick={() => onTogglePassword('new')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title={showPasswords.new ? t('profile.securityTab.hidePassword', 'Hide password') : t('profile.securityTab.showPassword', 'Show password')}
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                {t('profile.securityTab.confirmPassword', 'Confirm New Password')}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  style={{
                    borderColor: colors.Border,
                    color: colors.Text
                  }}
                  placeholder={t('profile.securityTab.confirmPasswordPlaceholder', 'Confirm your new password')}
                />
                <button
                  type="button"
                  onClick={() => onTogglePassword('confirm')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title={showPasswords.confirm ? t('profile.securityTab.hidePassword', 'Hide password') : t('profile.securityTab.showPassword', 'Show password')}
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onUpdatePassword}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {t('profile.securityTab.updatePassword', 'Update Password')}
          </button>
        </div>

        {/* Two-Factor Authentication */}
        <div className="border-t pt-6" style={{borderColor: colors.Border}}>
          <h3 className="text-lg font-semibold mb-4" style={{color: colors.Text}}>
            {t('profile.securityTab.twoFactorAuth', 'Two-Factor Authentication')}
          </h3>
          <p className="mb-4" style={{color: colors.SubText}}>
            {t('profile.securityTab.twoFactorDesc', 'Add an extra layer of security to your account')}
          </p>
          <button className="px-6 py-3 border border-green-600 text-green-600 hover:bg-green-50 font-medium rounded-lg transition-colors duration-200">
            {t('profile.securityTab.enable2FA', 'Enable 2FA')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecurityTab
