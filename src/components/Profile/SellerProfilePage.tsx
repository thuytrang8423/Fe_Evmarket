"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import colors from '../../Utils/Color'
import { useI18nContext } from '../../providers/I18nProvider'
import { getSellerProfile, type SellerProfile as SellerProfileType, type Review } from '../../services'
import SellerProfileHeader from './SellerProfile/SellerProfileHeader'
import SellerStatistics from './SellerProfile/SellerStatistics'
import ReviewCard from './SellerProfile/ReviewCard'

function SellerProfilePage() {
  const params = useParams()
  const { t } = useI18nContext()
  const [sellerData, setSellerData] = useState<{seller: SellerProfileType, reviews: Review[]} | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const sellerId = params.id as string
        const response = await getSellerProfile(sellerId)
        
        if (response.success && response.data) {
          setSellerData(response.data)
        } else {
          setError(response.message || 'Failed to fetch seller profile')
        }
      } catch (err) {
        setError('Failed to fetch seller profile')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSellerProfile()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4" style={{color: colors.SubText}}>{t('sellerProfile.loadingProfile')}</p>
        </div>
      </div>
    )
  }

  if (error || !sellerData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || t('sellerProfile.profileNotFound')}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('sellerProfile.goBack')}
          </button>
        </div>
      </div>
    )
  }

  const { seller, reviews } = sellerData

  return (
    <div className="min-h-screen" style={{backgroundColor: colors.Background}}>


      {/* Hero Section */}
      <SellerProfileHeader seller={seller} reviews={reviews} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statistics Sidebar */}
          <div className="lg:col-span-1">
            <SellerStatistics reviews={reviews} />
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold" style={{color: colors.Text}}>
                {t('sellerProfile.customerReviews')}
              </h2>
              <p className="mt-2" style={{color: colors.SubText}}>
                {t('sellerProfile.reviewsDescription')}
              </p>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
                <ImageIcon size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2" style={{color: colors.Text}}>
                  {t('sellerProfile.noReviewsYet')}
                </h3>
                <p style={{color: colors.SubText}}>
                  {t('sellerProfile.noReviewsDescription')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerProfilePage