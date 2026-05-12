import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Floor Plans', to: '/plans' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen)
    return () => document.body.classList.remove('no-scroll')
  }, [menuOpen])

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <header className="fixed w-full z-40 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo — desktop */}
        <div className="flex items-center space-x-4">
          <img src="/images/logo.svg" width="36" alt="logo" />
          <Link to="/" className="hidden md:flex text-2xl font-bold text-gray-800">
            Raystone Apartments
          </Link>
        </div>
        {/* Logo — mobile */}
        <Link to="/" className="md:hidden flex text-2xl font-bold text-gray-800">
          Raystone Apartments
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 text-gray-800 font-medium text-sm md:text-lg">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`hover:text-gray-600 text-center hover:underline underline-offset-4${
                isActive(to) ? ' underline underline-offset-4 font-semibold' : ''
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://www.rentcafe.com/apartments/tx/bay-city/raystone-apartment-homes/default.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 text-center hover:underline underline-offset-4"
          >
            Apply Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-800 focus:outline-none z-50"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {/* Hamburger */}
          <svg
            className={`h-6 w-6 ${menuOpen ? 'hidden' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {/* Close */}
          <svg
            className={`h-6 w-6 ${menuOpen ? '' : 'hidden'}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <div
        className={`fixed inset-0 bg-white bg-opacity-95 backdrop-blur-md z-30 flex flex-col
          items-center justify-start space-y-8 text-2xl font-semibold text-gray-800
          transition-opacity duration-300 md:hidden
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <img src="/images/logowtext.svg" className="my-12" width="240" alt="logo with text" />
        {NAV_LINKS.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className="hover:text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        <a
          href="https://www.rentcafe.com/apartments/tx/bay-city/raystone-apartment-homes/default.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-600"
          onClick={() => setMenuOpen(false)}
        >
          Apply Now
        </a>
      </div>
    </header>
  )
}
