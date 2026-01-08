//Testimonials section script to load and render reviews

fetch("src/data/testimonials.json")
    .then((res) => res.json())
    .then((reviews) => {
        const track = document.getElementById("testimonialsTrack");
        if (!track) return;

        track.innerHTML = "";

        reviews.forEach((review, idx) => {
            const card = document.createElement("article");
            card.className =
                "snap-center shrink-0 w-[85%] sm:w-[70%] md:w-[420px] " +
                "bg-white border border-gray-200 rounded-xl shadow-sm p-5 " +
                "hover:shadow-md transition-shadow";

            card.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-gray-900 truncate">${escapeHtml(review.name)}</p>
            <div class="mt-1 flex items-center gap-2">
              ${renderStars(review.rating)}
              <span class="text-sm text-gray-600">${formatRating(review.rating)}</span>
            </div>
          </div>

          ${renderSourceBadge(review.source)}
        </div>

        <div class="mt-4">
          <p id="reviewText-${idx}"
             class="text-gray-700 text-sm md:text-base leading-relaxed clamp-4">
            ${escapeHtml(review.text)}
          </p>

          ${
                review.text.length > 170
                    ? `<button data-toggle="${idx}"
                          class="mt-2 text-sm font-medium text-gray-800 hover:text-gray-600 underline underline-offset-4">
                    Read more
                 </button>`
                    : ""
            }
        </div>
      `;

            track.appendChild(card);
        });

        setupInfinite(track);

        function scrollToCard(cardEl, behavior = "smooth") {
            if (!cardEl) return;

            const trackRect = track.getBoundingClientRect();
            const cardRect = cardEl.getBoundingClientRect();

            const trackCenter = trackRect.left + trackRect.width / 2;
            const cardCenter = cardRect.left + cardRect.width / 2;

            const delta = cardCenter - trackCenter;
            track.scrollTo({ left: track.scrollLeft + delta, behavior });
        }

        // Real index: 0..reviews.length-1
        function goToRealIndex(realIndex, behavior = "smooth") {
            const cards = track.querySelectorAll("article");
            const target = cards[realIndex + 1]; // +1 because cards[0] is lastClone
            collapseAllExpandedReviews();        // always collapse when switching
            scrollToCard(target, behavior);
        }

        // Convenience: next/prev from whatever is centered
        function getStep() {
            const cards = track.querySelectorAll("article");
            if (cards.length < 3) return 420;
            const styles = getComputedStyle(track);
            const gap = parseFloat(styles.gap || styles.columnGap || "16") || 16;
            return cards[1].getBoundingClientRect().width + gap; // one card step
        }

        function goNext(useClones = false) {
            collapseAllExpandedReviews();

            const current = getActiveRealIndex();
            const isLast = current === reviews.length - 1;

            if (isLast && useClones) {
                // For auto-scroll: smoothly move onto the appended firstClone
                track.scrollBy({ left: getStep(), behavior: "smooth" });
                return;
            }

            // For buttons or normal progression: wrap around directly
            const nextIndex = (current + 1) % reviews.length;
            goToRealIndex(nextIndex, "smooth");
        }

        function goPrev(useClones = false) {
            collapseAllExpandedReviews();

            const current = getActiveRealIndex();
            const isFirst = current === 0;

            if (isFirst && useClones) {
                // For manual swipes: smoothly move onto the prepended lastClone
                track.scrollBy({ left: -getStep(), behavior: "smooth" });
                return;
            }

            // For buttons or normal progression: wrap around directly
            const prevIndex = (current - 1 + reviews.length) % reviews.length;
            goToRealIndex(prevIndex, "smooth");
        }



        function collapseAllExpandedReviews() {
            // Re-clamp any expanded text
            track.querySelectorAll("p[id^='reviewText-']").forEach((p) => {
                p.classList.add("clamp-4");
            });

            // Reset any toggled buttons
            track.querySelectorAll("button[data-toggle]").forEach((btn) => {
                btn.textContent = "Read more";
            });
        }

        let lastActiveIndex = 0;
        let collapseTimer = null;

        function handleCardChangeCollapse() {
            const current = getActiveRealIndex();
            if (current !== lastActiveIndex) {
                lastActiveIndex = current;
                collapseAllExpandedReviews();
            }
        }

        track.addEventListener("scroll", () => {
            if (collapseTimer) clearTimeout(collapseTimer);
            collapseTimer = setTimeout(handleCardChangeCollapse, 120); // runs after swipe settles
        });

        // ====== Pagination Dots (synced to REAL index) ======
        const dotsWrap = document.getElementById("testimonialsDots");
        const realCount = reviews.length;

        if (dotsWrap) {
            dotsWrap.innerHTML = "";

            for (let i = 0; i < realCount; i++) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
                dot.className =
                    "h-2.5 w-2.5 rounded-full transition-all " +
                    "bg-gray-300 hover:bg-gray-400";

                dot.addEventListener("click", () => {
                    pauseAutoScroll(true);
                    goToRealIndex(i, "smooth");
                    resumeAutoScrollAfterIdle();
                });

                dotsWrap.appendChild(dot);
            }
        }

        // Determine which real card is currently centered
        function getActiveRealIndex() {
            const cards = Array.from(track.querySelectorAll("article"));
            if (cards.length < 3) return 0;

            const trackRect = track.getBoundingClientRect();
            const trackCenter = trackRect.left + trackRect.width / 2;

            // Real cards are 1..realCount (because 0 is lastClone)
            let bestIdx = 0;
            let bestDist = Infinity;

            for (let i = 1; i <= realCount; i++) {
                const rect = cards[i].getBoundingClientRect();
                const center = rect.left + rect.width / 2;
                const dist = Math.abs(center - trackCenter);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIdx = i - 1; // convert to 0-based real index
                }
            }

            return bestIdx;
        }

        function setActiveDot(activeIdx) {
            if (!dotsWrap) return;
            const dots = dotsWrap.querySelectorAll("button");
            dots.forEach((d, i) => {
                if (i === activeIdx) {
                    d.className = "h-2.5 w-6 rounded-full transition-all bg-gray-800";
                } else {
                    d.className = "h-2.5 w-2.5 rounded-full transition-all bg-gray-300 hover:bg-gray-400";
                }
            });
        }

        // Update dots on scroll (cheap + smooth)
        let rafPending = false;
        track.addEventListener("scroll", () => {
            if (rafPending) return;
            rafPending = true;
            requestAnimationFrame(() => {
                rafPending = false;
                setActiveDot(getActiveRealIndex());
            });
        });

        // Ensure correct dot on initial load
        setActiveDot(0);

        // ====== Auto-scroll with pause on interaction ======
        let autoTimer = null;
        let resumeTimer = null;
        let isPaused = false;


        function startAutoScroll() {
            stopAutoScroll();
            autoTimer = setInterval(() => {
                if (isPaused) return;
                goNext(true); // use clones for smooth infinite scroll
            }, 5000);
        }


        function stopAutoScroll() {
            if (autoTimer) clearInterval(autoTimer);
            autoTimer = null;
        }

        function pauseAutoScroll(hard = false) {
            isPaused = true;
            if (hard) stopAutoScroll(); // hard pause stops interval (use for dot clicks)
            if (resumeTimer) clearTimeout(resumeTimer);
        }

        function resumeAutoScrollAfterIdle() {
            if (resumeTimer) clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => {
                isPaused = false;
                if (!autoTimer) startAutoScroll();
            }, 30000); // resume after 30s idle
        }

        // Pause on common interactions
        ["pointerdown", "touchstart", "wheel", "keydown"].forEach((evt) => {
            track.addEventListener(evt, () => {
                pauseAutoScroll();
            }, { passive: true });
        });

        // Pause on hover (desktop)
        track.addEventListener("mouseenter", () => pauseAutoScroll());
        track.addEventListener("mouseleave", () => resumeAutoScrollAfterIdle());

        // Resume after interaction ends
        ["pointerup", "touchend", "touchcancel"].forEach((evt) => {
            track.addEventListener(evt, () => resumeAutoScrollAfterIdle(), { passive: true });
        });

        // Kick it off
        startAutoScroll();


        let isJumping = false;
        let scrollEndTimer = null;

        function jumpTo(left) {
            isJumping = true;
            const prev = track.style.scrollBehavior;
            track.style.scrollBehavior = "auto";
            track.scrollLeft = left;
            track.style.scrollBehavior = prev || "";
            requestAnimationFrame(() => (isJumping = false));
        }

        track.addEventListener("scroll", () => {
            if (isJumping) return;

            if (scrollEndTimer) clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                const cards = Array.from(track.querySelectorAll("article"));
                if (cards.length < 3) return;

                const styles = getComputedStyle(track);
                const gap = parseFloat(styles.gap || styles.columnGap || "16") || 16;
                const step = cards[1].getBoundingClientRect().width + gap;

                // Check which card is currently centered
                const trackRect = track.getBoundingClientRect();
                const trackCenter = trackRect.left + trackRect.width / 2;

                let centeredCard = null;
                let minDist = Infinity;

                cards.forEach((card) => {
                    const rect = card.getBoundingClientRect();
                    const cardCenter = rect.left + rect.width / 2;
                    const dist = Math.abs(cardCenter - trackCenter);
                    if (dist < minDist) {
                        minDist = dist;
                        centeredCard = card;
                    }
                });

                // Only teleport if we're centered on a clone
                if (centeredCard && centeredCard.dataset.clone === "last") {
                    // We're on the lastClone (leftmost), jump to real last card
                    jumpTo(step * (cards.length - 2));
                } else if (centeredCard && centeredCard.dataset.clone === "first") {
                    // We're on the firstClone (rightmost), jump to real first card
                    jumpTo(step);
                }
            }, 150); // Increased timeout slightly for better detection
        });


        // Expand / collapse long reviews
        track.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-toggle]");
            if (!btn) return;

            const i = btn.getAttribute("data-toggle");
            const p = document.getElementById(`reviewText-${i}`);
            if (!p) return;

            const isClamped = p.classList.contains("clamp-4");
            if (isClamped) {
                p.classList.remove("clamp-4");
                btn.textContent = "Show less";
            } else {
                p.classList.add("clamp-4");
                btn.textContent = "Read more";
            }
        });

        // Optional desktop next/prev buttons
        const prevBtn = document.getElementById("testimonialsPrev");
        const nextBtn = document.getElementById("testimonialsNext");

        if (prevBtn) prevBtn.addEventListener("click", () => {
            pauseAutoScroll(true);
            goPrev();
            resumeAutoScrollAfterIdle();
        });

        if (nextBtn) nextBtn.addEventListener("click", () => {
            pauseAutoScroll(true);
            goNext();
            resumeAutoScrollAfterIdle();
        });
    })
    .catch((err) => console.error("Error loading testimonials:", err));


/* =========================
   Helpers
========================= */

function formatRating(rating) {
    const n = Number(rating);
    // show .5 when needed, otherwise integer
    return Number.isInteger(n) ? `${n}.0` : `${n}`;
}

// Generates 0–5 stars, supporting half stars (e.g., 4.5)
function renderStars(rating) {
    const r = Math.max(0, Math.min(5, Number(rating) || 0));
    const full = Math.floor(r);
    const half = r - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    let html = `<div class="flex items-center gap-0.5" aria-label="Rating ${r} out of 5">`;
    for (let i = 0; i < full; i++) html += starSvg("full");
    if (half) html += starSvg("half");
    for (let i = 0; i < empty; i++) html += starSvg("empty");
    html += `</div>`;
    return html;
}

function renderSourceBadge(source) {
    const s = (source || "").toLowerCase();
    const label = escapeHtml(source || "Review");

    // Slightly different styling per source
    const classes =
        s.includes("google")
            ? "bg-gray-100 text-gray-800 border border-gray-200"
            : "bg-gray-800 text-gray-100 border border-gray-800";

    return `
    <span class="shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${classes}">
      ${label}
    </span>
  `;
}

// Tailwind-friendly inline SVG star icons
function starSvg(type) {
    if (type === "full") {
        return `
      <svg class="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>`;
    }

    if (type === "half") {
        const id = `halfGrad-${Math.random().toString(16).slice(2)}`;
        return `
    <svg class="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">
          <stop offset="50%" stop-color="#f59e0b"></stop>
          <stop offset="50%" stop-color="transparent"></stop>
        </linearGradient>
      </defs>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill="url(#${id})" stroke="#f59e0b" stroke-width="1.5" />
    </svg>`;
    }


    // empty
    return `
    <svg class="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>`;
}

function setupInfinite(track) {
    const cards = track.querySelectorAll("article");
    if (cards.length < 2) return;

    const firstReal = cards[0];
    const lastReal = cards[cards.length - 1];

    const firstClone = firstReal.cloneNode(true);
    const lastClone = lastReal.cloneNode(true);

    firstClone.dataset.clone = "first";
    lastClone.dataset.clone = "last";

    // Insert clones: [lastClone, ...realCards..., firstClone]
    track.insertBefore(lastClone, firstReal);
    track.appendChild(firstClone);

    // Jump to the first card (skip the prepended clone)
    requestAnimationFrame(() => {
        const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "16") || 16;
        const cardWidth = firstReal.getBoundingClientRect().width;
        track.scrollLeft = cardWidth + gap;
    });
}


// Basic HTML escaping so reviews can't break your DOM
function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}