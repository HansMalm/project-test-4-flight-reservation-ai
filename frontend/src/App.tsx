import { useState } from 'react'
import Navbar from './components/Navbar'
import type { View } from './components/Navbar'
import Hero from './components/Hero'
import Sidebar from './components/Sidebar'
import FlightGrid from './components/FlightGrid'
import MyBookings from './components/MyBookings'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

function App() {
  const [view, setView] = useState<View>('flights')

  return (
    <>
      <Navbar view={view} onNavigate={setView} />
      <Hero />
      {view === 'flights' ? (
        <div className="layout">
          <Sidebar />
          <FlightGrid />
        </div>
      ) : (
        <MyBookings />
      )}
      <Footer />
      <ChatWidget />
    </>
  )
}

export default App
