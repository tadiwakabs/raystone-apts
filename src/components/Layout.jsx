import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Scroll to hash on navigation, or to top if no hash
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''))
      // Small delay to let the page render first
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
