import { useState, useEffect, useRef } from 'react'

const APPWRITE_ENDPOINT = 'https://api.tadzz.net/v1'
const APPWRITE_PROJECT_ID = '69580e1400157f0934ec'
const FUNCTION_ID = '69616efb002d83535a9d'

export default function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)

  // Country picker state
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState({ flag: 'us', code: '+1', name: 'United States' })
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const selectorRef = useRef(null)

  // Form fields
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', message: '',
  })

  useEffect(() => {
    fetch('/src/data/countries.json')
      .then(r => r.json())
      .then(setCountries)
      .catch(err => console.error('Error loading countries:', err))
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        selectorRef.current && !selectorRef.current.contains(e.target)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const openPopup = () => {
    setShowPopup(true)
    requestAnimationFrame(() => setPopupVisible(true))
  }

  const closePopup = () => {
    setPopupVisible(false)
    setTimeout(() => setShowPopup(false), 300)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const data = {
      'First Name': form.firstName,
      'Last Name': form.lastName,
      'Email': form.email,
      'Country Code': selectedCountry.code,
      'Phone': form.phone,
      'Message': form.message,
      '_origin': window.location.href,
    }

    try {
      const response = await fetch(`${APPWRITE_ENDPOINT}/functions/${FUNCTION_ID}/executions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        },
        body: JSON.stringify({ body: JSON.stringify(data), async: false }),
      })

      const execution = await response.json()
      let result
      try { result = JSON.parse(execution.responseBody) }
      catch { result = { success: false } }

      if (response.ok && result.success) {
        setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' })
        openPopup()
      } else {
        alert(result.message || 'Oops! Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      alert('Oops! Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredCountries = (() => {
    const q = search.trim().toLowerCase()
    const qDigits = q.replace(/\D/g, '')
    if (!q) return countries
    return countries.filter(c => {
      const name = (c.name || '').toLowerCase()
      const dialDigits = (c.dial || '').replace(/\D/g, '')
      return name.includes(q) || (qDigits && dialDigits.includes(qDigits))
    })
  })()

  return (
    <div className="pt-20">
      {/* Title */}
      <div className="hidden md:flex items-center justify-center h-24 sm:h-34 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-bold text-gray-900 text-center">Raystone Apartments</h1>
      </div>
      <div className="flex items-center justify-center h-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Start your journey at Raystone by reaching out today.
        </h2>
      </div>
      <div className="max-w-6xl mx-auto flex items-center justify-center mt-4 sm:mt-0">
        <h2 className="text-4xl font-semibold text-gray-800 px-4">Contact Us</h2>
      </div>

      {/* Cards + Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Contact Cards */}
        <div className="flex flex-col justify-center space-y-12 mt-6">
          {/* Phone */}
          <div className="card card-hover rounded-lg w-auto h-24 md:h-36 mx-12 flex flex-wrap items-center justify-center max-md:gap-2 max-md:px-2 md:space-x-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-gray-800 md:mr-12">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
            </svg>
            <div className="space-x-6 text-center max-md:ml-2">
              <span className="font-medium md:text-xl text-gray-800">Phone </span>
              <a href="tel:+19792212707" className="font-medium md:text-xl text-gray-800">+1 (979) 221-2707</a>
            </div>
          </div>

          {/* Email */}
          <div className="card card-hover rounded-lg w-auto h-24 md:h-36 mx-12 flex flex-wrap items-center justify-center gap-2 md:gap-4 px-2 md:px-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-gray-800">
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
            <span className="font-medium md:text-xl text-gray-800">Email</span>
            <a href="mailto:info@raystoneapts.com" className="font-medium md:text-xl text-gray-800">
              info@raystoneapts.com
            </a>
          </div>

          {/* Facebook */}
          <div className="card card-hover rounded-lg w-auto h-24 md:h-36 mx-12 flex flex-wrap justify-center items-center gap-2 md:gap-6 px-2 md:px-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-gray-800 mr-4">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span className="font-medium md:text-xl text-gray-800 mr-2">Facebook </span>
            <a href="https://www.facebook.com/raystoneapts" target="_blank" rel="noopener noreferrer"
              className="font-medium md:text-xl text-gray-800 justify-self-end">
              RaystoneApts
            </a>
          </div>
        </div>

        {/* Form */}
        <div>
          <p className="md:hidden text-3xl text-gray-800 font-medium text-center">Contact Form</p>
          <p className="flex justify-start text-sm font-medium mt-8 text-red-700 mb-2 mx-12">
            * <span className="text-gray-800">&nbsp;Required</span>
          </p>
          <div className="card p-2 mx-8 rounded-lg">
            <div className="px-4 max-w-6xl mx-auto mt-2 flex items-center justify-center">
              <form onSubmit={handleSubmit} className="text-gray-800 font-medium w-full">
                {/* Honeypot */}
                <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="px-4">First Name</p>
                    <input
                      type="text" placeholder="First Name" minLength={2}
                      value={form.firstName}
                      onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                      className="border border-gray-800 mt-4 px-4 py-2 w-full text-black"
                    />
                  </div>
                  <div>
                    <p className="px-4">Last Name</p>
                    <input
                      type="text" placeholder="Last Name" minLength={2}
                      value={form.lastName}
                      onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                      className="border border-gray-800 mt-4 px-4 py-2 w-full text-black"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="px-4">Email <span className="text-red-700">*</span></p>
                  <input
                    type="email" placeholder="Email" required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="border border-gray-800 mt-4 px-4 py-2 w-full text-black"
                  />
                </div>

                {/* Phone with country picker */}
                <div className="relative w-full mt-4">
                  <p className="px-4">Phone</p>
                  <div className="flex items-center border border-gray-800 mt-4">
                    {/* Country selector */}
                    <div
                      ref={selectorRef}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer w-28 text-gray-800 relative border-r border-r-gray-800 bg-gray-300"
                      onClick={() => setDropdownOpen(o => !o)}
                    >
                      <img
                        src={`https://flagcdn.com/24x18/${selectedCountry.flag.toLowerCase()}.png`}
                        alt={selectedCountry.name}
                        className="w-8 h-4 pr-1"
                      />
                      <span>{selectedCountry.code}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2 text-gray-800" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <input
                      type="text" placeholder="Phone"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-2 focus:outline-black text-black"
                    />
                  </div>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute left-0 right-0 bg-white border border-gray-800 shadow-lg mt-1 z-50"
                    >
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoFocus
                        className="w-full px-3 py-2 border-b border-gray-800 outline-none text-sm text-gray-800"
                      />
                      <div id="countryList">
                        {filteredCountries.map((c, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-3 py-2 hover:bg-gray-200 cursor-pointer text-gray-800"
                            onClick={() => {
                              setSelectedCountry({ flag: c.flag, code: c.dial, name: c.name })
                              setDropdownOpen(false)
                              setSearch('')
                              setForm(f => ({ ...f, phone: '' }))
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={`https://flagcdn.com/24x18/${c.flag.toLowerCase()}.png`}
                                alt={c.name}
                                className="w-6 h-4 rounded-sm"
                              />
                              <span>{c.name}</span>
                            </div>
                            <span>{c.dial}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="mt-4">
                  <p className="px-4">Message <span className="text-red-700">*</span></p>
                  <textarea
                    placeholder="Message" required
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 mt-4 border border-gray-800 text-black min-h-32 max-h-80"
                  />
                </div>

                <div className="flex items-center justify-center p-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="relative flex items-center justify-center gap-2 border border-black rounded-full
                      bg-gray-800 text-white font-medium px-12 py-2 hover:bg-white hover:text-gray-800
                      transition-colors duration-300 ease-in-out disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {submitting && (
                      <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    )}
                    <span>{submitting ? 'Submitting...' : 'Submit'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Popup */}
      {showPopup && (
        <div
          className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300
            ${popupVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="relative bg-white rounded-lg shadow-lg mx-4 p-8 text-center max-w-md z-50">
            <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
            <p className="mt-4 text-gray-700 font-medium">
              Your message has been sent. We will get back to you shortly.
            </p>
            <button
              onClick={closePopup}
              className="mt-6 bg-gray-800 text-white font-medium px-6 py-2 rounded hover:bg-gray-600 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="h-20" />
    </div>
  )
}
