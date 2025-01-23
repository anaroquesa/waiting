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


// Filter functions
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

function filterAll() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'block';
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
}


function filterLogos() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'none';
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
  const logos = document.querySelectorAll('#logo');
  logos.forEach(logo => {
    logo.style.display = 'block';
  });
}

function filterIllustrations() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'none';
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
  const illustrations = document.querySelectorAll('#illustration');
  illustrations.forEach(illustration => {
    illustration.style.display = 'block';
  });
}

function filterEditorials() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'none';
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
  const editorials = document.querySelectorAll('#editorial');
  editorials.forEach(editorial => {
    editorial.style.display = 'block';
  });
}

function filterWebs() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
    image.style.display = 'none';
  });
  const about = document.querySelector('.about');
  if (about) {
    about.style.display = 'none';
  }
  const webs = document.querySelectorAll('#web');
  webs.forEach(web => {
    web.style.display = 'block';
  });
}

// Toggle active button
function toggleActive(button) {
  // Remove active class from all buttons
  const buttons = document.querySelectorAll('.shuffle-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Add active class to the clicked button
  button.classList.add('active');
}

// Preload images when the page starts
preloadImages();


var seconds = 0;
var el = document.getElementById('timeDisplay');

function incrementSeconds() {
    seconds += 1;
    el.innerText = seconds + " seconds";
}

var cancel = setInterval(incrementSeconds, 1000);

$(document).ready(function() {
  $(document).on('mousemove', function(e) {
    $('#cursor').css({
      left: e.pageX - 15,
      top: e.pageY - 10
    });
  })
});

function lightMode() {
  var element = document.body;
  element.classList.toggle("light-mode");
}

function toggleDiv(divid)
  {

    varon = divid + 'on';
    varoff = divid + 'off';

    if(document.getElementById(varon).style.display == 'block')
    {
    document.getElementById(varon).style.display = 'none';
    document.getElementById(varoff).style.display = 'block';
    }

    else
    {
    document.getElementById(varoff).style.display = 'none';
    document.getElementById(varon).style.display = 'block'
    }
}


let currentColumns = 3; // Default number of columns
const minColumns = 1;
const maxColumns = 10; // Maximum number of columns

// Function to update the grid columns dynamically
function updateGridColumns(columns) {
  const grid = document.querySelector('.grid');
  if (grid) {
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
}

// Initialize the grid with the default number of columns
updateGridColumns(currentColumns);

// Event listener for horizontal scrolling
document.querySelector('.grid').addEventListener('wheel', (event) => {
  // Check if horizontal scrolling (deltaX) is greater than vertical scrolling (deltaY)
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    if (event.deltaX > 0 && currentColumns < maxColumns) {
      // Scrolling right: increase columns
      currentColumns++;
      updateGridColumns(currentColumns);
    } else if (event.deltaX < 0 && currentColumns > minColumns) {
      // Scrolling left: decrease columns
      currentColumns--;
      updateGridColumns(currentColumns);
    }
    event.preventDefault(); // Prevent default scroll behavior
  }
});

function lightMode() {
  var element = document.body;
  element.classList.toggle("light-mode");
}
