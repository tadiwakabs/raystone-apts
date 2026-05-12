import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Gallery() {
  const [galleries, setGalleries] = useState([])
  const [galleriesByGroup, setGalleriesByGroup] = useState({})
  const [groupTitleByGroup, setGroupTitleByGroup] = useState({})
  const [expandedSections, setExpandedSections] = useState({})

  // Lightbox state
  const [lightbox, setLightbox] = useState({ open: false, group: '', index: 0 })

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/src/data/galleries.json')
      .then(r => r.json())
      .then(data => {
        setGalleries(data)
        const byGroup = {}
        const titleByGroup = {}
        data.forEach(sec => {
          byGroup[sec.group] = sec.images
          titleByGroup[sec.group] = sec.title
        })
        setGalleriesByGroup(byGroup)
        setGroupTitleByGroup(titleByGroup)

        // Handle deep-link: ?room=id or #id
        const params = new URLSearchParams(location.search)
        const roomId = params.get('room')
        const hashId = decodeURIComponent(location.hash.replace('#', ''))
        const targetId = roomId || hashId

        if (targetId) {
          const targetSection = data.find(g => g.id === targetId)
          // Expand the section
          setExpandedSections(prev => ({ ...prev, [targetId]: true }))
          setTimeout(() => {
            const el = document.getElementById(targetId)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            if (targetSection && roomId) {
              setLightbox({ open: true, group: targetSection.group, index: 0 })
            }
          }, 100)
        }
      })
      .catch(err => console.error('Error loading galleries:', err))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const openLightbox = useCallback((group, index) => {
    setLightbox({ open: true, group, index })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(lb => ({ ...lb, open: false }))
  }, [])

  const nextImage = useCallback(() => {
    setLightbox(lb => {
      const images = galleriesByGroup[lb.group] || []
      return { ...lb, index: (lb.index + 1) % images.length }
    })
  }, [galleriesByGroup])

  const prevImage = useCallback(() => {
    setLightbox(lb => {
      const images = galleriesByGroup[lb.group] || []
      return { ...lb, index: (lb.index - 1 + images.length) % images.length }
    })
  }, [galleriesByGroup])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (!lightbox.open) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox.open, closeLightbox, nextImage, prevImage])

  const currentImages = galleriesByGroup[lightbox.group] || []
  const currentItem = currentImages[lightbox.index]

  return (
    <div className="pt-20">
      {/* Title */}
      <div className="flex items-center justify-center h-20 md:h-40 px-4 max-w-6xl mx-auto">
        <h1 className="text-[30px] md:text-6xl font-bold text-gray-900 text-center">The Raystone Experience</h1>
      </div>

      {/* Heading */}
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <h2 className="text-[28px] md:text-4xl font-semibold text-gray-800 px-4">Photo Gallery</h2>
      </div>

      {/* Gallery Sections */}
      <div className="px-4 max-w-6xl mx-auto">
        {galleries.map(sec => {
          const isOpen = expandedSections[sec.id] !== false // default open
          // Actually default to open matching original (all open on load by having rotate-180)
          const open = expandedSections[sec.id] !== undefined ? expandedSections[sec.id] : true
          const preview = sec.images.slice(0, 6)
          return (
            <section
              key={sec.id}
              id={sec.id}
              className="max-w-6xl mx-auto px-4 py-0.5 mt-4 scroll-mt-24"
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="h-20 w-full border border-x-blue-50/0 flex items-center justify-between text-gray-800
                  px-4 py-2 select-none transform hover:scale-102 transition-transform duration-300"
              >
                <span className="text-2xl md:text-3xl font-medium">{sec.title}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden border-l border-r border-b border-gray-800/20
                  ${open ? 'max-h-[500px]' : 'max-h-0'}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-4 max-w-6xl">
                  {preview.map((img, i) => (
                    <div key={i} className="aspect-[4/3]">
                      <img
                        src={img.src}
                        alt={img.name || sec.title}
                        className="w-full h-full object-cover cursor-pointer card-hover rounded-md"
                        onClick={() => openLightbox(sec.group, i)}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 px-4">
                  <button
                    className="center text-white text-lg sm:text-2xl bg-gray-800 px-10 py-3 mt-2 rounded-md
                      w-full sm:w-auto hover:bg-gray-200 hover:text-gray-800 font-medium transition-colors duration-300
                      ease-in-out cursor-pointer"
                    onClick={() => openLightbox(sec.group, 0)}
                  >
                    View All
                  </button>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightbox.open && currentItem && (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-gray-900 text-6xl font-semibold z-50 cursor-pointer"
          >
            &times;
          </button>

          <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
            <div className="text-gray-800 text-2xl font-semibold mb-8">
              {currentItem.name || groupTitleByGroup[lightbox.group] || 'Gallery'}
            </div>
            <img
              key={`${lightbox.group}-${lightbox.index}`}
              src={currentItem.src}
              className="max-w-full max-h-[80%] object-contain transition-opacity duration-500 ease-in-out"
              alt={currentItem.name || 'Gallery image'}
            />
            <div className="bottom-6 px-3 py-1 text-gray-800 text-xl mt-4">
              {lightbox.index + 1} / {currentImages.length}
            </div>

            {/* Prev */}
            <button
              className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center justify-center w-10 h-10
                bg-gray-100 border border-gray-800 rounded-full shadow cursor-pointer hover:bg-gray-800 transition-colors group"
              onClick={prevImage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800 group-hover:text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-6-7 6-7" />
              </svg>
            </button>

            {/* Next */}
            <button
              className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center justify-center w-10 h-10
                bg-gray-100 border border-gray-800 rounded-full shadow cursor-pointer hover:bg-gray-800 transition-colors group"
              onClick={nextImage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800 group-hover:text-white"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l6 7-6 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="h-20" />
    </div>
  )
}
