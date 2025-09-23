import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'
import { registerUser } from '../../services'

// Helper function to map server errors to i18n keys
const getLocalizedErrorMessage = (serverMessage: string, t: any): string => {
  const lowerMessage = serverMessage.toLowerCase()
  
  if (lowerMessage.includes('email') && lowerMessage.includes('exist')) {
    return t('auth.register.emailExists', 'Email này đã được sử dụng')
  }
  if (lowerMessage.includes('password') && lowerMessage.includes('short')) {
    return t('auth.register.passwordTooShort', 'Mật khẩu phải có ít nhất 8 ký tự')
  }
  if (lowerMessage.includes('email') && lowerMessage.includes('invalid')) {
    return t('auth.register.invalidEmail', 'Định dạng email không hợp lệ')
  }
  if (lowerMessage.includes('network') || lowerMessage.includes('server')) {
    return t('auth.register.networkError', 'Lỗi mạng hoặc server không khả dụng')
  }
  
  // Default error message
  return t('auth.register.registerFailed', 'Đăng ký thất bại')
}

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { t } = useI18nContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Validate password match
    if (password !== confirmPassword) {
      setError(t('auth.register.passwordMismatch', 'Mật khẩu xác nhận không khớp!'))
      setIsLoading(false)
      return
    }

    try {
      const response = await registerUser({
        email,
        password,
        name
      })
      
      if (response.success) {
        // Always use localized success message
        setSuccess(t('auth.register.registerSuccess', 'Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...'))
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        // Use localized error message based on server response
        setError(getLocalizedErrorMessage(response.message || '', t))
      }
    } catch (error) {
      setError(t('auth.register.unexpectedError', 'Đã xảy ra lỗi không mong muốn'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Welcome & Car Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/90 via-emerald-500/90 to-teal-600/90"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white h-full w-full">
          <div className="text-center mb-12 px-8 lg:px-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {t('auth.register.welcomeTitle', 'Chào mừng đến với hệ thống EV Dealer!')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 leading-relaxed max-w-md mx-auto">
              {t('auth.register.welcomeDesc', 'Đăng ký tài khoản để bắt đầu quản lý và trải nghiệm xe điện thông minh')}
            </p>
          </div>
          
          {/* Car Image Container */}
          <div className="flex items-center justify-center w-full px-8 lg:px-12">
            <div className="relative">
              <Image
                src="/Loginpage/logincar1.png"
                alt="Electric Vehicle"
                width={600}
                height={450}
                className="w-full h-auto object-contain max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8" style={{backgroundColor: colors.Background}}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{color: colors.Text}}>
              {t('auth.register.title', 'Đăng ký tài khoản')}
            </h2>
            <p style={{color: colors.SubText}}>
              {t('auth.register.subtitle', 'Hãy nhập tên và địa chỉ email của bạn')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
                <p className="text-xs text-green-500 mt-1">Redirecting to login page...</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                {t('auth.register.nameLabel', 'Họ và tên')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                style={{
                  borderColor: colors.Border,
                  color: colors.Text
                }}
                placeholder={t('auth.register.namePlaceholder', 'Nhập họ và tên của bạn')}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                {t('auth.register.emailLabel', 'Địa chỉ Email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                style={{
                  borderColor: colors.Border,
                  color: colors.Text
                }}
                placeholder={t('auth.register.emailPlaceholder', 'example@email.com')}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                {t('auth.register.passwordLabel', 'Mật khẩu')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  style={{
                    borderColor: colors.Border,
                    color: colors.Text
                  }}
                  placeholder={t('auth.register.passwordPlaceholder', 'Nhập mật khẩu')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  style={{color: colors.SubText}}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: colors.Text}}>
                {t('auth.register.confirmPasswordLabel', 'Xác nhận mật khẩu')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  style={{
                    borderColor: colors.Border,
                    color: colors.Text
                  }}
                  placeholder={t('auth.register.confirmPasswordPlaceholder', 'Nhập lại mật khẩu')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  style={{color: colors.SubText}}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1"
                required
              />
              <label className="ml-2 text-sm cursor-pointer" style={{color: colors.SubText}}>
                {t('auth.register.agreeTerms', 'Tôi đồng ý với')}{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                  {t('auth.register.terms', 'Điều khoản')}
                </a>
                {' '}và{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-500 font-medium">
                  {t('auth.register.privacy', 'Chính sách bảo mật')}
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 focus:ring-4 focus:ring-emerald-200 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('common.loading', 'Đang tải...')}
                </div>
              ) : (
                t('auth.register.registerButton', 'Đăng ký ngay')
              )}
            </button>

            {/* Or divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{borderColor: colors.Border}}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500" style={{backgroundColor: colors.Background}}>
                  {t('auth.register.orRegisterWith', 'Hoặc đăng ký bằng')}
                </span>
              </div>
            </div>

            {/* Social Register */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                style={{borderColor: colors.Border}}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium" style={{color: colors.Text}}>Google</span>
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                style={{borderColor: colors.Border}}
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium" style={{color: colors.Text}}>Facebook</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm" style={{color: colors.SubText}}>
                {t('auth.register.haveAccount', 'Đã có tài khoản?')}{' '}
                <a href="login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200">
                  {t('auth.register.signIn', 'Đăng nhập')}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register