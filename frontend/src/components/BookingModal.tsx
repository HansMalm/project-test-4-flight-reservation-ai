import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Flight } from '../data/flights'
import type { PassengerInput } from '../api/bookings'
import { createBooking } from '../api/bookings'
import './BookingModal.css'

interface BookingModalProps {
  flight: Flight
  onClose: () => void
  onBooked: () => void
}

function BookingModal({ flight, onClose, onBooked }: BookingModalProps) {
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [passengers, setPassengers] = useState<PassengerInput[]>([
    { name: '', isChild: false },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingReference, setBookingReference] = useState<string | null>(null)

  // Close the modal when the user presses Escape. The cleanup function removes
  // the listener when the modal unmounts so it doesn't pile up.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function updatePassenger(index: number, changes: Partial<PassengerInput>) {
    setPassengers((current) =>
      current.map((passenger, i) =>
        i === index ? { ...passenger, ...changes } : passenger,
      ),
    )
  }

  function addPassenger() {
    setPassengers((current) => [...current, { name: '', isChild: false }])
  }

  function removePassenger(index: number) {
    setPassengers((current) => current.filter((_, i) => i !== index))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const booking = await createBooking({
        flightNumber: flight.flightNumber,
        contactName,
        contactEmail,
        passengers,
      })
      setBookingReference(booking.bookingReference)
      onBooked()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not complete the booking.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Book flight ${flight.flightNumber}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        {bookingReference ? (
          <div className="booking-success">
            <h2>Booking confirmed</h2>
            <p>Your booking reference is:</p>
            <p className="booking-reference">{bookingReference}</p>
            <p className="booking-success-hint">
              Keep it safe — you'll need it to view or cancel this booking.
            </p>
            <button type="button" className="book-btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <h2>
              Book {flight.originCity} → {flight.destCity}
            </h2>
            <p className="booking-form-flight">
              {flight.departure} – {flight.arrival} · {flight.flightNumber} ·{' '}
              {flight.price}
            </p>

            <label className="booking-field">
              <span>Contact name</span>
              <input
                type="text"
                required
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
              />
            </label>

            <label className="booking-field">
              <span>Contact email</span>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
              />
            </label>

            <fieldset className="booking-passengers">
              <legend>Passengers</legend>
              {passengers.map((passenger, index) => (
                <div className="booking-passenger" key={index}>
                  <input
                    type="text"
                    required
                    placeholder="Passenger name"
                    value={passenger.name}
                    onChange={(event) =>
                      updatePassenger(index, { name: event.target.value })
                    }
                  />
                  <label className="booking-child">
                    <input
                      type="checkbox"
                      checked={passenger.isChild}
                      onChange={(event) =>
                        updatePassenger(index, { isChild: event.target.checked })
                      }
                    />
                    Child
                  </label>
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      className="booking-remove"
                      onClick={() => removePassenger(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="booking-add"
                onClick={addPassenger}
              >
                + Add passenger
              </button>
            </fieldset>

            {error && <p className="booking-error">{error}</p>}

            <button type="submit" className="book-btn" disabled={submitting}>
              {submitting ? 'Booking…' : 'Confirm booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default BookingModal
