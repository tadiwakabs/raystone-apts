// Load and render attractions
fetch("src/data/attractions.json")
    .then(res => res.json())
    .then(attractions => {
        const walking = attractions.filter(a => a.walk);
        const driving = attractions.filter(a => a.drive && !a.walk);
        const family = attractions.filter(a => a.family);
        const nature = attractions.filter(a => a.nature);

        // Helper: render full category with descriptions
        function renderCategory(title, list, id) {
            if (list.length === 0) return "";
            const items = list
                .map(
                    a => `
          <div class="p-4 border rounded-lg hover:shadow-md transition hover:bg-gray-50">
            <h3 class="font-semibold text-lg text-blue-800">${a.name}</h3>
            <p class="text-gray-800">${a.description}</p>
          </div>`
                )
                .join("");
            return `
        <div id="${id}" class="mb-10 scroll-mt-24"> <!-- Increased scroll margin for fixed header -->
          <h2 class="text-2xl font-semibold text-blue-700 mb-4 text-center">${title}</h2>
          <div class="grid md:grid-cols-2 gap-4">${items}</div>
        </div>`;
        }

        // Helper: render Quick Suggestions
        function renderQuickSuggestions() {
            const categories = [
                { id: "walking", title: "Within Walking Distance (0 – 1 km)", data: walking },
                { id: "driving", title: "Short Drive (1 – 5 km)", data: driving },
                { id: "family", title: "Half-Day & Family Outings (10 – 20 min drive)", data: family },
                { id: "nature", title: "Cultural & Nature Excursions (20 min – 1 hour drive)", data: nature }
            ];

            const suggestions = categories
                .map(cat => {
                    const sample = cat.data.slice(0, 4);
                    if (sample.length === 0) return "";
                    const items = sample
                        .map(a => `<li class="text-blue-800 font-medium">${a.name}</li>`)
                        .join("");
                    return `
            <div 
              class="p-4 border rounded-lg hover:shadow-md transition hover:bg-gray-50 cursor-pointer"
              data-target="${cat.id}">   <!-- Add data-target for JS click -->
              <h3 class="font-semibold text-lg text-blue-700 mb-2">${cat.title}</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">${items}</ul>
            </div>`;
                })
                .join("");

            return `
        <div class="mb-12">
          <h2 class="text-3xl font-semibold text-blue-800 mb-6 text-center">Quick Suggestions</h2>
          <div id="quickSuggestions" class="grid md:grid-cols-2 gap-4">${suggestions}</div>
        </div>`;
        }

        // Assemble full content
        const content = `
      ${renderQuickSuggestions()}
      ${renderCategory("Within Walking Distance (0 – 1 km)", walking, "walking")}
      ${renderCategory("Short Drive (1 – 5 km)", driving, "driving")}
      ${renderCategory("Half-Day & Family Outings (10 – 20 min drive)", family, "family")}
      ${renderCategory("Cultural & Nature Excursions (20 min – 1 hour drive)", nature, "nature")}
    `;

        const container = document.getElementById("attractionsSection");
        container.innerHTML = content;

        // Add interactivity after rendering
        document.querySelectorAll("[data-target]").forEach(box => {
            box.addEventListener("click", () => {
                const targetId = box.dataset.target;
                const target = document.getElementById(targetId);

                if (target) {
                    const headerOffset = window.innerWidth < 768 ? 80 : 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });
    })
    .catch(err => console.error("Error loading attractions:", err));
