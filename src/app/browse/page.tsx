"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BrowseHeader from '../../components/Browse/BrowseHeader'
import BrowseFilters from '../../components/Browse/BrowseFilters'
import ProductGrid from '../../components/Browse/ProductGrid'
import { getVehicles, Vehicle } from '../../services/Vehicle'
import { getBatteries, Battery } from '../../services/Battery'
import { getCurrentUserId } from '../../services'
import { Product, FilterState } from '../../types/product'

function BrowsePageContent() {
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') || ''

  const [filters, setFilters] = useState<FilterState>({
    search: urlSearch, // Initialize with URL search parameter
    productType: 'all',
    minPrice: '',
    maxPrice: '',
    brands: [] as string[],
    batteryHealth: 50,
    verifiedOnly: false
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Convert API data to Product format
  const convertVehicleToProduct = (vehicle: Vehicle): Product => ({
    id: vehicle.id,
    name: `${vehicle.brand} ${vehicle.model}`,
    year: vehicle.year.toString(),
    mileage: `${vehicle.mileage.toLocaleString()} miles`,
    price: `$${vehicle.price.toLocaleString()}`,
    image: vehicle.images[0] || '/Homepage/TopCar.png',
    verified: vehicle.isVerified,
    fastSale: vehicle.status === 'AVAILABLE',
    rating: 4.5, // Default rating since API doesn't provide this
    sellPercentage: '90% SoH', // Default value
    type: 'vehicle',
    capacity: vehicle.specifications?.batteryAndCharging?.batteryCapacity || '',
    brand: vehicle.brand,
    originalData: vehicle
  })

  const convertBatteryToProduct = (battery: Battery): Product => ({
    id: battery.id,
    name: battery.title,
    year: battery.year.toString(),
    price: `$${battery.price.toLocaleString()}`,
    image: battery.images[0] || '/Homepage/TopCar.png',
    verified: battery.isVerified,
    fastSale: battery.status === 'AVAILABLE',
    rating: 4.5, // Default rating since API doesn't provide this
    type: 'battery',
    capacity: `${battery.capacity} kWh`,
    batteryHealth: battery.health,
    brand: battery.brand,
    originalData: battery
  })

  // Update filters when URL search parameter changes
  useEffect(() => {
    if (urlSearch !== filters.search) {
      setFilters(prev => ({
        ...prev,
        search: urlSearch
      }))
    }
  }, [urlSearch])

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Get current user ID to filter out their own products
        const currentUserId = await getCurrentUserId()
        
        const [vehiclesResponse, batteriesResponse] = await Promise.all([
          getVehicles(),
          getBatteries()
        ])

        const allProducts: Product[] = []

        // Process vehicles - only AVAILABLE and not user's own
        if (vehiclesResponse.success && vehiclesResponse.data) {
          const vehicles = vehiclesResponse.data.vehicles || []
          const availableVehicles = vehicles.filter(vehicle => {
            const isAvailable = vehicle.status === 'AVAILABLE'
            const isNotOwnVehicle = !currentUserId || vehicle.sellerId !== currentUserId
            return isAvailable && isNotOwnVehicle
          })
          allProducts.push(...availableVehicles.map(convertVehicleToProduct))
        }

        // Process batteries - only AVAILABLE and not user's own
        if (batteriesResponse.success && batteriesResponse.data) {
          const batteries = batteriesResponse.data.batteries || []
          const availableBatteries = batteries.filter(battery => {
            const isAvailable = battery.status === 'AVAILABLE'
            const isNotOwnBattery = !currentUserId || battery.sellerId !== currentUserId
            return isAvailable && isNotOwnBattery
          })
          allProducts.push(...availableBatteries.map(convertBatteryToProduct))
        }

        setProducts(allProducts)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const nameMatch = product.name.toLowerCase().includes(searchTerm)
      const brandMatch = product.brand.toLowerCase().includes(searchTerm)
      if (!nameMatch && !brandMatch) return false
    }

    // Product type filter
    if (filters.productType !== 'all') {
      if (filters.productType === 'vehicles' && product.type !== 'vehicle') return false
      if (filters.productType === 'batteries' && product.type !== 'battery') return false
    }

    // Price range filter
    const price = parseFloat(product.price.replace(/[$,]/g, ''))
    if (filters.minPrice && price < parseFloat(filters.minPrice)) return false
    if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false

    // Battery health filter (only for batteries)
    if (product.type === 'battery') {
      if (product.batteryHealth !== undefined && product.batteryHealth < filters.batteryHealth) {
        return false
      }
    }

    // Verified only filter
    if (filters.verifiedOnly && !product.verified) return false

    return true
  })

  // Get available brands from products
  const availableBrands = [...new Set(products.map(p => p.brand))].sort()

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      productType: 'all',
      minPrice: '',
      maxPrice: '',
      brands: [],
      batteryHealth: 50,
      verifiedOnly: false
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Browse Header */}
      <BrowseHeader 
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        isFilterOpen={isFilterOpen}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Filters Sidebar - Left */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <BrowseFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              isOpen={isFilterOpen}
              availableBrands={availableBrands}
              className="lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto"
            />
          </div>

          {/* Products Grid - Right */}
          <div className="flex-1 min-w-0">
            <div className="p-6">
              <ProductGrid 
                products={filteredProducts}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
     
      <Footer />
    </div>
  )
}

export default BrowsePageContent
