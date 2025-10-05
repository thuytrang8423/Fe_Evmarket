import { Vehicle } from '../services/Vehicle'
import { Battery } from '../services/Battery'

export interface Product {
  id: string
  name: string
  year: string | number
  mileage?: string
  price: string
  image: string
  verified: boolean
  fastSale: boolean
  popular?: boolean
  rating: number
  sellPercentage?: string
  type: 'vehicle' | 'battery'
  batteryHealth?: number
  capacity?: string
  brand: string
  originalData?: Vehicle | Battery
}

export interface FilterState {
  search: string
  productType: string
  minPrice: string
  maxPrice: string
  brands: string[]
  batteryHealth: number
  verifiedOnly: boolean
}
