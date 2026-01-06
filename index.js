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

// Load room info
fetch("src/data/rooms.json")
    .then((res) => res.json())
    .then((rooms) => {
        const tableBody = document.getElementById("roomsTableBody");
        tableBody.innerHTML = "";

        rooms.forEach((room) => {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50 transition-colors duration-300 ease-in-out";
            row.innerHTML = `
        <td class="px-4 py-3 text-center">
          <img src="${room.image}" alt="${room.name}" 
          class="w-32 h-24 object-cover rounded-md mx-auto shadow-sm cursor-pointer card-hover">
        </td>
        <td class="md:px-4 py-3 text-lg md:text-xl font-medium text-blue-800">
          ${room.name}
        </td>
        <td class="px-2 md:px-4 py-3 text-sm md:text-xl text-gray-800">
          ${room.description}
        </td>
        <td class="md:px-2 py-3 text-xl">
          <div class="flex max-md:flex-col items-center gap-3">
            <a
              onclick="navigateToGallery('${room.galleryId}')"
              class="max-md:hidden text-white text-sm md:text-lg bg-blue-800 px-3 py-2 rounded-md w-auto
                     hover:bg-blue-100 hover:text-blue-600 font-medium transition-colors duration-300
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
    .catch((err) => console.error("Error loading rooms:", err));

// Fullscreen image viewer logic
const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeButton = imageModal.querySelector("button");

// Open modal when an image is clicked
document.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" && (e.target.closest("#roomsTableBody") || e.target.closest("#footerImages"))) {
        modalImage.src = e.target.src;
        imageModal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // disable scroll
    }
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
