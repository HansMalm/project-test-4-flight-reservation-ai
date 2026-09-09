import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ApiBooking } from '../api/bookings'
import { fetchBookings, cancelBooking } from '../api/bookings'
import BookingCard from './BookingCard'
import './MyBookings.css'

function MyBookings() {
  const [email, setEmail] = useState('')
  const [query, setQuery] = useState<string | null>(null)
  const [bookings, setBookings] = useState<ApiBooking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cancellingReference, setCancellingReference] = useState<string | null>(
    null,
  )

  async function load(searchEmail: string) {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchBookings(searchEmail)
      setBookings(result)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load bookings.',
      )
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return
    setQuery(trimmed)
    load(trimmed)
  }

  async function handleCancel(bookingReference: string) {
    setCancellingReference(bookingReference)
    setError(null)
    try {
      await cancelBooking(bookingReference)
      if (query) await load(query)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not cancel the booking.',
      )
    } finally {
      setCancellingReference(null)
    }
  }

  return (
    <section className="my-bookings" id="bookings">
      <h2 className="my-bookings-title">My Bookings</h2>

      <form className="my-bookings-form" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit" className="book-btn">
          Find bookings
        </button>
      </form>

      {loading && <p className="my-bookings-status">Loading bookings…</p>}

      {!loading && error && <p className="my-bookings-status">{error}</p>}

      {!loading && !error && query !== null && bookings.length === 0 && (
        <p className="my-bookings-status">No bookings found for {query}.</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="my-bookings-list">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.bookingReference}
              booking={booking}
              onCancel={handleCancel}
              cancelling={cancellingReference === booking.bookingReference}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default MyBookings
