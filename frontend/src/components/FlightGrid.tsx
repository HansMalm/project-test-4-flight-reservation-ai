import { useState, useEffect, useCallback } from 'react'
import { fetchFlights } from '../api/flights'
import { toDisplayFlight } from '../utils/toDisplayFlight'
import type { Flight } from '../data/flights'
import FlightCard from './FlightCard'
import './FlightGrid.css'

interface FlightGridProps {
  priceRange: [number, number]
  onlyAvailable: boolean
}

function FlightGrid({ priceRange, onlyAvailable }: FlightGridProps) {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useCallback keeps this the same function between renders, so the useEffect
  // below only re-runs when `onlyAvailable` changes (toggling the filter
  // re-fetches). The grid also re-fetches whenever FlightsPage remounts, e.g.
  // after returning from the booking page, so seat counts stay fresh.
  const reload = useCallback(() => {
    let cancelled = false

    fetchFlights(onlyAvailable)
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
  }, [onlyAvailable])

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
    <section className="flight-grid" id="flights">
      {visibleFlights.map((flight) => (
        <FlightCard key={flight.flightNumber} flight={flight} />
      ))}
    </section>
  )
}

export default FlightGrid
