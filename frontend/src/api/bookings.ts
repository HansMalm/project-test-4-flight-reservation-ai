import type { ApiFlight } from './flights'

export interface PassengerInput {
  name: string
  isChild: boolean
}

export interface CreateBookingRequest {
  flightNumber: string
  contactName: string
  contactEmail: string
  passengers: PassengerInput[]
}

export type BookingStatus = 'CONFIRMED' | 'CANCELLED'

export interface ApiBooking {
  bookingReference: string
  flight: ApiFlight
  contactName: string
  contactEmail: string
  passengers: PassengerInput[]
  totalPrice: number
  status: BookingStatus
  bookedAt: string
}

/**
 * Pulls a human-readable message out of a failed response. The backend sends
 * errors as RFC 7807 ProblemDetail JSON ({ title, status, detail }), so we
 * prefer `detail`; if the body isn't JSON we fall back to the status line.
 */
async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const problem = await res.json()
    if (typeof problem?.detail === 'string') return problem.detail
  } catch {
    /* body wasn't JSON */
  }
  return `${fallback}: ${res.status} ${res.statusText}`
}

export async function createBooking(
  body: CreateBookingRequest,
): Promise<ApiBooking> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(await readError(res, 'Failed to create booking'))
  }

  return (await res.json()) as ApiBooking
}

export async function fetchBookings(email: string): Promise<ApiBooking[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/bookings?email=${encodeURIComponent(email)}`,
  )

  if (!res.ok) {
    throw new Error(await readError(res, 'Failed to fetch bookings'))
  }

  return (await res.json()) as ApiBooking[]
}

export async function cancelBooking(bookingReference: string): Promise<void> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/bookings/${encodeURIComponent(bookingReference)}`,
    { method: 'DELETE' },
  )

  if (!res.ok) {
    throw new Error(await readError(res, 'Failed to cancel booking'))
  }
}
