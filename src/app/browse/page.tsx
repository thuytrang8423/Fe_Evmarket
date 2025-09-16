"use client"
import React, { useState } from 'react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import BrowseHeader from '../../components/Browse/BrowseHeader'
import BrowseFilters from '../../components/Browse/BrowseFilters'
import ProductGrid from '../../components/Browse/ProductGrid'

export default function BrowsePage() {
  const [filters, setFilters] = useState({
    search: '',
    productType: 'all',
    minPrice: '',
    maxPrice: '',
    brands: [] as string[],
    batteryHealth: 50,
    verifiedOnly: false
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleFilterChange = (newFilters: typeof filters) => {
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
              className="lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto"
            />
          </div>

          {/* Products Grid - Right */}
          <div className="flex-1 min-w-0">
            <div className="p-6">
              <ProductGrid />
            </div>
          </div>
        </div>
      </div>
     
      <Footer />
    </div>
  )
}