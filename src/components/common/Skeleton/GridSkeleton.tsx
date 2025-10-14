import React from 'react'
import CardSkeleton from './CardSkeleton'

interface GridSkeletonProps {
  count?: number
  columns?: 2 | 3 | 4
  showBadge?: boolean
  className?: string
}

export default function GridSkeleton({ 
  count = 4, 
  columns = 4, 
  showBadge = false,
  className = '' 
}: GridSkeletonProps) {
  const gridColsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }[columns]

  return (
    <div className={`grid grid-cols-1 ${gridColsClass} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} showBadge={showBadge} />
      ))}
    </div>
  )
}
