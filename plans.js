
// Fetch data and initialize
fetch("src/data/plans.json")
    .then((res) => res.json())
    .then((plans) => {
        const list = document.getElementById("plansList");
        if (!list) return;

        list.innerHTML = "";

        plans.forEach((p) => {
            const card = document.createElement("article");
            card.className =
                "bg-white border border-gray-200 rounded-xl shadow-sm p-6 " +
                "hover:shadow-md transform hover:scale-[1.01] transition-transform duration-300";

            const price = Number(p.price || 0).toLocaleString("en-US");
            const longDesc =
                (p.descriptionLong && p.descriptionLong.trim()) ||
                "A thoughtfully designed layout with modern finishes and comfortable living space.";

            card.innerHTML = `
        <div id=${escapeHtml(p.planId)} class="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Text -->
          <div class="lg:col-span-5">
            <div class="flex items-start justify-between gap-4">
              <h2 class="text-xl md:text-2xl font-semibold text-gray-900">
                ${escapeHtml(p.name)}
              </h2>
              <div class="text-lg md:text-xl font-semibold text-gray-900 whitespace-nowrap">
                <span class="font-normal text-md md:text-lg">starting at</span> $${price}
              </div>
            </div>

            <p class="mt-2 text-gray-700">
              ${escapeHtml(p.description || "")}
            </p>

            <p class="mt-4 text-gray-700 leading-relaxed">
              ${escapeHtml(longDesc)}
            </p>

            <div class="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                data-open-plan="${escapeAttr(p.image)}"
                class="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gray-200 text-gray-800
                       hover:bg-gray-300 transition-colors font-medium"
              >
                View Floor Plan
              </button>

              <a
                href="gallery.html#${encodeURIComponent(p.galleryId)}"
                class="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gray-800 text-gray-100
                       hover:bg-gray-700 transition-colors font-medium"
              >
                View Gallery
              </a>
            </div>
          </div>

          <!-- Image Preview -->
          <div class="lg:col-span-7 flex justify-center lg:justify-end">
            <div class="w-full max-w-md rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <div class="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 font-medium">
                Preview
              </div>

              <img
                src="${escapeAttr(p.image)}"
                alt="${escapeAttr(p.name)} floor plan"
                class="w-full aspect-[4/3] object-cover bg-white cursor-pointer hover:opacity-95 transition-opacity"
                data-open-plan="${escapeAttr(p.image)}"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      `;

            list.appendChild(card);
        });
        scrollToHashIfPresent();

        // Modal wiring (optional but nice)
        setupPlanModal();
    })
    .catch((err) => console.error("Error loading floor plans:", err));

/* ===== Modal ===== */
function setupPlanModal() {
    const modal = document.getElementById("imageModal");
    const img = document.getElementById("modalImage");
    const closeBtn = document.getElementById("closeModalBtn");

    if (!modal || !img) return;

    // Open (event delegation)
    document.addEventListener("click", (e) => {
        const el = e.target.closest("[data-open-plan]");
        if (!el) return;

        const src = el.getAttribute("data-open-plan");
        if (!src) return;

        img.src = src;
        modal.classList.remove("hidden");
        modal.classList.add("flex");

        // disable scroll behind modal
        document.body.style.overflow = "hidden";
    });

    // Close
    function close() {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        img.src = "";
        document.body.style.overflow = "";
    }

    closeBtn?.addEventListener("click", close);

    // click backdrop closes
    modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
    });

    // ESC closes
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
    });
}

/* ===== Helpers ===== */
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

