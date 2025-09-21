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
  fullName?: string
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

// Helper function to store auth token
export const storeAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
  }
}

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

// Helper function to remove auth token
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null
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
