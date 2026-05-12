import { useState, useEffect } from 'react'

const FILTERS = [
  {
    key: 'Featured',
    label: 'Featured',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-gray-800">
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </svg>
    ),
  },
  {
    key: 'Comfort & Essentials',
    label: 'Comfort & Essentials',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="lucide lucide-bed text-gray-800">
        <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
      </svg>
    ),
  },
  {
    key: 'Kitchen and Dining',
    label: 'Kitchen & Dining',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-gray-800">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </svg>
    ),
  },
  {
    key: 'Home Safety',
    label: 'Home Safety',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-gray-800">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" />
      </svg>
    ),
  },
  {
    key: 'Community Features',
    label: 'Community Features',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-gray-800">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    key: 'All',
    label: 'All',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
]

export default function AmenitiesSection() {
  const [amenities, setAmenities] = useState([])
  const [activeFilter, setActiveFilter] = useState('Featured')

  useEffect(() => {
    fetch('/data/amenities.json')
      .then(r => r.json())
      .then(setAmenities)
      .catch(err => console.error('Error loading amenities:', err))
  }, [])

  const filtered = (() => {
    if (activeFilter === 'Featured') return amenities.filter(a => a.featured)
    if (activeFilter === 'All') return amenities
    return amenities.filter(a =>
      Array.isArray(a.category) ? a.category.includes(activeFilter) : a.category === activeFilter
    )
  })()

  return (
    <section>
      {/* Filters */}
      <div className="center mx-2 md:mx-auto space-x-2 md:space-x-1 bg-gray-300 h-10 rounded-full max-w-5xl border border-gray-700 mt-4">
        {FILTERS.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`filter-btn center md:space-x-2 px-3 md:px-4 py-1 rounded-full transition
              ${activeFilter === key ? 'bg-gray-100' : 'hover:bg-gray-200'}`}
            onClick={() => setActiveFilter(key)}
          >
            {icon}
            <span className="max-md:hidden text-gray-800 font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 border border-gray-600 rounded-md hover:bg-gray-50 transition"
            >
              <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: a.icon }} />
              <span className="text-gray-800 font-medium md:text-lg">{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
