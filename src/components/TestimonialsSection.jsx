import { useState, useEffect, useRef, useCallback } from 'react'

function formatRating(rating) {
  const n = Number(rating)
  return Number.isInteger(n) ? `${n}.0` : `${n}`
}

function StarSvg({ type }) {
  if (type === 'full') {
    return (
      <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    )
  }
  if (type === 'half') {
    const id = `halfGrad-${Math.random().toString(16).slice(2)}`
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill={`url(#${id})`} stroke="#f59e0b" strokeWidth="1.5" />
      </svg>
    )
  }
  return (
    <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}

function RenderStars({ rating }) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0))
  const full = Math.floor(r)
  const half = r - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${r} out of 5`}>
      {Array.from({ length: full }, (_, i) => <StarSvg key={`f${i}`} type="full" />)}
      {half ? <StarSvg type="half" /> : null}
      {Array.from({ length: empty }, (_, i) => <StarSvg key={`e${i}`} type="empty" />)}
    </div>
  )
}

function SourceBadge({ source }) {
  const s = (source || '').toLowerCase()
  const classes = s.includes('google')
    ? 'bg-gray-100 text-gray-800 border border-gray-200'
    : 'bg-gray-800 text-gray-100 border border-gray-800'
  return (
    <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${classes}`}>
      {source || 'Review'}
    </span>
  )
}

