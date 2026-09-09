export type FlagCode = 'france' | 'japan' | 'brazil' | 'egypt' | 'usa' | 'australia' | 'sweden'

export interface Flight {
  airline: string
  flightNumber: string
  originCode: string
  originCity: string
  destCode: string
  destCity: string
  departure: string
  arrival: string
  duration: string
  price: string
  priceValue: number
  seatsRemaining: number
  flag: FlagCode
}
