import Header from "@/components/Header"
import Footer from "@/components/Footer"
import AuctionPage from "@/components/AuctionPage/AuctionPage"

export default function Auction() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="py-6">
        <AuctionPage />
      </main>
      <Footer />
    </div>
  )
}

