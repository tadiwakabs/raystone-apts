// Underline active nav link
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage ||
        (currentPage === "" && link.getAttribute("href") === "index.html")) {
        link.classList.add("underline", "underline-offset-4", "font-semibold");
    }
});

// Mobile Navigation
const menuBtn = document.getElementById("menuBtn");
const menuIcon = document.getElementById("menuIcon");
const closeIcon = document.getElementById("closeIcon");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMenu() {
    mobileMenu.classList.toggle("opacity-0");
    mobileMenu.classList.toggle("pointer-events-none");

    menuIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
}

menuBtn.addEventListener("click", toggleMenu);

// Rooms section navigation
function navigateToRoom(roomId) {
    if (window.location.pathname.includes("attractions.html")) {
        const section = document.getElementById(roomId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    } else {
        window.location.href = `rooms.html#${roomId}`;
    }
}

// Gallery section navigation
function navigateToGallery(galleryId) {
    if (window.location.pathname.includes("gallery.html")) {
        const section = document.getElementById(galleryId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            // Optional: open lightbox immediately if desired
            openLightboxFromId(galleryId);
        }
    } else {
        // Navigate with query parameter for easy detection
        window.location.href = `gallery.html?room=${encodeURIComponent(galleryId)}`;
    }
}


// Optional: if using this inside a mobile menu
function handleRoomClick(roomId) {
    toggleMenu(); // Close mobile menu first
    setTimeout(() => {
        navigateToRoom(roomId);
    }, 300); // Delay matches menu close animation
}


// Collapsible sections
function toggleSection(sectionId, arrowId, withBorder=true) {
    const section = document.getElementById(sectionId);
    const arrow = document.getElementById(arrowId);

    // If currently collapsed
    if (section.classList.contains('max-h-0')) {
        section.classList.remove('max-h-0');
        section.classList.add('max-h-500');
        if (withBorder) section.classList.add("border");      // add border when open
        arrow.classList.add('rotate-180');
    }
    // If currently expanded
    else {
        section.classList.remove('max-h-500');
        section.classList.add('max-h-0');
        if (withBorder) section.classList.remove("border");    // remove border when closed
        arrow.classList.remove('rotate-180');
    }
}

// Image carousel
document.querySelectorAll(".carousel").forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const slides = track.children;
    let index = 0;
    let autoplayInterval;

    function showSlide(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            showSlide(index + 1);
        }, 3000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Buttons
    carousel.querySelector(".prevBtn").addEventListener("click", () => {
        showSlide(index - 1);
        stopAutoplay();
    });
    carousel.querySelector(".nextBtn").addEventListener("click", () => {
        showSlide(index + 1);
        stopAutoplay();
    });

    // Swipe support
    let startX = 0;
    track.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    track.addEventListener("touchend", e => {
        let endX = e.changedTouches[0].clientX;
        if (endX < startX - 50) {
            showSlide(index + 1);
            stopAutoplay();
        }
        if (endX > startX + 50) {
            showSlide(index - 1);
            stopAutoplay();
        }
    });

    // Autoplay on load
    startAutoplay();
});

// Load plan info (FOR MOBILE, RENDER ANCHORS UNDER)
fetch("src/data/plans.json")
    .then((res) => res.json())
    .then((rooms) => {
        const tableBody = document.getElementById("roomsTableBody");
        const cardsContainer = document.getElementById("roomsCards");

        tableBody.innerHTML = "";
        cardsContainer.innerHTML = "";

        rooms.forEach((room) => {
            const price = Number(room.price).toLocaleString("en-US");

            /* =========================
               MOBILE CARD
            ========================= */
            const card = document.createElement("div");
            card.className =
                "bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden mx-4";

            card.innerHTML = `
        <div class="p-4 flex gap-4">
          <img
            src="${room.image}"
            alt="${room.name} floor plan"
            class="w-24 h-20 object-cover rounded-md shadow-sm flex-shrink-0 cursor-pointer modal-trigger"
          />

          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">${room.name}</h3>
            <p class="text-sm text-gray-700 mt-1">${room.description}</p>
            <p class="text-sm font-semibold text-gray-900 mt-2"><span>Starting at $</span> ${price}</p>
          </div>
        </div>

        <div class="px-4 pb-4 flex gap-2">
          <a
            onclick="navigateToGallery('${room.planId}')"
            class="flex-1 text-center text-gray-800 text-sm bg-gray-300 px-3 py-2 rounded-md
                   hover:bg-gray-800/80 hover:text-gray-200 font-medium transition-colors duration-300
                   ease-in-out cursor-pointer"
          >
            View Floor Plan
          </a>

          <a
            onclick="navigateToGallery('${room.galleryId}')"
            class="flex-1 text-center text-gray-100 text-sm bg-gray-800 px-3 py-2 rounded-md
                   hover:bg-gray-200 hover:text-gray-600 font-medium transition-colors duration-300
                   ease-in-out cursor-pointer"
          >
            View Gallery
          </a>
        </div>
      `;

            cardsContainer.appendChild(card);

            /* =========================
               DESKTOP TABLE ROW
            ========================= */
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50 transition-colors duration-300 ease-in-out";

            row.innerHTML = `
        <td class="px-4 py-3 text-center">
          <img src="${room.image}" alt="${room.name} floor plan"
          class="w-32 h-24 object-cover rounded-md mx-auto shadow-sm cursor-pointer card-hover modal-trigger">
        </td>

        <td class="px-4 py-3 text-xl font-medium text-gray-800 text-center">
          ${room.name}
        </td>

        <td class="px-4 py-3 text-xl text-gray-800 text-center">
          ${room.description}
        </td>

        <td class="px-4 py-3 text-xl text-gray-800 font-medium text-center">
          <span>$&nbsp;</span>${price}
        </td>

        <td class="px-4 py-3">
          <div class="flex items-center justify-end gap-3">
            <a
              onclick="navigateToGallery('${room.planId}')"
              class="text-gray-800 text-lg bg-gray-300 px-3 py-2 rounded-md
                     hover:bg-gray-800/80 hover:text-gray-200 font-medium transition-colors duration-300
                     ease-in-out whitespace-nowrap cursor-pointer"
            >
              View Floor Plan
            </a>

            <a
              onclick="navigateToGallery('${room.galleryId}')"
              class="text-gray-100 text-lg bg-gray-800 px-3 py-2 rounded-md
                     hover:bg-gray-200 hover:text-gray-600 font-medium transition-colors duration-300
                     ease-in-out whitespace-nowrap cursor-pointer"
            >
              View Gallery
            </a>
          </div>
        </td>
      `;

            tableBody.appendChild(row);
        });
    })
    .catch((err) => console.error("Error loading floor plans:", err));


// Fullscreen image viewer logic
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeButton = imageModal.querySelector("button");

// Open modal when an image is clicked
document.addEventListener("click", (e) => {
    const img = e.target.closest(".modal-trigger");
    if (!img) return;

    modalImage.src = img.getAttribute("data-modal-src") || img.getAttribute("src");
    imageModal.classList.remove("hidden");
});

// Close modal when the Close button is clicked
closeButton.addEventListener("click", () => {
    imageModal.classList.add("hidden");
    document.body.style.overflow = "auto"; // re-enable scroll
});

// Close modal when clicking outside the image or pressing Escape
imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) {
        imageModal.classList.add("hidden");
        document.body.style.overflow = "auto";
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        imageModal.classList.add("hidden");
        document.body.style.overflow = "auto";
    }
});





// Copyright Year
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
