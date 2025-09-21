import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import PinDetailPage from '../../../components/PinDetailpage/PinDetailPage'

export default function PinPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <PinDetailPage />
      <Footer />
    </>
  )
}
