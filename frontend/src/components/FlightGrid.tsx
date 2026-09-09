import { useState, useEffect } from 'react'
import { fetchFlights } from '../api/flights'
import { toDisplayFlight } from '../utils/toDisplayFlight'
import type { Flight } from '../data/flights'
import FlightCard from './FlightCard'
import './FlightGrid.css'

function FlightGrid() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchFlights()
      .then((apiFlights) => {
        if (cancelled) return
        setFlights(apiFlights.map(toDisplayFlight))
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

  if (loading) {
    return <p className="flight-grid-status">Loading flights…</p>
  }

  if (error) {
    return <p className="flight-grid-status">{error}</p>
  }

  if (flights.length === 0) {
    return <p className="flight-grid-status">No flights were found.</p>
  }

  return (
    <section className="flight-grid" id="flights">
      {flights.map((flight) => (
        <FlightCard key={flight.flightNumber} flight={flight} />
      ))}
    </section>
  )
}

export default FlightGrid
