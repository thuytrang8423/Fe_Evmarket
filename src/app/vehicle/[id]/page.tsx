import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import CarDetailPage from '../../../components/CarDetailpage/CarDetailPage'

export default function CarPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <CarDetailPage />
      <Footer />
    </>
  )
}
