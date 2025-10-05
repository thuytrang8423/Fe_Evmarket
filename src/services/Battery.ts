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

export interface BatteryListResponse {
  success: boolean
  message: string
  data?: { batteries: Battery[] }
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

// Create battery
export interface CreateBatteryRequest {
  title: string
  description: string
  price: number
  images?: (string | File)[]
  brand: string
  capacity: number
  year: number
  health: number
  specifications?: Partial<Battery['specifications']>
}

export const createBattery = async (payload: CreateBatteryRequest): Promise<BatteryResponse> => {
  try {
    // Lazy import to avoid circular deps at module top-level
    const { ensureValidToken } = await import('./Auth')
    const token = await ensureValidToken()

    if (!token) {
      throw new Error('Not authenticated')
    }

    // If images include File objects, send as multipart/form-data
    const hasFileImages = Array.isArray(payload.images) && payload.images.some((img) => img instanceof File)

    let response: Response
    if (hasFileImages) {
      const formData = new FormData()
      formData.append('title', payload.title)
      formData.append('description', payload.description)
      formData.append('price', String(payload.price))
      formData.append('brand', payload.brand)
      formData.append('capacity', String(payload.capacity))
      formData.append('year', String(payload.year))
      formData.append('health', String(payload.health))
      if (payload.specifications) {
        formData.append('specifications', JSON.stringify(payload.specifications))
      }
      if (payload.images) {
        for (const img of payload.images) {
          if (img instanceof File) formData.append('images', img)
        }
      }

      response = await fetch(`${API_BASE_URL}/batteries/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      })
    } else {
      response = await fetch(`${API_BASE_URL}/batteries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
    }

    const data = await handleApiResponse(response)

    return {
      success: true,
      message: data.message || 'Battery created successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create battery',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
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

// ========== MY LISTINGS (Seller) ==========

// Get current user's batteries
export const getMyBatteries = async (): Promise<BatteryListResponse> => {
  try {
    const { ensureValidToken } = await import('./Auth')
    const token = await ensureValidToken()

    const response = await fetch(`${API_BASE_URL}/users/me/batteries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })

    const data = await handleApiResponse(response)

    return {
      success: true,
      message: data.message || 'My batteries fetched successfully',
      data: data.data || { batteries: data.batteries || [] }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch my batteries',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get one of current user's batteries by id
export const getMyBatteryById = async (id: string): Promise<BatteryResponse> => {
  try {
    const { ensureValidToken } = await import('./Auth')
    const token = await ensureValidToken()

    const response = await fetch(`${API_BASE_URL}/batteries/me/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })

    const data = await handleApiResponse(response)

    return {
      success: true,
      message: data.message || 'My battery fetched successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch my battery',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Update battery (multipart aware)
export interface UpdateBatteryRequest extends Partial<CreateBatteryRequest> {}

export const updateBattery = async (id: string, payload: UpdateBatteryRequest): Promise<BatteryResponse> => {
  try {
    const { ensureValidToken } = await import('./Auth')
    const token = await ensureValidToken()

    const hasFileImages = Array.isArray(payload.images) && payload.images.some((img) => img instanceof File)

    let response: Response
    if (hasFileImages) {
      const formData = new FormData()
      if (payload.title !== undefined) formData.append('title', String(payload.title))
      if (payload.description !== undefined) formData.append('description', String(payload.description))
      if (payload.price !== undefined) formData.append('price', String(payload.price))
      if (payload.brand !== undefined) formData.append('brand', String(payload.brand))
      if (payload.capacity !== undefined) formData.append('capacity', String(payload.capacity))
      if (payload.year !== undefined) formData.append('year', String(payload.year))
      if (payload.health !== undefined) formData.append('health', String(payload.health))
      if (payload.specifications !== undefined) formData.append('specifications', JSON.stringify(payload.specifications))
      if (payload.images) {
        for (const img of payload.images) {
          if (img instanceof File) formData.append('images', img)
        }
      }

      response = await fetch(`${API_BASE_URL}/batteries/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      })
    } else {
      response = await fetch(`${API_BASE_URL}/batteries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
    }

    const data = await handleApiResponse(response)

    return {
      success: true,
      message: data.message || 'Battery updated successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update battery',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Delete battery
export const deleteBattery = async (id: string): Promise<BatteryResponse> => {
  try {
    const { ensureValidToken } = await import('./Auth')
    const token = await ensureValidToken()

    const response = await fetch(`${API_BASE_URL}/batteries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })

    const data = await handleApiResponse(response)
    return {
      success: true,
      message: data.message || 'Battery deleted successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete battery',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
