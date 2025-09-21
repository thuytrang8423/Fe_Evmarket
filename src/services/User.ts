// User service for profile and user-related API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://evmarket-api-staging.onrender.com/api/v1'

// Types for User API
export interface User {
  id: string
  email: string
  name: string
  avatar: string | null
  role: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfileResponse {
  success: boolean
  message: string
  data?: {
    user: User
  }
  error?: string
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  avatar?: string
}

export interface UpdateProfileResponse {
  success: boolean
  message: string
  data?: {
    user: User
  }
  error?: string
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
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
    throw new Error(data.message || data.error || 'Something went wrong')
  }

  return data
}

// Get user profile
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Profile fetched successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Update user profile
export const updateUserProfile = async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  try {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Profile updated successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Upload avatar
export const uploadAvatar = async (file: File): Promise<UpdateProfileResponse> => {
  try {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const formData = new FormData()
    formData.append('avatar', file)

    const response = await fetch(`${API_BASE_URL}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Avatar updated successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload avatar',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
