"use client"

import Image from "next/image"
import React, { useEffect, useMemo, useState } from "react"

type Bid = {
  user: string
  amount: number
  timeAgo: string
}

type SpecRow = {
  label: string
  value: string
}

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })

const AuctionPage: React.FC = () => {
  // Mock data – replace with real data from your services when ready
  const [highestBid, setHighestBid] = useState<number>(29500)
  const [minIncrement] = useState<number>(100)
  const [buyNowPrice] = useState<number>(35000)
  const [bidAmount, setBidAmount] = useState<number>(highestBid + minIncrement)
  const [activeTab, setActiveTab] = useState<"specs" | "description" | "rules" | "reviews">("specs")

  // Auction end time – 3 hours from now
  const endTime = useMemo(() => Date.now() + 3 * 60 * 60 * 1000, [])
  const [remaining, setRemaining] = useState<number>(endTime - Date.now())

  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, endTime - Date.now())), 1000)
    return () => clearInterval(id)
  }, [endTime])

  const timeLeft = useMemo(() => {
    const total = Math.max(0, remaining)
    const hours = Math.floor(total / (1000 * 60 * 60))
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((total % (1000 * 60)) / 1000)
    const pad = (v: number) => v.toString().padStart(2, "0")
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }, [remaining])

  const recentBids: Bid[] = [
    { user: "john_pro_buyer", amount: 29500, timeAgo: "2 mins ago" },
    { user: "tesla_fan_2024", amount: 29000, timeAgo: "10 mins ago" },
    { user: "green_driver", amount: 28500, timeAgo: "22 mins ago" },
    { user: "ev_collector", amount: 28000, timeAgo: "27 mins ago" },
    { user: "battery_expert", amount: 27500, timeAgo: "35 mins ago" },
  ]

  const leftSpecs: SpecRow[] = [
    { label: "Make", value: "Tesla" },
    { label: "Model", value: "Model 3" },
    { label: "Trim", value: "Standard Range Plus" },
    { label: "Year", value: "2020" },
    { label: "VIN", value: "5YJ3E1EA7LF******" },
    { label: "Color", value: "Pearl White Multi-Coat" },
  ]
  const rightSpecs: SpecRow[] = [
    { label: "Range (EPA)", value: "263 miles" },
    { label: "Battery Capacity", value: "54 kWh" },
    { label: "Battery Health", value: "92% SoH" },
    { label: "0–60 mph", value: "5.3 seconds" },
    { label: "Top Speed", value: "140 mph" },
    { label: "Drivetrain", value: "RWD" },
  ]

  const handlePlaceBid = () => {
    if (bidAmount < highestBid + minIncrement) return
    setHighestBid(bidAmount)
    setBidAmount(bidAmount + minIncrement)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: media + details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image/Gallery card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px]">
              <Image
                src="https://images.unsplash.com/photo-1606660480040-4c1cde1b3b8b?q=80&w=1600&auto=format&fit=crop"
                alt="Vehicle"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4 flex gap-2 flex-wrap">
              {[
                "Front View",
                "Interior View",
                "Side View",
                "Rear View",
              ].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Title + quick facts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              2020 Tesla Model 3 Standard Range Plus
            </h1>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <span className="text-gray-500">Year</span>
                <span className="ml-auto font-medium">2020</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <span className="text-gray-500">Mileage</span>
                <span className="ml-auto font-medium">30,450 miles</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <span className="text-gray-500">Battery Health</span>
                <span className="ml-auto font-medium">92% SoH</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <span className="text-gray-500">Condition</span>
                <span className="ml-auto font-medium">Excellent</span>
              </div>
            </div>
          </div>

          {/* Seller info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Seller Information</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">JD</div>
                <div>
                  <div className="font-medium text-gray-900">John Davis</div>
                  <div className="text-sm text-gray-500">4.8 • 127 reviews</div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Contact Seller</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-5 pt-4 border-b">
              <div className="flex gap-4 overflow-x-auto">
                {(
                  [
                    { key: "specs", label: "Specifications" },
                    { key: "description", label: "Description" },
                    { key: "rules", label: "Auction Rules" },
                    { key: "reviews", label: "Reviews" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-3 py-2 text-sm border-b-2 -mb-px ${
                      activeTab === t.key
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5">
              {activeTab === "specs" && (
                <div className="bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Vehicle Details</h3>
                      <dl className="divide-y rounded-lg border">
                        {leftSpecs.map((row) => (
                          <div key={row.label} className="flex items-center justify-between p-3">
                            <dt className="text-gray-500">{row.label}</dt>
                            <dd className="font-medium text-gray-900">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Performance & Battery</h3>
                      <dl className="divide-y rounded-lg border">
                        {rightSpecs.map((row) => (
                          <div key={row.label} className="flex items-center justify-between p-3">
                            <dt className="text-gray-500">{row.label}</dt>
                            <dd className="font-medium text-gray-900">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "description" && (
                <div className="prose max-w-none text-gray-700">
                  <p>
                    Impeccably maintained Model 3 with low mileage, clean interior, and excellent battery health. Single owner, no accidents, full service history available.
                  </p>
                </div>
              )}

              {activeTab === "rules" && (
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Minimum bid increment: {currency(minIncrement)}</li>
                  <li>Winning bidder must complete payment within 48 hours.</li>
                  <li>Vehicle inspection available upon request prior to auction end.</li>
                  <li>All bids are binding and cannot be retracted.</li>
                </ul>
              )}

              {activeTab === "reviews" && (
                <div className="text-gray-700">No reviews yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: bidding panel */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="text-sm text-gray-500">Current Highest Bid</div>
              <div className="text-3xl font-bold text-emerald-600 mt-1">{currency(highestBid)}</div>

              <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <div>
                  <div className="text-sm font-medium text-amber-800">Auction ends in</div>
                  <div className="text-lg font-semibold text-amber-900">{timeLeft}</div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">Minimum bid increment: {currency(minIncrement)}</div>

              <label className="block text-sm font-medium text-gray-700 mt-4">Your bid amount</label>
              <div className="mt-2 flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-gray-50 text-gray-500">$</span>
                <input
                  type="number"
                  className="w-full rounded-r-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={bidAmount}
                  min={highestBid + minIncrement}
                  step={minIncrement}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                />
              </div>

              <button
                onClick={handlePlaceBid}
                disabled={bidAmount < highestBid + minIncrement}
                className="mt-3 w-full py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-[#22C55E] to-[#2563EB] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Place Bid
              </button>

              <button
                className="mt-2 w-full py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-[#22C55E] to-[#2563EB] hover:opacity-90"
              >
                Buy Now – {currency(buyNowPrice)}
              </button>

              <div className="mt-6">
                <div className="text-sm font-semibold text-gray-900 mb-3">Recent Bids</div>
                <ul className="space-y-2">
                  {recentBids.map((b) => (
                    <li key={b.user} className="flex items-center justify-between text-sm">
                      <a className="text-emerald-700 hover:underline" href="#">{b.user}</a>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{b.timeAgo}</span>
                        <span className="font-medium text-emerald-700">{currency(b.amount)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionPage

