const images = document.querySelectorAll('.image');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const closeBtn = document.getElementById('close-btn');
const shuffleBtn = document.getElementById('shuffle-btn');

let currentIndex = -1;
let mouseX = 0;
let mouseY = 0;

const desiredDistance = 80;

// Margin limits (25% of the screen size)
const margin = 0.25;

// Calculate the boundaries (75% of screen size)
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const limitXMin = screenWidth * margin;
const limitXMax = screenWidth * (1 - margin);
const limitYMin = screenHeight * margin;
const limitYMax = screenHeight * (1 - margin);

const imageProperties = Array.from(images).map(image => {
  const imageWidth = image.width || 150; // Default width (in case image width isn't yet calculated)
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

document.addEventListener('mousemove', (event) => {
  // Check if the mouse is within the defined boundaries
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

// Add event listeners to pause or resume image animation on hover
imageProperties.forEach(image => {
  image.element.addEventListener('mouseover', () => {
    image.paused = true; // Pause movement
  });
  image.element.addEventListener('mouseout', () => {
    image.paused = false; // Resume movement
  });
});

// Open the modal with the clicked image
images.forEach((image, index) => {
  image.addEventListener('click', () => {
    currentIndex = index;
    modal.style.display = 'flex';
    modalImage.src = image.src;
  });
});

// Close the modal when the close button is clicked
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close the modal if the user clicks outside the image
window.addEventListener('click', (event) => {
  if (event.target === modal || event.target === modalImage) {
    modal.style.display = 'none';
  }
});

// Add event listeners for the arrows
document.getElementById('prev-arrow').addEventListener('click', () => {
  showPreviousImage();
});

document.getElementById('next-arrow').addEventListener('click', () => {
  showNextImage();
});

// Function to show the next image
function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  modalImage.src = images[currentIndex].src;
}

// Function to show the previous image
function showPreviousImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  modalImage.src = images[currentIndex].src;
}

// Shuffle button action
shuffleBtn.addEventListener('click', shuffleImages);

function resetFilters() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'block'; // Show all images
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
}

function shuffleImages() {
  resetFilters();
  imageProperties.forEach((image) => {
    image.x = Math.random() * (screenWidth - image.width);
    image.y = Math.random() * (screenHeight - image.height);
  });
}


// Scroll to switch images in the modal
window.addEventListener('wheel', (event) => {
  if (modal.style.display === 'flex') {
    if (event.deltaY > 0) {
      showNextImage();
    } else {
      showPreviousImage();
    }
  }
});

// Swipe detection for mobile devices
let touchStartX = 0;
window.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
});

window.addEventListener('touchend', (event) => {
  const touchEndX = event.changedTouches[0].clientX;
  if (modal.style.display === 'flex') {
    if (touchEndX < touchStartX) {
      showNextImage();
    } else if (touchEndX > touchStartX) {
      showPreviousImage();
    }
  }
});

// Arrow key navigation
window.addEventListener('keydown', (event) => {
  if (modal.style.display === 'flex') {
    if (event.key === 'ArrowRight') {
      showNextImage();
    } else if (event.key === 'ArrowLeft') {
      showPreviousImage();
    }
  }
});

// Function to update the position of each image
function updateImagePositions() {
  imageProperties.forEach((image, index) => {
    if (image.paused) return; // Skip updating this image if it's paused

    // Calculate the direction away from the mouse
    const deltaX = image.x - mouseX;
    const deltaY = image.y - mouseY;

    // Move the image in the opposite direction of the mouse
    image.velocityX = deltaX * 0.01 + (Math.random() - 0.5) * image.variationStrength;
    image.velocityY = deltaY * 0.01 + (Math.random() - 0.5) * image.variationStrength;

    // Update the image position based on velocity
    image.x += image.velocityX;
    image.y += image.velocityY;

    for (let i = 0; i < imageProperties.length; i++) {
      if (i !== index) {
        const otherImage = imageProperties[i];
        const distance = Math.sqrt((image.x - otherImage.x) ** 2 + (image.y - otherImage.y) ** 2);
        const difference = distance - desiredDistance;

        if (difference < 0) {
          const angle = Math.atan2(image.y - otherImage.y, image.x - otherImage.x);
          const pushX = Math.cos(angle) * Math.abs(difference);
          const pushY = Math.sin(angle) * Math.abs(difference);

          image.x += pushX * 0.5;
          image.y += pushY * 0.5;
          otherImage.x -= pushX * 0.5;
          otherImage.y -= pushY * 0.5;
        }
      }
    }

    // Restrict movement within the screen boundaries
    const imageCenterX = image.x + image.width / 2;
    const imageCenterY = image.y + image.height / 2;

    if (imageCenterX < limitXMin) image.x = limitXMin - image.width / 2;
    if (imageCenterX > limitXMax) image.x = limitXMax - image.width / 2;
    if (imageCenterY < limitYMin) image.y = limitYMin - image.height / 2;
    if (imageCenterY > limitYMax) image.y = limitYMax - image.height / 2;

    image.element.style.left = `${image.x}px`;
    image.element.style.top = `${image.y}px`;

    // Limit speed for smoother movement
    const speedLimit = 1;
    if (image.velocityX > speedLimit) image.velocityX = speedLimit;
    if (image.velocityY > speedLimit) image.velocityY = speedLimit;
  });

  // Request the next frame for smooth animation
  requestAnimationFrame(updateImagePositions);
}

