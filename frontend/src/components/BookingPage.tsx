import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { ApiFlight } from '../api/flights'
import { fetchFlightByNumber } from '../api/flights'
import type { PassengerInput } from '../api/bookings'
import { createBooking } from '../api/bookings'
import { toDisplayFlight } from '../utils/toDisplayFlight'
import './BookingPage.css'

type Step = 'form' | 'review' | 'success'

function BookingPage() {
  const { flightNumber } = useParams()

  const [flight, setFlight] = useState<ApiFlight | null>(null)
  const [loadingFlight, setLoadingFlight] = useState(true)
  const [flightError, setFlightError] = useState(false)

  const [step, setStep] = useState<Step>('form')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [passengers, setPassengers] = useState<PassengerInput[]>([
    { name: '', isChild: false },
  ])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingReference, setBookingReference] = useState<string | null>(null)

  // Resolve the flight straight from the URL param, so a shared /book/FR1001
  // link works without the flights list ever being loaded. Runs once on mount
  // (you always arrive here fresh — from a flight card link or a direct URL);
  // `cancelled` guards against a late state update if it unmounts mid-fetch.
  // Same shape as FlightGrid's loader — state starts in its loading value and
  // is only touched from the callbacks.
  useEffect(() => {
    if (!flightNumber) return
    let cancelled = false

    fetchFlightByNumber(flightNumber)
      .then((result) => {
        if (cancelled) return
        setFlight(result)
        setFlightError(false)
      })
      .catch(() => {
        if (cancelled) return
        setFlightError(true)
      })
      .finally(() => {
        if (cancelled) return
        setLoadingFlight(false)
      })

    return () => {
      cancelled = true
    }
  }, [flightNumber])

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

  // The form submit no longer calls the API — native `required` validation
  // runs, then we move on to the review step.
  function handleReview(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setStep('review')
  }

  async function handleConfirm() {
    if (!flight) return
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
      setStep('success')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not complete the booking.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingFlight) {
    return (
      <section className="booking-page">
        <p className="booking-page-status">Loading flight…</p>
      </section>
    )
  }

  if (flightError || !flight) {
    return (
      <section className="booking-page">
        <p className="booking-page-status">Flight not found.</p>
        <p>
          <Link to="/">Back to flights</Link>
        </p>
      </section>
    )
  }

  const display = toDisplayFlight(flight)
  const total = display.priceValue * passengers.length

  return (
    <section className="booking-page">
      {step === 'success' ? (
        <div className="booking-success">
          <h2>Booking confirmed</h2>
          <p>Your booking reference is:</p>
          <p className="booking-reference">{bookingReference}</p>
          <p className="booking-success-hint">
            Look it up anytime on My Bookings using your email.
          </p>
          <div className="booking-success-links">
            <Link to="/">Back to flights</Link>
            <Link to="/bookings">My Bookings</Link>
          </div>
        </div>
      ) : step === 'review' ? (
        <div className="booking-review">
          <h2>
            Review — {display.originCity} → {display.destCity}
          </h2>
          <p className="booking-form-flight">
            {display.departure} – {display.arrival} · {flight.flightNumber} ·{' '}
            {display.price}
          </p>

          <dl className="booking-review-contact">
            <dt>Contact name</dt>
            <dd>{contactName}</dd>
            <dt>Contact email</dt>
            <dd>{contactEmail}</dd>
          </dl>

          <ul className="booking-review-passengers">
            {passengers.map((passenger, index) => (
              <li key={index}>
                {passenger.name}
                {passenger.isChild && <span className="child-tag"> (child)</span>}
              </li>
            ))}
          </ul>

          <p className="booking-review-total">Total: {formatTotal(total)}</p>

          {error && <p className="booking-error">{error}</p>}

          <div className="booking-review-actions">
            <button
              type="button"
              className="booking-add"
              onClick={() => setStep('form')}
              disabled={submitting}
            >
              Edit
            </button>
            <button
              type="button"
              className="book-btn"
              onClick={handleConfirm}
              disabled={submitting}
            >
              {submitting ? 'Booking…' : 'Confirm and book'}
            </button>
          </div>
        </div>
      ) : (
        <form className="booking-form" onSubmit={handleReview}>
          <h2>
            Book {display.originCity} → {display.destCity}
          </h2>
          <p className="booking-form-flight">
            {display.departure} – {display.arrival} · {flight.flightNumber} ·{' '}
            {display.price}
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
            <button type="button" className="booking-add" onClick={addPassenger}>
              + Add passenger
            </button>
          </fieldset>

          <button type="submit" className="book-btn">
            Review booking
          </button>
        </form>
      )}
    </section>
  )
}

// Same formatting as BookingCard's total (Swedish grouping + " kr").
function formatTotal(total: number): string {
  const formatted = new Intl.NumberFormat('sv-SE').format(total)
  return `${formatted} kr`
}

export default BookingPage
