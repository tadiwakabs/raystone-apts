fetch("src/data/brochures.json")
    .then((res) => res.json())
    .then((items) => {
        const list = document.getElementById("brochureList");
        if (!list) return;

        list.innerHTML = "";

        items.forEach((b) => {
            const card = document.createElement("article");
            card.className =
                "bg-white border border-gray-200 rounded-xl shadow-sm p-6 " +
                "hover:shadow-md transform hover:scale-[1.01] transition-transform duration-300";

            const fileName = getFileName(b.link);

            card.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Text -->
          <div class="lg:col-span-5">
            <h2 class="text-xl md:text-2xl font-semibold text-gray-900">
              ${escapeHtml(b.name)}
            </h2>
            <p class="mt-2 text-gray-700 leading-relaxed">
              ${escapeHtml(b.description || "")}
            </p>

            <div class="mt-5 flex flex-wrap gap-3">
              <a href="${b.link}"
                 download="${escapeAttr(fileName)}"
                 class="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gray-800 text-gray-100
                        hover:bg-gray-700 transition-colors font-medium">
                Download PDF
              </a>

              <a href="${b.link}" target="_blank" rel="noopener"
                 class="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gray-200 text-gray-800
                        hover:bg-gray-300 transition-colors font-medium">
                Open in New Tab
              </a>
            </div>

            <p class="mt-3 text-xs text-gray-500">
              PDF • ${escapeHtml(fileName)}
            </p>
          </div>

          <!-- Preview -->
          <div class="lg:col-span-7 justify-self-end">
            <div class="w-80 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <div class="px-4 py-2 border-b border-gray-200 text-sm text-gray-700 font-medium">
                Preview
              </div>

              <!-- Best-effort 1st page preview -->
              <img
                src="${b.previewImage}#page=1&view=FitH"
                class="aspect-[8/11] bg-white w-80"
                alt="preview"
                title="${escapeAttr(b.name)} preview"
              >

              <!-- Fallback message if iframe PDF preview blocked -->
              <div class="px-4 py-3 text-xs text-gray-500">
                If the preview doesn’t load in your browser, use “Open in New Tab” to view the PDF.
              </div>
            </div>
          </div>
        </div>
      `;

            list.appendChild(card);
        });
    })
    .catch((err) => console.error("Error loading brochures:", err));

/* ===== Helpers ===== */

function getFileName(path) {
    try {
        const raw = String(path || "").split("/").pop() || "brochure.pdf";
        // decode spaces like %20 if present
        return decodeURIComponent(raw);
    } catch {
        return "brochure.pdf";
    }
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
    // safe enough for attribute contexts
    return escapeHtml(str).replaceAll("`", "&#096;");
}
