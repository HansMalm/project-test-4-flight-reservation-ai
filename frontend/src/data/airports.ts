import type { FlagCode } from './flights'

export interface AirportInfo {
  city: string
  flag: FlagCode
}

export const AIRPORTS: Record<string, AirportInfo> = {
  ARN: { city: 'Stockholm', flag: 'sweden' },
  CDG: { city: 'Paris', flag: 'france' },
  JFK: { city: 'New York', flag: 'usa' },
  HND: { city: 'Tokyo', flag: 'japan' },
  SYD: { city: 'Sydney', flag: 'australia' },
}
