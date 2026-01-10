let GALLERIES = [];          // array from JSON
let galleriesByGroup = {};   // { pelican: [...], exterior: [...] }
let groupTitleByGroup = {};  // { pelican: "The Pelican", ... }

let currentGallery = [];
let currentIndex = 0;
let lightboxOpen = false;

fetch("src/data/galleries.json")
    .then((res) => res.json())
    .then((data) => {
        GALLERIES = data;

        // Build quick lookup by group
        galleriesByGroup = {};
        groupTitleByGroup = {};

        data.forEach((section) => {
            galleriesByGroup[section.group] = section.images;
            groupTitleByGroup[section.group] = section.title;
        });

        renderGallerySections(data);
        setupDeepLinkOpen(); // supports ?room=pelican-g
    })
    .catch((err) => console.error("Error loading galleries:", err));

function renderGallerySections(sections) {
    const wrap = document.getElementById("gallerySections");
    if (!wrap) return;

    wrap.innerHTML = "";

    sections.forEach((sec) => {
        const sectionEl = document.createElement("section");
        const expandableId = `expand-${sec.id}`;
        const arrowId = `arrow-${sec.id}`;

        sectionEl.className = "max-w-6xl mx-auto px-4 py-0.5 mt-4 scroll-mt-24";
        sectionEl.id = sec.id;

        // Pick first 6 images for preview grid
        const preview = sec.images.slice(0, 6);

        sectionEl.innerHTML = `
      <button
        onclick="toggleSection('${expandableId}', '${arrowId}')"
        class="h-20 w-full border border-x-blue-50/0 flex items-center justify-between text-gray-800
               px-4 py-2 select-none transform hover:scale-102 transition-transform duration-300"
      >
        <span class="text-2xl md:text-3xl font-medium">${escapeHtml(sec.title)}</span>

        <svg id="${escapeAttr(arrowId)}" class="w-5 h-5 transform transition-transform duration-300 rotate-180"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div id="${escapeAttr(expandableId)}"
           class="transition-all duration-500 ease-in-out overflow-hidden max-h-[1500px]
                  border-l border-r border-b border-gray-800/20"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto p-4 max-w-6xl">
          ${preview.map((img, i) => `
            <div class="aspect-[4/3]">
              <img
                src="${escapeAttr(img.src)}"
                alt="${escapeAttr(img.name || sec.title)}"
                class="w-full h-full object-cover cursor-pointer card-hover rounded-md"
                onclick="openLightbox('${escapeAttr(sec.group)}', ${i})"
              />
            </div>
          `).join("")}
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 px-4">
          <button
            class="flex items-center justify-center text-white text-lg sm:text-2xl bg-gray-800 px-10 py-3
                   mt-2 rounded-md w-full sm:w-auto hover:bg-gray-200 hover:text-gray-800 font-medium
                   transition-colors duration-300 ease-in-out cursor-pointer"
            onclick="openLightbox('${escapeAttr(sec.group)}', 0)"
          >
            View All
          </button>
        </div>
      </div>
    `;

        wrap.appendChild(sectionEl);
    });
    scrollToHashIfPresent();
}

/* ===== Lightbox (same idea as your old one) ===== */

function openLightbox(group, index) {
    currentGallery = galleriesByGroup[group] || [];
    currentIndex = index;

    if (!currentGallery.length) return;

    document.getElementById("lightbox").classList.remove("hidden");
    lightboxOpen = true;
    updateLightbox(group);
}

function closeLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
    lightboxOpen = false;
}

function updateLightbox(group) {
    const img = document.getElementById("lightbox-img");
    const counter = document.getElementById("lightbox-counter");
    const roomLabel = document.getElementById("lightbox-room");

    img.classList.add("opacity-0");
    setTimeout(() => {
        const item = currentGallery[currentIndex];
        img.src = item.src;
        roomLabel.textContent = item.name || groupTitleByGroup[group] || "Gallery";
        counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;

        img.onload = () => img.classList.remove("opacity-0");
    }, 150);
}

function nextImage() {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightbox(getCurrentGroup());
}

function prevImage() {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightbox(getCurrentGroup());
}

// Best-effort current group (based on currentGallery reference)
function getCurrentGroup() {
    for (const group of Object.keys(galleriesByGroup)) {
        if (galleriesByGroup[group] === currentGallery) return group;
    }
    return "";
}

/* ===== Deep link support: ?room=pelican-g ===== */

function setupDeepLinkOpen() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("room");
    if (!id) return;

    const targetSection = GALLERIES.find((g) => g.id === id);
    if (!targetSection) return;

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => openLightbox(targetSection.group, 0), 350);
}

/* ===== Your existing toggleSection can stay the same ===== */
// toggleSection(expandableId, arrowId) { ... }

/* ===== small helpers ===== */

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
    return escapeHtml(str).replaceAll("`", "&#096;");
}

function scrollToHashIfPresent() {
    const id = decodeURIComponent(window.location.hash.replace("#", ""));
    if (!id) return;

    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });

        if (window.location.pathname.endsWith("gallery.html") && typeof openLightboxFromId === "function") {
            openLightboxFromId(id);
        }
    }
}
