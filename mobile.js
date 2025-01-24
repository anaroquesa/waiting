const images = document.querySelectorAll('.image');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const closeBtn = document.getElementById('close-btn');
const shuffleBtn = document.getElementById('shuffle-btn');

let currentIndex = -1;
let mouseX = 0;
let mouseY = 0;

const desiredDistance = 100;

// Margin limits (30% of the screen size)
const margin = 0.3;

// Calculate the boundaries (70% of screen size)
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const limitXMin = screenWidth * margin;
const limitXMax = screenWidth * (1 - margin);
const limitYMin = screenHeight * margin;
const limitYMax = screenHeight * (1 - margin);

const imageProperties = Array.from(images).map(image => {
  const imageWidth = image.width || 150; // Default width
  const imageHeight = image.height || 150; // Default height
  return {
    element: image,
    width: imageWidth,
    height: imageHeight,
    x: (screenWidth - imageWidth) / 2, // Center horizontally
    y: (screenHeight - imageHeight) / 2, // Center vertically
    velocityX: 0,
    velocityY: 0,
    variationStrength: 0.5,
    paused: false, // New property to track hover state
  };
});

// Preload images
function preloadImages() {
  images.forEach(image => {
    const img = new Image();
    img.src = image.src; // Preload each image
  });
}

// Handle mouse movement
document.addEventListener('mousemove', (event) => {
  if (
    event.clientX >= limitXMin &&
    event.clientX <= limitXMax &&
    event.clientY >= limitYMin &&
    event.clientY <= limitYMax
  ) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
});

// Handle touch movement for mobile
document.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  mouseX = touch.clientX;
  mouseY = touch.clientY;
});

// Open modal
images.forEach((image, index) => {
  image.addEventListener('click', () => {
    currentIndex = index;
    modal.style.display = 'flex';
    modalImage.src = image.src;
  });
});

// Close modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal || event.target === modalImage) {
    modal.style.display = 'none';
  }
});

// Navigate images in modal
document.getElementById('prev-arrow').addEventListener('click', showPreviousImage);
document.getElementById('next-arrow').addEventListener('click', showNextImage);

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  modalImage.src = images[currentIndex].src;
}

function showPreviousImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  modalImage.src = images[currentIndex].src;
}

// Shuffle images
function shuffleImages() {
  resetFilters();
  imageProperties.forEach((image) => {
    image.x = Math.random() * (screenWidth - image.width);
    image.y = Math.random() * (screenHeight - image.height);
  });
}

// Scroll to navigate modal
window.addEventListener('wheel', (event) => {
  if (modal.style.display === 'flex') {
    if (event.deltaY > 0) {
      showNextImage();
    } else {
      showPreviousImage();
    }
    event.preventDefault();
  }
});

// Swipe navigation for mobile
let touchStartX = 0;
const swipeThreshold = 50; // Minimum swipe distance

window.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
});

window.addEventListener('touchend', (event) => {
  const touchEndX = event.changedTouches[0].clientX;
  const distance = touchEndX - touchStartX;

  if (modal.style.display === 'flex') {
    if (distance < -swipeThreshold) {
      showNextImage();
    } else if (distance > swipeThreshold) {
      showPreviousImage();
    }
  }
});

// Keyboard navigation
window.addEventListener('keydown', (event) => {
  if (modal.style.display === 'flex') {
    if (event.key === 'ArrowRight') {
      showNextImage();
    } else if (event.key === 'ArrowLeft') {
      showPreviousImage();
    }
  }
});

// Filter functions
function filterAbout() {
  toggleImagesDisplay('.about', true);
}

function filterAll() {
  toggleImagesDisplay('.image', false);
}

function filterLogos() {
  toggleImagesDisplay('#logo', false);
}

function filterIllustrations() {
  toggleImagesDisplay('#illustration', false);
}

function filterEditorials() {
  toggleImagesDisplay('#editorial', false);
}

function filterWebs() {
  toggleImagesDisplay('#web', false);
}

function toggleImagesDisplay(selector, aboutOnly) {
  images.forEach(image => image.style.display = 'none');
  const about = document.querySelector('.about');
  if (about) about.style.display = aboutOnly ? 'block' : 'none';
  document.querySelectorAll(selector).forEach(element => {
    element.style.display = 'block';
  });
}

// Toggle active button
function toggleActive(button) {
  const buttons = document.querySelectorAll('.shuffle-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

// Dynamic grid column adjustment
let currentColumns = 3; // Default number of columns
const minColumns = 1;
const maxColumns = 10;

function updateGridColumns(columns) {
  const grid = document.querySelector('.grid');
  if (grid) {
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
}

document.querySelector('.grid').addEventListener('wheel', (event) => {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    if (event.deltaX > 0 && currentColumns < maxColumns) {
      currentColumns++;
    } else if (event.deltaX < 0 && currentColumns > minColumns) {
      currentColumns--;
    }
    updateGridColumns(currentColumns);
    event.preventDefault();
  }
});

// Light mode toggle
function lightMode() {
  document.body.classList.toggle('light-mode');
}

// Preload images when the page loads
preloadImages();
