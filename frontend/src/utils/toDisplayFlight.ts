import type { ApiFlight } from '../api/flights'
import type { Flight } from '../data/flights'
import { AIRPORTS } from '../data/airports'

const AIRLINE_NAME = 'Around the World Air'

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatDuration(departureIso: string, arrivalIso: string): string {
  const diffMs = new Date(arrivalIso).getTime() - new Date(departureIso).getTime()
  const totalMinutes = Math.round(diffMs / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

function formatArrival(departureIso: string, arrivalIso: string): string {
  const departure = new Date(departureIso)
  const arrival = new Date(arrivalIso)
  const departureDay = new Date(
    departure.getFullYear(),
    departure.getMonth(),
    departure.getDate(),
  )
  const arrivalDay = new Date(
    arrival.getFullYear(),
    arrival.getMonth(),
    arrival.getDate(),
  )
  const dayDiff = Math.round(
    (arrivalDay.getTime() - departureDay.getTime()) / 86400000,
  )
  return dayDiff >= 1 ? `${formatTime(arrivalIso)} +1` : formatTime(arrivalIso)
}

function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat('sv-SE').format(price).replace(/\s/g, ' ')
  return `from ${formatted} kr`
}

export function toDisplayFlight(apiFlight: ApiFlight): Flight {
  const origin = AIRPORTS[apiFlight.origin]
  const destination = AIRPORTS[apiFlight.destination]

  return {
    airline: AIRLINE_NAME,
    flightNumber: apiFlight.flightNumber,
    originCode: apiFlight.origin,
    originCity: origin?.city ?? apiFlight.origin,
    destCode: apiFlight.destination,
    destCity: destination?.city ?? apiFlight.destination,
    departure: formatTime(apiFlight.departureTime),
    arrival: formatArrival(apiFlight.departureTime, apiFlight.arrivalTime),
    duration: formatDuration(apiFlight.departureTime, apiFlight.arrivalTime),
    price: formatPrice(apiFlight.price),
    priceValue: apiFlight.price,
    flag: destination?.flag ?? 'france',
  }
}
