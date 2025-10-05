"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { 
  Star, 
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import colors from '../../../Utils/Color'
import { useI18nContext } from '../../../providers/I18nProvider'
import { type Review } from '../../../services'

interface ReviewCardProps {
  review: Review
}

function ReviewCard({ review }: ReviewCardProps) {
  const { t } = useI18nContext()
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [showMediaModal, setShowMediaModal] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index}
        size={16} 
        className={index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ))
  }

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('video')
  }

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === review.mediaUrls.length - 1 ? 0 : prev + 1
    )
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === 0 ? review.mediaUrls.length - 1 : prev - 1
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            {review.buyer.avatar ? (
              <Image
                src={review.buyer.avatar}
                alt={review.buyer.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
                <span className="text-white text-sm font-bold">
                  {review.buyer.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold" style={{color: colors.Text}}>
              {review.buyer.name}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm" style={{color: colors.SubText}}>
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {review.hasBeenEdited && (
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {t('sellerProfile.edited')}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium" style={{color: colors.Text}}>
          {t('sellerProfile.product')}: {review.productTitle}
        </p>
        <p className="text-xs" style={{color: colors.SubText}}>
          {t('sellerProfile.type')}: {review.type}
        </p>
      </div>

      {/* Review Comment */}
      <p className="mb-4 leading-relaxed" style={{color: colors.Description}}>
        {/* Filter out transaction reference text */}
        {review.comment.replace(/Review for transaction [a-zA-Z0-9]+/g, '').trim() || t('sellerProfile.greatExperience')}
      </p>

      {/* Media Gallery */}
      {review.mediaUrls && review.mediaUrls.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {isVideo(review.mediaUrls[currentMediaIndex]) ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <source src={review.mediaUrls[currentMediaIndex]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <Image
                  src={review.mediaUrls[currentMediaIndex]}
                  alt="Review media"
                  fill
                  className="object-cover cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setShowMediaModal(true)}
                />
              )}
            </div>
            
            {review.mediaUrls.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          
          {review.mediaUrls.length > 1 && (
            <div className="flex justify-center gap-2">
              {review.mediaUrls.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentMediaIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReviewCard