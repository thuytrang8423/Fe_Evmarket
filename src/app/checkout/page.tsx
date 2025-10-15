import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Checkout from '@/components/CheckOutpage/Checkout'


export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Checkout />
      <Footer />
    </div>
  )
}
