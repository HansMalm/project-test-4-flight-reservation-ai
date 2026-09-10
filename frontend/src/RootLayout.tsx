import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

function RootLayout() {
  return (
    <>
      <Navbar />
      <Hero />
      <Outlet />
      <Footer />
      <ChatWidget />
    </>
  )
}

export default RootLayout
