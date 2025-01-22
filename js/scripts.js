const container = document.querySelector(".image-container");
const fileInput = document.querySelector("#fileInput");
const div = document.querySelector(".movable");
let offsetX, offsetY, isDragging = false;

// Trigger file input when upload button is clicked
uploadButton.addEventListener("click", () => {
    fileInput.click();
});

// Handle file input change
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            createMovableImage(reader.result);
        };
        reader.readAsDataURL(file);
    }
});

// Function to constrain movement within the container
function constrainMovement() {
    const rect = div.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (rect.left < containerRect.left) {
        div.style.left = "0px";
    } else if (rect.right > containerRect.right) {
        div.style.left = `${containerRect.width - rect.width}px`;
    }

    if (rect.top < containerRect.top) {
        div.style.top = "0px";
    } else if (rect.bottom > containerRect.bottom) {
        div.style.top = `${containerRect.height - rect.height}px`;
    }
}

// Function to constrain resizing within the container
function constrainResize() {
    const rect = div.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (rect.left < containerRect.left) {
        div.style.width = `${rect.width + (rect.left - containerRect.left)}px`;
        div.style.left = "0px";
    }

    if (rect.top < containerRect.top) {
        div.style.height = `${rect.height + (rect.top - containerRect.top)}px`;
        div.style.top = "0px";
    }

    if (rect.right > containerRect.right) {
        div.style.width = `${containerRect.right - rect.left}px`;
    }

    if (rect.bottom > containerRect.bottom) {
        div.style.height = `${containerRect.bottom - rect.top}px`;
    }
}


// Function to show the border when clicked
div.addEventListener("mousedown", (e) => {
    if (!e.target.classList.contains("resizer")) {
        div.style.border = "2px solid #babaf5;";
    }
});

// Function to hide the border when clicking outside
document.addEventListener("mousedown", (e) => {
    if (!div.contains(e.target)) {
        div.style.border = "none";
    }
});

// Function to show the resizers
function showResizers() {
    const resizers = document.querySelectorAll(".resizer");
    resizers.forEach(resizer => {
        resizer.style.display = "block";
    });
}

// Function to hide the resizers
function hideResizers() {
    const resizers = document.querySelectorAll(".resizer");
    resizers.forEach(resizer => {
        resizer.style.display = "none";
    });
}

// Show border and resizers when clicking inside
div.addEventListener("mousedown", (e) => {
    if (!e.target.classList.contains("resizer")) {
        div.style.border = "2px solid #babaf5;";
        showResizers();
    }
});

// Hide border and resizers when clicking outside
document.addEventListener("mousedown", (e) => {
    if (!div.contains(e.target)) {
        div.style.border = "none";
        hideResizers();
    }
});



// Dragging functionality
div.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("resizer")) return; // Skip dragging if resizing
    isDragging = true;
    offsetX = e.clientX - div.offsetLeft;
    offsetY = e.clientY - div.offsetTop;
    div.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        div.style.left = `${e.clientX - offsetX}px`;
        div.style.top = `${e.clientY - offsetY}px`;
        constrainMovement();
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    div.style.cursor = "grab";
});

// Resizing functionality
const resizers = document.querySelectorAll(".resizer");
let isResizing = false, currentResizer;

resizers.forEach(resizer => {
    resizer.addEventListener("mousedown", (e) => {
        isResizing = true;
        currentResizer = e.target;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
        e.stopPropagation(); // Prevent drag while resizing
    });
});

function resize(e) {
    if (!isResizing) return;

    const rect = div.getBoundingClientRect();

    if (currentResizer.classList.contains("bottomright")) {
        div.style.width = `${e.clientX - rect.left}px`;
        div.style.height = `${e.clientY - rect.top}px`;
    } else if (currentResizer.classList.contains("bottomleft")) {
        div.style.width = `${rect.right - e.clientX}px`;
        div.style.left = `${e.clientX}px`;
        div.style.height = `${e.clientY - rect.top}px`;
    } else if (currentResizer.classList.contains("topright")) {
        div.style.width = `${e.clientX - rect.left}px`;
        div.style.height = `${rect.bottom - e.clientY}px`;
        div.style.top = `${e.clientY}px`;
    } else if (currentResizer.classList.contains("topleft")) {
        div.style.width = `${rect.right - e.clientX}px`;
        div.style.left = `${e.clientX}px`;
        div.style.height = `${rect.bottom - e.clientY}px`;
        div.style.top = `${e.clientY}px`;
    } else if (currentResizer.classList.contains("top")) {
        div.style.height = `${rect.bottom - e.clientY}px`;
        div.style.top = `${e.clientY}px`;
    } else if (currentResizer.classList.contains("bottom")) {
        div.style.height = `${e.clientY - rect.top}px`;
    } else if (currentResizer.classList.contains("left")) {
        div.style.width = `${rect.right - e.clientX}px`;
        div.style.left = `${e.clientX}px`;
    } else if (currentResizer.classList.contains("right")) {
        div.style.width = `${e.clientX - rect.left}px`;
    }
    constrainMovement();
}

function stopResize() {
    isResizing = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
}