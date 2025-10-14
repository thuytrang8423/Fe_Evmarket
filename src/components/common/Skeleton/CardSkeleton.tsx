import React from 'react'

interface CardSkeletonProps {
  showBadge?: boolean
  className?: string
}

export default function CardSkeleton({ showBadge = false, className = '' }: CardSkeletonProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden animate-pulse ${className}`}>
      {/* Image Skeleton */}
      <div className="relative h-48 bg-gray-200">
        {showBadge && (
          <div className="absolute top-3 right-3 h-6 w-20 bg-gray-300 rounded-full"></div>
        )}
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        
        {/* Subtitle/Description */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        
        {/* Stats/Specs Row */}
        <div className="flex gap-4 pt-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Price */}
        <div className="pt-3 border-t border-gray-100">
          <div className="h-6 bg-gray-300 rounded w-28"></div>
        </div>
      </div>
    </div>
  )
}
