import React from 'react'
import CardSkeleton from './CardSkeleton'

interface ListSkeletonProps {
  count?: number
  showBadge?: boolean
  className?: string
}

export default function ListSkeleton({ 
  count = 8, 
  showBadge = false,
  className = '' 
}: ListSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} showBadge={showBadge} />
      ))}
    </div>
  )
}
