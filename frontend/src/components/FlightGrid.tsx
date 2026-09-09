import { useState, useEffect, useCallback } from 'react'
import { fetchFlights } from '../api/flights'
import { toDisplayFlight } from '../utils/toDisplayFlight'
import type { Flight } from '../data/flights'
import FlightCard from './FlightCard'
import BookingModal from './BookingModal'
import './FlightGrid.css'

interface FlightGridProps {
  priceRange: [number, number]
}

function FlightGrid({ priceRange }: FlightGridProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingFlight, setBookingFlight] = useState<Flight | null>(null)

  // useCallback keeps this the same function between renders, so the useEffect
  // below doesn't re-run on every render. We also call reload() after a
  // successful booking to pick up the reduced seat counts — it only touches
  // `flights`/`error`, never `loading`, so the grid (and the open modal on top
  // of it) stays mounted.
  const reload = useCallback(() => {
    let cancelled = false

    fetchFlights()
      .then((apiFlights) => {
        if (cancelled) return
        setFlights(apiFlights.map(toDisplayFlight))
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setError(
          err instanceof Error ? err.message : 'Could not load flights.',
        )
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => reload(), [reload])

  if (loading) {
    return <p className="flight-grid-status">Loading flights…</p>
  }

  if (error) {
    return <p className="flight-grid-status">{error}</p>
  }

  const [minPrice, maxPrice] = priceRange
  const visibleFlights = flights.filter(
    (flight) => flight.priceValue >= minPrice && flight.priceValue <= maxPrice,
  )

  if (visibleFlights.length === 0) {
    return <p className="flight-grid-status">No flights were found.</p>
  }

  return (
    <>
      <section className="flight-grid" id="flights">
        {visibleFlights.map((flight) => (
          <FlightCard
            key={flight.flightNumber}
            flight={flight}
            onBook={setBookingFlight}
          />
        ))}
      </section>

      {bookingFlight && (
        <BookingModal
          flight={bookingFlight}
          onClose={() => setBookingFlight(null)}
          onBooked={reload}
        />
      )}
    </>
  )
}

export default FlightGrid