function ReviewCard({ review, idx, isClone }) {
  const [expanded, setExpanded] = useState(false)
  const long = review.text.length > 170

  return (
    <article
      className="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-[420px] bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
      data-clone={isClone || undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{review.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <RenderStars rating={review.rating} />
            <span className="text-sm text-gray-600">{formatRating(review.rating)}</span>
          </div>
        </div>
        <SourceBadge source={review.source} />
      </div>
      <div className="mt-4">
        <p
          id={`reviewText-${idx}`}
          className={`text-gray-700 text-sm md:text-base leading-relaxed ${expanded ? '' : 'clamp-4'}`}
        >
          {review.text}
        </p>
        {long && (
          <button
            className="mt-2 text-sm font-medium text-gray-800 hover:text-gray-600 underline underline-offset-4"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </article>
  )
}

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([])
  const [activeDot, setActiveDot] = useState(0)
  const trackRef = useRef(null)
  const autoTimerRef = useRef(null)
  const isPausedRef = useRef(false)
  const isJumpingRef = useRef(false)
  const scrollEndTimerRef = useRef(null)

  useEffect(() => {
    fetch('/data/testimonials.json')
      .then(r => r.json())
      .then(setReviews)
      .catch(err => console.error('Error loading testimonials:', err))
  }, [])

  // After reviews render, set initial scroll position (skip the prepended lastClone)
  useEffect(() => {
    if (!reviews.length) return
    const track = trackRef.current
    if (!track) return
    requestAnimationFrame(() => {
      const cards = track.querySelectorAll('article')
      if (cards.length < 3) return
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '16') || 16
      const cardWidth = cards[1].getBoundingClientRect().width // first real card
      track.scrollLeft = cardWidth + gap
    })
  }, [reviews])

  const getStep = useCallback(() => {
    const track = trackRef.current
    if (!track) return 420
    const cards = track.querySelectorAll('article')
    if (cards.length < 3) return 420
    const gap = parseFloat(getComputedStyle(track).gap || getComputedStyle(track).columnGap || '16') || 16
    return cards[1].getBoundingClientRect().width + gap
  }, [])

  const getActiveRealIndex = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const cards = Array.from(track.querySelectorAll('article'))
    if (cards.length < 3) return 0
    const realCount = reviews.length
    const trackRect = track.getBoundingClientRect()
    const trackCenter = trackRect.left + trackRect.width / 2
    let bestIdx = 0, bestDist = Infinity
    for (let i = 1; i <= realCount; i++) {
      const rect = cards[i].getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const dist = Math.abs(center - trackCenter)
      if (dist < bestDist) { bestDist = dist; bestIdx = i - 1 }
    }
    return bestIdx
  }, [reviews.length])

  const scrollToCard = useCallback((cardEl, behavior = 'smooth') => {
    const track = trackRef.current
    if (!track || !cardEl) return
    const trackRect = track.getBoundingClientRect()
    const cardRect = cardEl.getBoundingClientRect()
    const delta = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2)
    track.scrollTo({ left: track.scrollLeft + delta, behavior })
  }, [])

  const goToRealIndex = useCallback((realIndex, behavior = 'smooth') => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll('article')
    const target = cards[realIndex + 1] // +1 for prepended lastClone
    scrollToCard(target, behavior)
  }, [scrollToCard])

  const pauseAutoScroll = useCallback((hard = false) => {
    isPausedRef.current = true
    if (hard && autoTimerRef.current) {
      clearInterval(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }, [])

  const startAutoScroll = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    autoTimerRef.current = setInterval(() => {
      if (isPausedRef.current) return
      const track = trackRef.current
      if (!track) return
      const current = getActiveRealIndex()
      const isLast = current === reviews.length - 1
      if (isLast) {
        track.scrollBy({ left: getStep(), behavior: 'smooth' })
      } else {
        goToRealIndex((current + 1) % reviews.length, 'smooth')
      }
    }, 5000)
  }, [getActiveRealIndex, getStep, goToRealIndex, reviews.length])

  const resumeAutoScrollAfterIdle = useCallback(() => {
    setTimeout(() => {
      isPausedRef.current = false
      if (!autoTimerRef.current) startAutoScroll()
    }, 30000)
  }, [startAutoScroll])

  // Start auto scroll after reviews load
  useEffect(() => {
    if (!reviews.length) return
    // Small delay to let DOM settle
    const t = setTimeout(() => startAutoScroll(), 300)
    return () => {
      clearTimeout(t)
      if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    }
  }, [reviews.length, startAutoScroll])

  // Infinite scroll clone teleport logic
  useEffect(() => {
    const track = trackRef.current
    if (!track || !reviews.length) return

    const handler = () => {
      if (isJumpingRef.current) return
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current)
      scrollEndTimerRef.current = setTimeout(() => {
        const cards = Array.from(track.querySelectorAll('article'))
        if (cards.length < 3) return
        const gap = parseFloat(getComputedStyle(track).gap || getComputedStyle(track).columnGap || '16') || 16
        const step = cards[1].getBoundingClientRect().width + gap
        const trackRect = track.getBoundingClientRect()
        const trackCenter = trackRect.left + trackRect.width / 2
        let centeredCard = null, minDist = Infinity
        cards.forEach(card => {
          const rect = card.getBoundingClientRect()
          const dist = Math.abs((rect.left + rect.width / 2) - trackCenter)
          if (dist < minDist) { minDist = dist; centeredCard = card }
        })
        if (centeredCard?.dataset.clone === 'last') {
          isJumpingRef.current = true
          track.style.scrollBehavior = 'auto'
          track.scrollLeft = step * (cards.length - 2)
          track.style.scrollBehavior = ''
          requestAnimationFrame(() => { isJumpingRef.current = false })
        } else if (centeredCard?.dataset.clone === 'first') {
          isJumpingRef.current = true
          track.style.scrollBehavior = 'auto'
          track.scrollLeft = step
          track.style.scrollBehavior = ''
          requestAnimationFrame(() => { isJumpingRef.current = false })
        }
      }, 150)
    }

    const dotHandler = () => {
      if (!isJumpingRef.current) {
        setActiveDot(getActiveRealIndex())
      }
    }

    track.addEventListener('scroll', handler, { passive: true })
    track.addEventListener('scroll', dotHandler, { passive: true })
    return () => {
      track.removeEventListener('scroll', handler)
      track.removeEventListener('scroll', dotHandler)
    }
  }, [reviews.length, getActiveRealIndex])

  const handlePrev = () => {
    pauseAutoScroll(true)
    const current = getActiveRealIndex()
    goToRealIndex((current - 1 + reviews.length) % reviews.length, 'smooth')
    resumeAutoScrollAfterIdle()
  }

  const handleNext = () => {
    pauseAutoScroll(true)
    const current = getActiveRealIndex()
    goToRealIndex((current + 1) % reviews.length, 'smooth')
    resumeAutoScrollAfterIdle()
  }

  if (!reviews.length) return null

  // Build card list: [lastClone, ...realCards, firstClone]
  const lastReview = reviews[reviews.length - 1]
  const firstReview = reviews[0]

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12">
      <h2 className="center text-3xl md:text-4xl text-gray-800 font-semibold">What Our Residents Say</h2>

      <div className="flex justify-center items-end md:justify-between gap-4 px-4">
        <div className="max-md:hidden mr-16" />
        <p className="mt-2 text-gray-700 text-base md:text-lg text-center">
          Real feedback from residents on Google and RentCafe.
        </p>
        {/* Desktop controls */}
        <div className="hidden md:flex gap-6">
          <button
            onClick={handlePrev}
            className="px-3 pb-2 pt-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-2xl border border-gray-400 cursor-pointer"
          >‹</button>
          <button
            onClick={handleNext}
            className="px-3 pb-2 pt-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-2xl border border-gray-400 cursor-pointer"
          >›</button>
        </div>
      </div>

      {/* Swipe container */}
      <div
        ref={trackRef}
        className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={() => pauseAutoScroll()}
        onMouseLeave={() => resumeAutoScrollAfterIdle()}
        onPointerDown={() => pauseAutoScroll()}
        onTouchStart={() => pauseAutoScroll()}
        onPointerUp={() => resumeAutoScrollAfterIdle()}
        onTouchEnd={() => resumeAutoScrollAfterIdle()}
      >
        {/* lastClone */}
        <ReviewCard review={lastReview} idx={-1} isClone="last" />
        {/* real cards */}
        {reviews.map((review, idx) => (
          <ReviewCard key={idx} review={review} idx={idx} />
        ))}
        {/* firstClone */}
        <ReviewCard review={firstReview} idx={reviews.length} isClone="first" />
      </div>

      {/* Dots */}
      <div className="mt-5 flex justify-center gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            className={`rounded-full transition-all ${
              i === activeDot
                ? 'h-2.5 w-6 bg-gray-800'
                : 'h-2.5 w-2.5 bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => {
              pauseAutoScroll(true)
              goToRealIndex(i, 'smooth')
              resumeAutoScrollAfterIdle()
            }}
          />
        ))}
      </div>

      <div className="center">
        <p className="mt-4 text-xs md:text-sm text-gray-500">
          Testimonials are based on resident reviews from Google and RentCafe. Names may be abbreviated for privacy.
        </p>
      </div>
    </section>
  )
}
