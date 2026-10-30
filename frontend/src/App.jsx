import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import TopBar from './components/TopBar'
import SiteFooter from './components/SiteFooter'
import Landing from './pages/Landing'
import BrowseClinicians from './pages/BrowseClinicians'
import AuthScreen from './pages/AuthScreen'
import AboutClinic from './pages/AboutClinic'
import ContactDesk from './pages/ContactDesk'
import BookVisit from './pages/BookVisit'
import VisitList from './pages/VisitList'
import AccountPanel from './pages/AccountPanel'
import PaymentReturn from './pages/PaymentReturn'

function useScrollResetOnNavigate() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
}

const pageRoutes = [
  { path: '/', Page: Landing },
  { path: '/doctors', Page: BrowseClinicians },
  { path: '/doctors/:speciality', Page: BrowseClinicians },
  { path: '/login', Page: AuthScreen },
  { path: '/about', Page: AboutClinic },
  { path: '/contact', Page: ContactDesk },
  { path: '/appointment/:docId', Page: BookVisit },
  { path: '/my-appointments', Page: VisitList },
  { path: '/my-profile', Page: AccountPanel },
  { path: '/verify', Page: PaymentReturn },
]

export default function App() {
  useScrollResetOnNavigate()

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-center" autoClose={2800} hideProgressBar theme="colored" />
      <TopBar />
      <main className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <Routes>
          {pageRoutes.map(({ path, Page }) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
