import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './RootLayout'
import FlightsPage from './components/FlightsPage'
import MyBookings from './components/MyBookings'
import BookingPage from './components/BookingPage'

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { index: true, element: <FlightsPage /> },
        { path: 'bookings', element: <MyBookings /> },
        { path: 'book/:flightNumber', element: <BookingPage /> },
      ],
    },
  ],
  { basename: '/project-test-4-flight-reservation-ai/' },
)

export default router
