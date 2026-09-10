import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './RootLayout'
import FlightsPage from './components/FlightsPage'
import MyBookings from './components/MyBookings'

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { index: true, element: <FlightsPage /> },
        { path: 'bookings', element: <MyBookings /> },
      ],
    },
  ],
  { basename: '/project-test-4-flight-reservation-ai/' },
)

export default router
