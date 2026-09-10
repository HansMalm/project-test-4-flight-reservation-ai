import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <span className="navbar-brand">Around the World</span>
      <nav className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Flights
        </NavLink>
        <NavLink to="/bookings" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          My Bookings
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
