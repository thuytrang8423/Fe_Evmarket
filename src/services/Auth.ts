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
      credentials: 'include', // Include cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await handleApiResponse(response)
    
    // Store auth token from server response
    if (data.data && (data.data.token || data.data.accessToken || data.data.access_token)) {
      const token = data.data.token || data.data.accessToken || data.data.access_token
      console.log('Storing auth token from login response')
      storeAuthToken(token)
    } else if (data.token || data.accessToken || data.access_token) {
      const token = data.token || data.accessToken || data.access_token
      console.log('Storing auth token from login response (root level)')
      storeAuthToken(token)
    } else {
      console.log('No token found in login response:', data)
    }
    
    // Clear auth cache after successful login
    clearAuthCache()
    
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
      credentials: 'include', // Include cookies for authentication
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
    
    // Clear auth cache after logout
    clearAuthCache()
    
    return {
      success: true,
      message: data.message || 'Logout successful'
    }
  } catch (error) {
    // Even if API fails, we still want to clear local token and cache
    removeAuthToken()
    clearAuthCache()
    
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
export const storeAuthToken = (token: string, expirationDays: number = 7) => {
  if (typeof window !== 'undefined') {
    const expirationTime = Date.now() + (expirationDays * 24 * 60 * 60 * 1000) // Default 7 days
    localStorage.setItem('authToken', token)
    localStorage.setItem('tokenExpiration', expirationTime.toString())
  }
}

// Helper function to check if token is expired
export const isTokenExpired = (): boolean => {
  if (typeof window !== 'undefined') {
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
  }
}

// Cache for authentication status to avoid excessive API calls
let authCache: { status: boolean; timestamp: number } | null = null
const CACHE_DURATION = 30000 // 30 seconds cache

// Helper function to get auth token from localStorage
const getStoredAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

// Helper function to check if user is authenticated - supports both cookies and localStorage token
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Check cache first
    const now = Date.now()
    if (authCache && (now - authCache.timestamp) < CACHE_DURATION) {
      console.log('Using cached auth status:', authCache.status)
      return authCache.status
    }
    
    // Try to get token from localStorage
    const token = getStoredAuthToken()
    
    // Prepare request headers
    const headers: any = {
      'Content-Type': 'application/json',
    }
    
    // Add Authorization header if we have a token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log('Using localStorage token for auth check')
    } else {
      console.log('No localStorage token, trying cookies only')
    }
    
    // Try to call an authenticated endpoint to verify authentication
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
      headers: headers
    })
    
    console.log('Auth check response:', response.status, response.ok)
    
    const isAuth = response.ok
    
    // Cache the result
    authCache = { status: isAuth, timestamp: now }
    
    if (isAuth) {
      const data = await response.json()
      console.log('Auth check data:', data)
    } else {
      console.log('Auth check failed, response status:', response.status)
    }
    
    return isAuth
  } catch (error) {
    console.error('Auth check error:', error)
    
    // Cache negative result for shorter duration
    authCache = { status: false, timestamp: Date.now() }
    return false
  }
}

// Function to clear auth cache (call this after login/logout)
export const clearAuthCache = () => {
  authCache = null
}

// Legacy function - kept for backward compatibility but now just calls the main function
export const isAuthenticatedViaCookies = async (): Promise<boolean> => {
  return await isAuthenticated()
}

// Simplified authentication check - now only uses cookies
export const checkAuthentication = async (): Promise<boolean> => {
  return await isAuthenticated()
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
  
  // Clear auth cache
  clearAuthCache()
  
  // Always redirect to login page after logout
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

// Simple local logout (without API call) - for backwards compatibility
export const logoutUserLocal = () => {
  removeAuthToken()
  clearAuthCache()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
