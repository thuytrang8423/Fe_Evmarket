// Auth service for login and register API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://evmarket-api-staging.onrender.com/api/v1'

// Types for API requests and responses
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    token?: string
    accessToken?: string
    access_token?: string
    user: {
      id: string
      email: string
      fullName?: string
      name?: string
      role?: string
    }
  }
  error?: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      email: string
      fullName?: string
    }
  }
  error?: string
}

export interface LogoutResponse {
  success: boolean
  message: string
  error?: string
}

export interface GoogleLoginResponse {
  success: boolean
  message: string
  data?: {
    redirectUrl?: string
    authUrl?: string
  }
  error?: string
}

export interface RefreshTokenRequest {
  refreshToken?: string
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data?: {
    accessToken: string
  }
  error?: string
}

// Generic API error interface
export interface ApiError {
  message: string
  statusCode?: number
  details?: any
}

// Custom error class for API errors
export class AuthError extends Error {
  statusCode?: number
  details?: any

  constructor(message: string, statusCode?: number, details?: any) {
    super(message)
    this.name = 'AuthError'
    this.statusCode = statusCode
    this.details = details
  }
}

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type')
  
  let data
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = { message: await response.text() }
  }

  if (!response.ok) {
    throw new AuthError(
      data.message || data.error || 'Something went wrong',
      response.status,
      data
    )
  }

  return data
}

// Login API call
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Login successful',
      data: data.data || data
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        error: error.message
      }
    }
    
    return {
      success: false,
      message: 'Network error or server is unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Register API call
export const registerUser = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Registration successful',
      data: data.data || data
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        error: error.message
      }
    }
    
    return {
      success: false,
      message: 'Network error or server is unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Google Login API call - redirects to Google OAuth
export const initiateGoogleLogin = async (): Promise<GoogleLoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Google login initiated',
      data: data.data || data
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        error: error.message
      }
    }
    
    return {
      success: false,
      message: 'Network error or server is unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Handle Google Login - opens popup or redirects to Google OAuth
export const handleGoogleLogin = async (): Promise<void> => {
  try {
    // Redirect to Google OAuth URL
    window.location.href = `${API_BASE_URL}/auth/google`
  } catch (error) {
    console.error('Error initiating Google login:', error)
    throw new Error('Failed to initiate Google login')
  }
}

// Refresh Token API call
export const refreshAccessToken = async (refreshToken?: string): Promise<RefreshTokenResponse> => {
  try {
    const storedRefreshToken = refreshToken || getRefreshToken()
    
    if (!storedRefreshToken) {
      throw new AuthError('No refresh token available', 401)
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: storedRefreshToken
      }),
    })

    const data = await handleApiResponse(response)
    
    // Store the new access token
    if (data.data?.accessToken) {
      storeAuthToken(data.data.accessToken)
    }
    
    return {
      success: true,
      message: data.message || 'Token refreshed successfully',
      data: data.data || data
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        error: error.message
      }
    }
    
    return {
      success: false,
      message: 'Network error or server is unavailable',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Logout API call
export const logoutUserAPI = async (): Promise<LogoutResponse> => {
  try {
    const token = getAuthToken()
    
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await handleApiResponse(response)
    
    // Always remove token from localStorage regardless of API response
    removeAuthToken()
    
    return {
      success: true,
      message: data.message || 'Logout successful'
    }
  } catch (error) {
    // Even if API fails, we still want to clear local token
    removeAuthToken()
    
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        error: error.message
      }
    }
    
    return {
      success: false,
      message: 'Network error during logout',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Helper function to store auth token with expiration
// Default to 1 hour (60 minutes) instead of 7 days for better security
export const storeAuthToken = (token: string, expirationHours: number = 1) => {
  if (typeof window !== 'undefined') {
    const expirationTime = Date.now() + (expirationHours * 60 * 60 * 1000) // Convert hours to milliseconds
    localStorage.setItem('authToken', token)
    localStorage.setItem('tokenExpiration', expirationTime.toString())
  }
}

// Helper function to store refresh token
export const storeRefreshToken = (refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

// Helper function to get refresh token
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken')
  }
  return null
}

// Helper function to remove refresh token
export const removeRefreshToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refreshToken')
  }
}

// Helper function to check if JWT token itself is expired
const isJWTTokenExpired = (token: string): boolean => {
  try {
    // Decode JWT token (base64 decode the payload part)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000 // Convert to seconds
    return payload.exp < currentTime
  } catch (error) {
    console.error('Error parsing JWT token:', error)
    return true // Treat invalid tokens as expired
  }
}

// Helper function to extend current session (if token is still valid)
export const extendSession = (additionalHours: number = 1): boolean => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    
    if (token && !isJWTTokenExpired(token)) {
      // Only extend if JWT token itself is still valid
      const currentExpiration = localStorage.getItem('tokenExpiration')
      const newExpiration = (currentExpiration ? parseInt(currentExpiration) : Date.now()) + (additionalHours * 60 * 60 * 1000)
      localStorage.setItem('tokenExpiration', newExpiration.toString())
      return true
    }
  }
  return false
}

// Helper function to get remaining session time in minutes
export const getRemainingSessionTime = (): number => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    
    if (token) {
      try {
        // Check JWT token expiry
        const payload = JSON.parse(atob(token.split('.')[1]))
        const jwtExpiry = payload.exp * 1000 // Convert to milliseconds
        const jwtRemaining = Math.max(0, (jwtExpiry - Date.now()) / (60 * 1000)) // Convert to minutes
        
        // Check localStorage expiry
        const localExpiration = localStorage.getItem('tokenExpiration')
        const localRemaining = localExpiration 
          ? Math.max(0, (parseInt(localExpiration) - Date.now()) / (60 * 1000))
          : 0
        
        // Return the shorter of the two (more restrictive)
        return Math.min(jwtRemaining, localRemaining)
      } catch (error) {
        console.error('Error calculating remaining time:', error)
      }
    }
  }
  return 0
}

// Helper function to check if token is expired (checks both localStorage and JWT expiry)
export const isTokenExpired = (): boolean => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken')
    
    if (!token) return true
    
    // Check JWT token expiry first (more accurate)
    if (isJWTTokenExpired(token)) {
      return true
    }
    
    // Then check localStorage expiration as backup
    const expiration = localStorage.getItem('tokenExpiration')
    if (!expiration) return true
    return Date.now() > parseInt(expiration)
  }
  return true
}

// Helper function to get auth token (only if not expired)
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    if (isTokenExpired()) {
      removeAuthToken() // Auto cleanup expired token
      return null
    }
    return localStorage.getItem('authToken')
  }
  return null
}

// Helper function to remove auth token and expiration
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
    localStorage.removeItem('tokenExpiration')
    removeRefreshToken() // Also remove refresh token when removing auth token
  }
}

// Helper function to automatically refresh token if needed
export const ensureValidToken = async (): Promise<string | null> => {
  const token = getAuthToken()
  
  // If we have a valid token, return it
  if (token && !isTokenExpired()) {
    return token
  }
  
  // If token is expired or doesn't exist, try to refresh it
  try {
    const refreshResponse = await refreshAccessToken()
    if (refreshResponse.success && refreshResponse.data?.accessToken) {
      return refreshResponse.data.accessToken
    }
  } catch (error) {
    console.error('Failed to refresh token:', error)
  }
  
  // If refresh failed, remove all tokens and return null
  removeAuthToken()
  return null
}

// Helper function to check if user is authenticated (with expiration check)
export const isAuthenticated = (): boolean => {
  const token = getAuthToken() // This already checks expiration
  return token !== null
}

// Logout function with API call
export const logoutUser = async () => {
  try {
    // Call logout API
    await logoutUserAPI()
  } catch (error) {
    // If API fails, we still proceed with local logout
    console.error('Logout API failed:', error)
  }
  
  // Always redirect to login page after logout
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

// Simple local logout (without API call) - for backwards compatibility
export const logoutUserLocal = () => {
  removeAuthToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