// Hide the images initially, and show them after centering
window.addEventListener('load', () => {
  imageProperties.forEach(image => {
    image.width = image.element.offsetWidth;
    image.height = image.element.offsetHeight;
    image.x = (screenWidth - image.width) / 2;
    image.y = (screenHeight - image.height) / 2;

    // Set the initial position of the image
    image.element.style.left = `${image.x}px`;
    image.element.style.top = `${image.y}px`;

    // Add 'loaded' class to images to make them visible
    image.element.classList.add('loaded');
  });

  updateImagePositions();
});

function filterAbout() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'none';
  });

  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'block';
  }
}

function filterLogos() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'none';
  });
  const logos = document.querySelectorAll('#logo');
  logos.forEach(logo => {
    logo.style.display = 'block';
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
}

function filterIllustrations() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'none';
  });
  const illustrations = document.querySelectorAll('#illustration');
  illustrations.forEach(illustration => {
    illustration.style.display = 'block';
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
}

function filterEditorials() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'none';
  });
  const editorials = document.querySelectorAll('#editorial');
  editorials.forEach(editorial => {
    editorial.style.display = 'block';
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
}

function filterWebs() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'none';
  });
  const webs = document.querySelectorAll('#web');
  webs.forEach(web => {
    web.style.display = 'block';
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
}

function toggleActive(button) {

  const buttons = document.querySelectorAll('.shuffle-btn');
  buttons.forEach(btn => btn.classList.remove('active'));


  button.classList.add('active');

  const mixDiv = document.querySelector('.mix');
  if (button.id === 'about') {
    mixDiv.style.display = 'none';
  } else {
    mixDiv.style.display = 'flex';
  }
}

preloadImages();
let isGridActive = false;

const gridBtn = document.getElementById('grid-btn');
const mixBtn = document.querySelector('.mix-btn');
const container = document.querySelector('.grid');

// Atualiza o estado do botão "mix"
function updateMixButtonState(disabled) {
  if (mixBtn) {
    mixBtn.style.filter = disabled ? 'blur(1px)' : 'none';
    mixBtn.style.opacity = disabled ? '0.5' : '1';
    mixBtn.style.pointerEvents = disabled ? 'none' : 'auto';
    mixBtn.style.cursor = disabled ? 'not-allowed' : 'pointer';
  }
}

function enableGridLayout() {
  isGridActive = true;
  gridBtn.textContent = 'shuffle it';
  container.style.display = 'grid';
  container.style.gap = '3px';

  updateMixButtonState(true);

  imageProperties.forEach(image => {
    Object.assign(image.element.style, {
      position: 'static',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      opacity: '0',
      transform: 'scale(0.8)',
    });

    setTimeout(() => {
      image.element.style.opacity = '1';
      image.element.style.transform = 'scale(1)';
    }, 100);
  });
}

function enableShuffle() {
  isGridActive = false;
  gridBtn.textContent = gridBtn.dataset.initialText;
  container.style.display = 'block';

  updateMixButtonState(false); // Ativa o botão "mix"

  imageProperties.forEach(image => {
    Object.assign(image.element.style, {
      position: 'absolute',
      transition: 'left 0.5s ease, top 0.5s ease',
    });

    image.x = Math.random() * (window.innerWidth - image.width);
    image.y = Math.random() * (window.innerHeight - image.height);
    image.element.style.left = `${image.x}px`;
    image.element.style.top = `${image.y}px`;
  });
}

// Alternar entre os modos
gridBtn.dataset.initialText = gridBtn.textContent;
gridBtn.addEventListener('click', () => (isGridActive ? enableShuffle() : enableGridLayout()));

// Shuffle manual sem afetar o modo grelha
function shuffleImages() {
  if (isGridActive) return;

  imageProperties.forEach(image => {
    image.x = Math.random() * (window.innerWidth - image.width);
    image.y = Math.random() * (window.innerHeight - image.height);
    image.element.style.left = `${image.x}px`;
    image.element.style.top = `${image.y}px`;
  });
}


function allImagesAreVisible() {
  imageProperties.forEach(image => {
    if (!container.contains(image.element)) {
      container.appendChild(image.element);
    }
    image.element.style.opacity = '1';
    image.element.style.display = 'block'; // Ensure visibility
  });
}
