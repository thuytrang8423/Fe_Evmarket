"use client"
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Checkout from '@/components/CheckOutpage/Checkout'
import AuthWrapper from '@/components/common/AuthWrapper'

export default function CheckoutPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Checkout />
        <Footer />
      </div>
    </AuthWrapper>
  )
}
