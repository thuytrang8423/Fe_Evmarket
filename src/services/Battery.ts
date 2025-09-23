// Battery service for battery-related API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://evmarket-api-staging.onrender.com/api/v1'

// Types for Battery API
export interface Battery {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  status: 'AVAILABLE' | 'SOLD' | 'DELISTED'
  brand: string
  capacity: number
  year: number
  health: number
  specifications: {
    weight: string
    voltage: string
    chemistry: string
    degradation: string
    chargingTime: string
    installation: string
    warrantyPeriod: string
    temperatureRange: string
  }
  isVerified: boolean
  createdAt: string
  updatedAt: string
  sellerId: string
}

export interface BatteriesResponse {
  success: boolean
  message: string
  data?: {
    batteries: Battery[]
  }
  error?: string
}

export interface BatteryResponse {
  success: boolean
  message: string
  data?: Battery | { battery: Battery }
  error?: string
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

// Get all batteries
export const getBatteries = async (): Promise<BatteriesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/batteries/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Batteries fetched successfully',
      data: data.data || { batteries: data.batteries || [] }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch batteries',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get battery by ID
export const getBatteryById = async (id: string): Promise<BatteryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/batteries/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Battery fetched successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch battery',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
