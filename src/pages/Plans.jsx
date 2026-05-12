import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [modalSrc, setModalSrc] = useState(null)

  useEffect(() => {
    fetch('/data/plans.json')
      .then(r => r.json())
      .then(setPlans)
      .catch(err => console.error('Error loading floor plans:', err))
  }, [])

  // Close modal on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setModalSrc(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="pt-20">
      {/* Title */}
      <div className="hidden md:flex items-center justify-center h-30 sm:h-40 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-bold text-gray-900">Raystone Apartments</h1>
      </div>

      <section className="max-w-6xl mx-auto px-4 max-md:mt-4">
        <h2 className="text-3xl md:text-4xl text-gray-800 font-semibold text-center">Floor Plans</h2>
        <p className="mt-3 text-gray-800 text-center md:text-xl">
          Choose from a variety of spacious floor plans designed to fit your lifestyle.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {plans.map(p => {
            const price = Number(p.price || 0).toLocaleString('en-US')
            const longDesc =
              (p.descriptionLong && p.descriptionLong.trim()) ||
              'A thoughtfully designed layout with modern finishes and comfortable living space.'

            return (
              <article
                key={p.planId}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transform hover:scale-[1.01] transition-transform duration-300"
              >
                <div
                  id={p.planId}
                  className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  {/* Text */}
                  <div className="lg:col-span-5">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{p.name}</h2>
                      <div className="text-lg md:text-xl font-semibold text-gray-900 whitespace-nowrap">
                        <span className="font-normal text-md md:text-lg">starting at</span> ${price}
                      </div>
                    </div>

                    <p className="mt-2 text-gray-700">{p.description || ''}</p>
                    <p className="mt-4 text-gray-700 leading-relaxed">{longDesc}</p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setModalSrc(p.image)}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gray-200 text-gray-800
                          hover:bg-gray-300 transition-colors font-medium"
                      >
                        View Floor Plan
                      </button>
                      <Link
                        to={`/gallery#${encodeURIComponent(p.galleryId)}`}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gray-800 text-gray-100
                          hover:bg-gray-700 transition-colors font-medium"
                      >
                        View Gallery
                      </Link>
                    </div>
                  </div>

                  {/* Image Preview */}
                  <div className="lg:col-span-7 flex justify-center lg:justify-end">
                    <div className="w-full max-w-md rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      <div className="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 font-medium">
                        Preview
                      </div>
                      <img
                        src={p.image}
                        alt={`${p.name} floor plan`}
                        className="w-full aspect-[4/3] object-cover bg-white cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => setModalSrc(p.image)}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Fullscreen preview modal */}
      {modalSrc && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalSrc(null) }}
        >
          <div className="max-w-4xl w-full">
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setModalSrc(null)}
                className="px-4 py-2 rounded-md bg-gray-800 text-gray-100 hover:bg-gray-700 transition-colors font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
            <img
              src={modalSrc}
              alt="Floor plan preview"
              className="w-full max-h-[80vh] object-contain rounded-lg bg-white shadow-lg"
            />
          </div>
        </div>
      )}

      <div className="h-10" />
    </div>
  )
}
