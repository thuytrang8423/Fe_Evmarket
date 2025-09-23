// Vehicle service for vehicle-related API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://evmarket-api-staging.onrender.com/api/v1'

// Types for Vehicle API
export interface Vehicle {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  status: 'AVAILABLE' | 'SOLD' | 'DELISTED'
  brand: string
  model: string
  year: number
  mileage: number
  specifications: {
    warranty?: {
      basic?: string
      battery?: string
      drivetrain?: string
    }
    dimensions?: {
      width?: string
      height?: string
      length?: string
      curbWeight?: string
    }
    performance?: {
      topSpeed?: string
      motorType?: string
      horsepower?: string
      acceleration?: string
    }
    batteryAndCharging?: {
      range?: string
      chargeTime?: string
      chargingSpeed?: string
      batteryCapacity?: string
    }
  }
  isVerified: boolean
  createdAt: string
  updatedAt: string
  sellerId: string
  seller?: {
    id: string
    name: string
    avatar: string
  }
}

export interface VehiclesResponse {
  success: boolean
  message: string
  data?: {
    vehicles: Vehicle[]
  }
  error?: string
}

export interface VehicleResponse {
  success: boolean
  message: string
  data?: Vehicle | { vehicle: Vehicle }
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

// Get all vehicles
export const getVehicles = async (): Promise<VehiclesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Vehicles fetched successfully',
      data: data.data || { vehicles: data.vehicles || [] }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch vehicles',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get vehicle by ID
export const getVehicleById = async (id: string): Promise<VehicleResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data = await handleApiResponse(response)
    
    return {
      success: true,
      message: data.message || 'Vehicle fetched successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch vehicle',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
