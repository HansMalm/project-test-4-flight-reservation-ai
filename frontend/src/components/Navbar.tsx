import './Navbar.css'

export type View = 'flights' | 'bookings'

interface NavbarProps {
  view: View
  onNavigate: (view: View) => void
}

function Navbar({ view, onNavigate }: NavbarProps) {
  return (
    <header className="navbar">
      <span className="navbar-brand">Around the World</span>
      <nav className="navbar-links">
        <button
          type="button"
          className={view === 'flights' ? 'active' : undefined}
          onClick={() => onNavigate('flights')}
        >
          Flights
        </button>
        <button
          type="button"
          className={view === 'bookings' ? 'active' : undefined}
          onClick={() => onNavigate('bookings')}
        >
          My Bookings
        </button>
      </nav>
    </header>
  )
}

export default Navbar
