// Constants
const margin = 0.3;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const limitXMin = screenWidth * margin;
const limitXMax = screenWidth * (1 - margin);
const limitYMin = screenHeight * margin;
const limitYMax = screenHeight * (1 - margin);

let mouseX = 0;
let mouseY = 0;
let currentIndex = -1;
let currentColumns = 3;
const minColumns = 1;
const maxColumns = 10;

// Elements
const images = document.querySelectorAll('.image');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const closeBtn = document.getElementById('close-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const grid = document.querySelector('.grid');
const timeDisplay = document.getElementById('timeDisplay');

// Track image properties
const imageProperties = Array.from(images).map(image => {
  const width = image.width || 150;
  const height = image.height || 150;
  return { element: image, width, height, x: (screenWidth - width) / 2, y: (screenHeight - height) / 2 };
});

// Preload images
images.forEach(img => new Image().src = img.src);

// Update grid layout
function updateGridColumns(cols) {
  if (grid) grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
}

// Shuffle image positions
function shuffleImages() {
  imageProperties.forEach(img => {
    img.x = Math.random() * (screenWidth - img.width);
    img.y = Math.random() * (screenHeight - img.height);
  });
}

// Modal controls
function showImage(index) {
  currentIndex = (index + images.length) % images.length;
  modalImage.src = images[currentIndex].src;
}

function toggleModal(show) {
  modal.style.display = show ? 'flex' : 'none';
}

// Event Listeners
document.addEventListener('mousemove', e => {
  if (e.clientX >= limitXMin && e.clientX <= limitXMax && e.clientY >= limitYMin && e.clientY <= limitYMax) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
});

images.forEach((img, i) => img.addEventListener('click', () => { showImage(i); toggleModal(true); }));

closeBtn.addEventListener('click', () => toggleModal(false));
window.addEventListener('click', e => (e.target === modal || e.target === modalImage) && toggleModal(false));

// Modal navigation
document.getElementById('prev-arrow').addEventListener('click', () => showImage(currentIndex - 1));
document.getElementById('next-arrow').addEventListener('click', () => showImage(currentIndex + 1));

// Modal input handlers
window.addEventListener('wheel', e => modal.style.display === 'flex' && showImage(currentIndex + (e.deltaY > 0 ? 1 : -1)));

window.addEventListener('keydown', e => {
  if (modal.style.display === 'flex') {
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    else if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  }
});

let touchStartX = 0;
window.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
window.addEventListener('touchend', e => {
  if (modal.style.display === 'flex') {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 10) showImage(currentIndex + (delta < 0 ? 1 : -1));
  }
});

// Light mode toggle
function lightMode() {
  document.body.classList.toggle("light-mode");
}

// Toggle display of custom divs
function toggleDiv(divId) {
  const on = document.getElementById(divId + 'on');
  const off = document.getElementById(divId + 'off');
  if (on.style.display === 'block') {
    on.style.display = 'none';
    off.style.display = 'block';
  } else {
    on.style.display = 'block';
    off.style.display = 'none';
  }
}

// Filter controls
function setFilter(filterClass) {
  document.querySelectorAll('.image').forEach(img => img.style.display = 'none');
  document.querySelectorAll('.about').forEach(el => el.style.display = 'none');
  if (filterClass === 'about') {
    document.querySelector('.about')?.style.display = 'block';
  } else {
    document.querySelectorAll(`.${filterClass}`).forEach(el => el.style.display = 'block');
  }
}

function toggleActive(button) {
  document.querySelectorAll('.shuffle-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

// Timer
let seconds = 0;
setInterval(() => {
  seconds++;
  if (timeDisplay) timeDisplay.innerText = `${seconds} seconds`;
}, 1000);

// Grid zoom gestures (desktop + touch)
if (grid) {
  updateGridColumns(currentColumns);

  // Horizontal scroll on desktop
  grid.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      currentColumns = Math.max(minColumns, Math.min(maxColumns, currentColumns + (e.deltaX > 0 ? 1 : -1)));
      updateGridColumns(currentColumns);
      e.preventDefault();
    }
  });

  // Pinch to zoom on mobile
  let initialPinchDistance = null;

  grid.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance = Math.hypot(dx, dy);
    }
  });

  grid.addEventListener('touchmove', e => {
    if (e.touches.length === 2 && initialPinchDistance !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.hypot(dx, dy);

      const delta = currentDistance - initialPinchDistance;
      if (Math.abs(delta) > 20) {
        currentColumns = Math.max(minColumns, Math.min(maxColumns, currentColumns + (delta > 0 ? 1 : -1)));
        updateGridColumns(currentColumns);
        initialPinchDistance = currentDistance;
      }
      e.preventDefault();
    }
  });

  grid.addEventListener('touchend', () => initialPinchDistance = null);
} else {
  console.error("Grid element with class 'grid' not found.");
}
