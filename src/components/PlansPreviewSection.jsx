import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PlansPreviewSection() {
  const [plans, setPlans] = useState([])
  const [modalSrc, setModalSrc] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/data/plans.json')
      .then(r => r.json())
      .then(setPlans)
      .catch(err => console.error('Error loading plans:', err))
  }, [])

  const goToSection = (page, sectionId) => {
    navigate(`/${page}#${encodeURIComponent(sectionId)}`)
  }

  return (
    <>
      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 mt-10">
        {plans.map((room) => {
          const price = Number(room.price).toLocaleString('en-US')
          return (
            <div
              key={room.planId}
              className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden mx-4"
            >
              <div className="p-4 flex gap-4">
                <img
                  src={room.image}
                  alt={`${room.name} floor plan`}
                  className="w-24 h-20 object-cover rounded-md shadow-sm flex-shrink-0 cursor-pointer"
                  onClick={() => setModalSrc(room.image)}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-700 mt-1">{room.description}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-2">
                    <span>Starting at $ </span>{price}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => goToSection('plans', room.planId)}
                  className="flex-1 text-center text-gray-800 text-sm bg-gray-300 px-3 py-2 rounded-md
                    hover:bg-gray-800/80 hover:text-gray-200 font-medium transition-colors duration-300 ease-in-out cursor-pointer"
                >
                  View Floor Plan
                </button>
                <button
                  onClick={() => goToSection('gallery', room.galleryId)}
                  className="flex-1 text-center text-gray-100 text-sm bg-gray-800 px-3 py-2 rounded-md
                    hover:bg-gray-200 hover:text-gray-600 font-medium transition-colors duration-300 ease-in-out cursor-pointer"
                >
                  View Gallery
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:flex items-center justify-between text-center md:px-8 max-w-6xl mx-auto mt-12">
        <div className="mx-auto px-2 md:px-4">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xl font-semibold text-gray-800 max-md:w-30" />
                  <th className="md:px-4 py-3 text-center md:text-xl font-semibold text-gray-800">Plan</th>
                  <th className="md:px-4 py-3 text-center md:text-xl font-semibold text-gray-800">Description</th>
                  <th className="md:px-4 py-3 text-center md:text-xl font-semibold text-gray-800">Price</th>
                  <th className="hidden md:table-cell md:px-4 md:py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {plans.map((room) => {
                  const price = Number(room.price).toLocaleString('en-US')
                  return (
                    <tr key={room.planId} className="hover:bg-gray-50 transition-colors duration-300 ease-in-out">
                      <td className="px-4 py-3 text-center">
                        <img
                          src={room.image}
                          alt={`${room.name} floor plan`}
                          className="w-32 h-24 object-cover rounded-md mx-auto shadow-sm cursor-pointer card-hover"
                          onClick={() => setModalSrc(room.image)}
                        />
                      </td>
                      <td className="px-4 py-3 text-xl font-medium text-gray-800 text-center">{room.name}</td>
                      <td className="px-4 py-3 text-xl text-gray-800 text-center">{room.description}</td>
                      <td className="px-4 py-3 text-xl text-gray-800 font-medium text-center">
                        <p className="text-[13px] mb-1">Starting at</p>
                        <span>$&nbsp;</span>{price}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => goToSection('plans', room.planId)}
                            className="text-gray-800 text-lg bg-gray-300 px-3 py-2 rounded-md
                              hover:bg-gray-800/80 hover:text-gray-200 font-medium transition-colors duration-300
                              ease-in-out whitespace-nowrap cursor-pointer"
                          >
                            View Floor Plan
                          </button>
                          <button
                            onClick={() => goToSection('gallery', room.galleryId)}
                            className="text-gray-100 text-lg bg-gray-800 px-3 py-2 rounded-md
                              hover:bg-gray-200 hover:text-gray-600 font-medium transition-colors duration-300
                              ease-in-out whitespace-nowrap cursor-pointer"
                          >
                            View Gallery
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalSrc && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center space-y-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalSrc(null) }}
        >
          <img
            src={modalSrc}
            alt="Floor plan"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg object-contain"
          />
          <button
            onClick={() => setModalSrc(null)}
            className="text-white text-sm md:text-lg bg-gray-800 px-8 py-2 rounded-md w-auto hover:bg-gray-200
              hover:text-gray-600 font-medium transition-colors duration-300 ease-in-out whitespace-nowrap cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </>
  )
}
