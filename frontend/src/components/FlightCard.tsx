import type { Flight } from '../data/flights'
import CountryFlag from './CountryFlag'
import './FlightCard.css'

interface FlightCardProps {
  flight: Flight
  onBook: (flight: Flight) => void
}

function FlightCard({ flight, onBook }: FlightCardProps) {
  return (
    <article className="flight-card">
      <div className="flight-card-flag">
        <CountryFlag code={flight.flag} />
      </div>

      <div className="flight-card-route">
        <div className="flight-card-airport">
          <span className="code">{flight.originCode}</span>
          <span className="city">{flight.originCity}</span>
        </div>

        <div className="flight-card-line">
          <span className="dash" />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12h15" />
            <path d="M13 6l6 6-6 6" />
          </svg>
          <span className="dash" />
        </div>

        <div className="flight-card-airport">
          <span className="code">{flight.destCode}</span>
          <span className="city">{flight.destCity}</span>
        </div>
      </div>

      <div className="flight-card-details">
        <span>{flight.departure} – {flight.arrival}</span>
        <span>{flight.duration}</span>
        <span>{flight.airline} · {flight.flightNumber}</span>
      </div>

      <div className="flight-card-footer">
        <span className="price">{flight.price}</span>
        <button
          type="button"
          className="book-btn"
          onClick={() => onBook(flight)}
          disabled={flight.seatsRemaining === 0}
        >
          {flight.seatsRemaining === 0 ? 'Full' : 'Book'}
        </button>
      </div>
    </article>
  )
}

export default FlightCard
