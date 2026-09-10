import { useState } from 'react'
import type { ApiBooking } from '../api/bookings'
import { toDisplayFlight } from '../utils/toDisplayFlight'
import './BookingCard.css'

interface BookingCardProps {
  booking: ApiBooking
  onCancel: (bookingReference: string) => void
  cancelling: boolean
}

function BookingCard({ booking, onCancel, cancelling }: BookingCardProps) {
  const flight = toDisplayFlight(booking.flight)
  const isConfirmed = booking.status === 'CONFIRMED'
  const [confirming, setConfirming] = useState(false)

  function handleConfirmCancel() {
    setConfirming(false)
    onCancel(booking.bookingReference)
  }

  return (
    <article className="booking-card">
      <div className="booking-card-head">
        <span className="booking-card-ref">{booking.bookingReference}</span>
        <span
          className={`booking-status booking-status-${booking.status.toLowerCase()}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="booking-card-route">
        <span className="cities">{flight.originCity}</span>
        <span className="arrow">→</span>
        <span className="cities">{flight.destCity}</span>
        <span className="code">
          {flight.originCode} – {flight.destCode}
        </span>
      </div>

      <div className="booking-card-details">
        <span>
          {flight.departure} – {flight.arrival}
        </span>
        <span>{flight.flightNumber}</span>
      </div>

      <ul className="booking-card-passengers">
        {booking.passengers.map((passenger, index) => (
          <li key={index}>
            {passenger.name}
            {passenger.isChild && <span className="child-tag"> (child)</span>}
          </li>
        ))}
      </ul>

      <div className="booking-card-footer">
        <span className="price">{formatTotal(booking.totalPrice)}</span>
        {isConfirmed && !confirming && (
          <button
            type="button"
            className="book-btn"
            disabled={cancelling}
            onClick={() => setConfirming(true)}
          >
            Cancel booking
          </button>
        )}
        {isConfirmed && confirming && (
          <div className="booking-card-confirm">
            <span>Cancel this booking?</span>
            <button
              type="button"
              className="book-btn"
              disabled={cancelling}
              onClick={handleConfirmCancel}
            >
              {cancelling ? 'Cancelling…' : 'Yes, cancel'}
            </button>
            <button
              type="button"
              className="book-btn-outline"
              disabled={cancelling}
              onClick={() => setConfirming(false)}
            >
              Never mind
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

function formatTotal(total: number): string {
  const formatted = new Intl.NumberFormat('sv-SE').format(total)
  return `${formatted} kr`
}

export default BookingCard
