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
    warranty: {
      basic: string
      battery: string
      drivetrain: string
    }
    dimensions: {
      width: string
      height: string
      length: string
      curbWeight: string
    }
    performance: {
      topSpeed: string
      motorType: string
      horsepower: string
      acceleration: string
    }
    batteryAndCharging: {
      range: string
      chargeTime: string
      chargingSpeed: string
      batteryCapacity: string
    }
  }
  isAuction: boolean
  auctionEndsAt: string | null
  startingPrice: number | null
  bidIncrement: number | null
  depositAmount: number | null
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

export interface VehicleListResponse {
  success: boolean
  message: string
  data?: { vehicles: Vehicle[] }
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

// Create vehicle
export interface CreateVehicleRequest {
  title: string
  description: string
  price: number
  images?: (string | File)[]
  brand: string
  model: string
  year: number
  color?: string
  mileage: number
  batteryType?: string
  status?: 'AVAILABLE' | 'SOLD' | 'DELISTED'
  specifications?: Partial<Vehicle['specifications']>
}

export const createVehicle = async (payload: CreateVehicleRequest): Promise<VehicleResponse> => {
  try {
    const { ensureValidToken } = await import('./Auth')
    const token = await ensureValidToken()

    if (!token) {
      throw new Error('Not authenticated')
    }

    // ✅ Auto-fill missing specification subfields to prevent backend validation errors
    if (payload.specifications) {
      payload.specifications = {
        performance: payload.specifications.performance || {
          topSpeed: '',
          motorType: '',
          horsepower: '',
          acceleration: ''
        },
        dimensions: payload.specifications.dimensions || {
          width: '',
          height: '',
          length: '',
          curbWeight: ''
        },
        warranty: payload.specifications.warranty || {
          basic: '',
          battery: '',
          drivetrain: ''
        },
        batteryAndCharging: payload.specifications.batteryAndCharging || {
          range: '',
          chargeTime: '',
          chargingSpeed: '',
          batteryCapacity: ''
        }
      }
    } else {
      payload.specifications = {
        performance: {
          topSpeed: '',
          motorType: '',
          horsepower: '',
          acceleration: ''
        },
        dimensions: {
          width: '',
          height: '',
          length: '',
          curbWeight: ''
        },
        warranty: {
          basic: '',
          battery: '',
          drivetrain: ''
        },
        batteryAndCharging: {
          range: '',
          chargeTime: '',
          chargingSpeed: '',
          batteryCapacity: ''
        }
      }
    }

    const hasFileImages =
      Array.isArray(payload.images) && payload.images.some((img) => img instanceof File)

    let response: Response
    if (hasFileImages) {
      const formData = new FormData()
      formData.append('title', payload.title)
      formData.append('description', payload.description)
      formData.append('price', String(payload.price))
      formData.append('brand', payload.brand)
      formData.append('model', payload.model)
      formData.append('year', String(payload.year))
      formData.append('mileage', String(payload.mileage))

      if (payload.color) formData.append('color', payload.color)
      if (payload.batteryType) formData.append('batteryType', payload.batteryType)
      if (payload.status) formData.append('status', payload.status)

      // ✅ Always append full specification structure
      if (payload.specifications) {
        formData.append('specifications', JSON.stringify(payload.specifications))
      }

      if (payload.images) {
        for (const img of payload.images) {
          if (img instanceof File) formData.append('images', img)
        }
      }

      response = await fetch(`${API_BASE_URL}/vehicles/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      })
    } else {
      response = await fetch(`${API_BASE_URL}/vehicles/`, {
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
      message: data.message || 'Vehicle created successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create vehicle',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
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

// ========== MY LISTINGS (Seller) ==========

// Get current user's vehicles
export const getMyVehicles = async (): Promise<VehicleListResponse> => {
  try {
    const { ensureValidToken } = await import('./Auth')
    const token = await ensureValidToken()

    const response = await fetch(`${API_BASE_URL}/users/me/vehicles`, {
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
      message: data.message || 'My vehicles fetched successfully',
      data: data.data || { vehicles: data.vehicles || [] }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch my vehicles',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get one of current user's vehicles by id
export const getMyVehicleById = async (id: string): Promise<VehicleResponse> => {
  try {
    const { ensureValidToken } = await import('./Auth')
    const token = await ensureValidToken()

    const response = await fetch(`${API_BASE_URL}/vehicles/me/${id}` , {
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
      message: data.message || 'My vehicle fetched successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch my vehicle',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Update vehicle (multipart aware)
export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {}

export const updateVehicle = async (id: string, payload: UpdateVehicleRequest): Promise<VehicleResponse> => {
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
      if (payload.model !== undefined) formData.append('model', String(payload.model))
      if (payload.year !== undefined) formData.append('year', String(payload.year))
      if (payload.mileage !== undefined) formData.append('mileage', String(payload.mileage))
      if (payload.specifications !== undefined) formData.append('specifications', JSON.stringify(payload.specifications))
      if (payload.images) {
        for (const img of payload.images) {
          if (img instanceof File) formData.append('images', img)
        }
      }

      response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: formData
      })
    } else {
      response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
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
      message: data.message || 'Vehicle updated successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update vehicle',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Delete vehicle
export const deleteVehicle = async (id: string): Promise<VehicleResponse> => {
  try {
    const { ensureValidToken } = await import('./Auth')
    const token = await ensureValidToken()

    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })

    const data = await handleApiResponse(response)
    return {
      success: true,
      message: data.message || 'Vehicle deleted successfully',
      data: data.data || data
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete vehicle',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
