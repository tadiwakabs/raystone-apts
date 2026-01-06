// Selectors
const amenitiesGrid = document.getElementById("amenitiesGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

// Create category title above the grid (hidden on mobile)
const categoryTitle = document.createElement("h2");
categoryTitle.className =
    "flex justify-center text-2xl font-semibold text-gray-800 mb-4 md:block md:hidden";
amenitiesGrid.parentNode.insertBefore(categoryTitle, amenitiesGrid);

let amenities = []; // Loaded from JSON

// Fetch data and initialize
fetch("src/data/amenities.json")
    .then((res) => res.json())
    .then((data) => {
        amenities = data;
        setupFilterButtons();
        renderAmenities("Featured");
        highlightDefaultButton();
    })
    .catch((err) => console.error("Error loading amenities:", err));

// Render amenities based on filter
function renderAmenities(filter = "Featured") {
    amenitiesGrid.innerHTML = "";
    categoryTitle.textContent = "";

    let filtered = amenities;

    if (filter === "Featured") {
        filtered = amenities.filter((a) => a.featured);
    } else if (filter !== "All") {
        filtered = amenities.filter(a =>
            Array.isArray(a.category) ? a.category.includes(filter) : a.category === filter
        );
    }

    // Set title
    categoryTitle.textContent = filter;
    categoryTitle.classList.remove("hidden");

    // Render each amenity
    filtered.forEach((a) => {
        const div = document.createElement("div");
        div.className =
            "flex items-center gap-3 p-3 border border-gray-600 rounded-md hover:bg-gray-50 transition";
        div.innerHTML = `
      <div class="w-6 h-6">${a.icon}</div>
      <span class="text-gray-800 font-medium md:text-lg">${a.name}</span>
    `;
        amenitiesGrid.appendChild(div);
    });
}

// Setup filter buttons
function setupFilterButtons() {
    filterButtons.forEach((btn) => {
        btn.classList.add("rounded-full", "transition", "hover:bg-gray-200");

        btn.addEventListener("click", () => {
            // Reset all buttons
            filterButtons.forEach((b) => {
                b.classList.remove("bg-gray-100");
                b.classList.add("hover:bg-gray-200");
            });

            // Highlight clicked one
            btn.classList.add("bg-gray-100");
            btn.classList.remove("hover:bg-gray-200");

            // Render filtered list
            renderAmenities(btn.dataset.filter);
        });
    });
}

// Highlight the Featured button on load
function highlightDefaultButton() {
    const featuredBtn = document.querySelector('.filter-btn[data-filter="Featured"]');
    if (featuredBtn) {
        featuredBtn.classList.add("bg-gray-100");
        featuredBtn.classList.remove("hover:bg-gray-200");
    }
}
