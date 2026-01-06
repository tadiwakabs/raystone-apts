// Load and render restaurants
fetch("src/data/restaurants.json")
    .then(res => res.json())
    .then(restaurants => {
        const walking = restaurants.filter(r => r.walk);
        const driving = restaurants.filter(r => r.drive);
        const casual = restaurants.filter(r => r.casual);
        const fineDining = restaurants.filter(r => r.fineDining);
        const vegan = restaurants.filter(r => r.vegan);

        function renderCategory(title, list, id) {
            if (list.length === 0) return "";
            const items = list.map(
                r => `
        <div class="p-4 border rounded-lg hover:shadow-md transition hover:bg-gray-50">
          <h3 class="font-semibold text-lg text-blue-800">${r.name}</h3>
          <p class="text-gray-800">${r.description}</p>
        </div>`
            ).join("");

            return `
      <div id="${id}" class="mb-10 scroll-mt-24">
        <h2 class="text-2xl font-semibold text-blue-700 mb-4 text-center">${title}</h2>
        <div class="grid md:grid-cols-2 gap-4">${items}</div>
      </div>`;
        }

        function renderQuickSuggestions() {
            const categories = [
                { id: "walking", title: "Within Walking Distance", data: walking },
                { id: "driving", title: "Short Drive", data: driving },
                { id: "casual", title: "Casual & Family-Friendly", data: casual },
                { id: "fineDining", title: "Fine Dining & Ocean View", data: fineDining },
                { id: "vegan", title: "Vegan & Healthy Eats", data: vegan }
            ];

            const suggestions = categories.map(cat => {
                const sample = cat.data.slice(0, 4);
                if (sample.length === 0) return "";
                const items = sample.map(r => `<li class="text-blue-800 font-medium">${r.name}</li>`).join("");
                return `
          <div 
            class="p-4 border rounded-lg hover:shadow-md transition hover:bg-gray-50 cursor-pointer"
            data-target="${cat.id}">
            <h3 class="font-semibold text-lg text-blue-700 mb-2">${cat.title}</h3>
            <ul class="list-disc list-inside text-gray-700 space-y-1">${items}</ul>
          </div>`;
            }).join("");

            return `
      <div class="mb-12">
        <h2 class="text-3xl font-semibold text-blue-800 mb-6 text-center">Quick Suggestions</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">${suggestions}</div>
      </div>`;
        }

        const content = `
      ${renderQuickSuggestions()}
      ${renderCategory("Within Walking Distance (0 – 10 minutes)", walking, "walking")}
      ${renderCategory("Short Drive (5 – 15 minutes)", driving, "driving")}
      ${renderCategory("Casual & Family-Friendly Spots", casual, "casual")}
      ${renderCategory("Fine Dining & Ocean View Experiences", fineDining, "fineDining")}
      ${renderCategory("Vegan & Healthy Eats", vegan, "vegan")}
    `;

        const container = document.getElementById("restaurantsSection");
        container.innerHTML = content;

        // Smooth scroll for Quick Suggestions
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
    .catch(err => console.error("Error loading restaurants:", err));
