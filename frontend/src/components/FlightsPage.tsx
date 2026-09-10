import { useState } from 'react'
import Sidebar from './Sidebar'
import FlightGrid from './FlightGrid'

function FlightsPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [onlyAvailable, setOnlyAvailable] = useState(true)

  return (
    <div className="layout">
      <Sidebar
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        onlyAvailable={onlyAvailable}
        onAvailabilityChange={setOnlyAvailable}
      />
      <FlightGrid priceRange={priceRange} onlyAvailable={onlyAvailable} />
    </div>
  )
}

export default FlightsPage
