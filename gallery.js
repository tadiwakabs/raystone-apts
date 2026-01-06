// Gallery Popup Functionality

const galleries = {
    interior: [
        { src: "src/images/sealodgepics/bedroom1-1.jpg", name: "Bedroom" },
        { src: "src/images/sealodgepics/bedroom2-1.jpg", name: "Bedroom" },
        { src: "src/images/sealodgepics/bedroom3-1.jpg", name: "Bedroom" },
        { src: "src/images/sealodgepics/bedroom3-2.jpg", name: "Bedroom" },
        { src: "src/images/sealodgepics/ACinbedroom.jpg", name: "Bedroom" },
        { src: "src/images/sealodgepics/kitchen-1.jpg", name: "Kitchen" },
        { src: "src/images/sealodgepics/kitchen-2.jpg", name: "Kitchen" },
        { src: "src/images/sealodgepics/kitchen-3.jpg", name: "Kitchen" },
        { src: "src/images/sealodgepics/kitchen-4.jpg", name: "Kitchen" },
        { src: "src/images/sealodgepics/kitchen-5.jpg", name: "Kitchen" },
        { src: "src/images/sealodgepics/bathroom1.jpeg", name: "Bathroom" },
        { src: "src/images/sealodgepics/shower.jpg", name: "Bathroom" },
        { src: "src/images/sealodgepics/living-1.jpg", name: "Living Room" },
        { src: "src/images/sealodgepics/living-2.jpg", name: "Living Room" },
        { src: "src/images/sealodgepics/living-3.jpg", name: "Living Room" },
        { src: "src/images/sealodgepics/dining-1.jpg", name: "Dining Area" },
        { src: "src/images/sealodgepics/dining-2.jpg", name: "Dining Area" },
        { src: "src/images/sealodgepics/balcony-1.jpg", name: "Balcony" },
        { src: "src/images/sealodgepics/balcony-2.jpg", name: "Balcony" },
        { src: "src/images/sealodgepics/wall.jpg", name: "Balcony" },
    ],
    exterior: [
        { src: "src/images/sealodgepics/pool-1.jpg", name: "Pool Area" },
        { src: "src/images/sealodgepics/pool-2.jpg", name: "Pool Area" },
        { src: "src/images/sealodgepics/pool-3.jpg", name: "Pool Area" },
        { src: "src/images/sealodgepics/pool-4.jpg", name: "Pool Area" },
        { src: "src/images/sealodgepics/parking2.jpg", name: "Parking" },
        { src: "src/images/sealodgepics/parking.jpg", name: "Parking" },
        { src: "src/images/sealodgepics/sealodgesign.jpg", name: "Entrance" },
        { src: "src/images/sealodgepics/pier.jpg", name: "Pier" },
    ],
};


const roomNames = {
    interior: "Interior",
    exterior: "Exterior",
};

let currentGallery = [];
let currentIndex = 0;
let lightboxOpen = false;

function openLightbox(room, index) {
    currentGallery = galleries[room];
    currentIndex = index;
    document.getElementById("lightbox").classList.remove("hidden");
    lightboxOpen = true;
    updateLightbox();
}


function closeLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
    lightboxOpen = false;
}

function updateLightbox() {
    const img = document.getElementById("lightbox-img");
    const counter = document.getElementById("lightbox-counter");
    const roomLabel = document.getElementById("lightbox-room");

    img.classList.add("opacity-0"); // fade out
    setTimeout(() => {
        const currentItem = currentGallery[currentIndex];
        img.src = currentItem.src;
        roomLabel.textContent = currentItem.name; // show image name
        counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
        img.onload = () => img.classList.remove("opacity-0");
    }, 200);
}


function nextImage() {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightbox("next");
}

function prevImage() {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightbox("prev");
}

// Keyboard Support
document.addEventListener("keydown", (event) => {
    if (!lightboxOpen) return; // only trigger when lightbox is active

    switch (event.key) {
        case "Escape":
            closeLightbox();
            break;
        case "ArrowRight":
            nextImage();
            break;
        case "ArrowLeft":
            prevImage();
            break;
    }
});

// Mobile Swipe Support
let startX = 0;
let endX = 0;


const lightboxImg = document.getElementById("lightbox-img");

// Touch start
lightboxImg.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

// Touch end
lightboxImg.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = endX - startX;

    if (Math.abs(swipeDistance) > 50) {  // threshold so tiny drags don’t trigger
        if (swipeDistance < 0) {
            nextImage();   // swipe left → next
        } else {
            prevImage();   // swipe right → previous
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");

    if (roomParam) {
        const section = document.getElementById(roomParam);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }

        // Delay a bit to allow the page to load before opening
        setTimeout(() => {
            openLightboxFromId(roomParam);
        }, 400);
    }
});

// Helper function to match room IDs to gallery groups and open lightbox
function openLightboxFromId(galleryId) {
    const roomMap = {
        "bedroom-g": { group: "interior", match: "bedroom" },
        "bathroom-g": { group: "interior", match: "bathroom" },
        "kitchen-g": { group: "interior", match: "kitchen" },
        "dining-g": { group: "interior", match: "dining" },
        "living-g": { group: "interior", match: "living" },
        "balcony-g": { group: "interior", match: "balcony" },
    };

    const entry = roomMap[galleryId];
    if (!entry) return;

    const { group, match } = entry;
    const gallery = galleries[group];

    // Find first image that matches the room keyword in src or name
    const index = gallery.findIndex(
        (img) =>
            img.src.toLowerCase().includes(match) ||
            img.name.toLowerCase().includes(match)
    );

    // Default to first image if not found
    openLightbox(group, index === -1 ? 0 : index);
}
