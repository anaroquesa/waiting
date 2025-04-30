const images = document.querySelectorAll('.image');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const closeBtn = document.getElementById('close-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const gridBtn = document.getElementById('grid-btn');
const mixBtn = document.querySelector('.mix-btn');
const container = document.querySelector('.grid');

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;
let currentIndex = -1;
let mouseX = 0, mouseY = 0;
let isGridActive = false;
let mouseInsideBounds = false;
const desiredDistance = 80;
const margin = 0.25;

function updateScreenSize() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
}
window.addEventListener('resize', updateScreenSize);

const imageProperties = Array.from(images).map(image => {
  const width = image.width || 150;
  const height = image.height || 150;
  return {
    element: image,
    width,
    height,
    x: (screenWidth - width) / 2,
    y: (screenHeight - height) / 2,
    velocityX: 0,
    velocityY: 0,
    variationStrength: 0.5,
    paused: false,
  };
});

document.addEventListener('mousemove', (e) => {
  const minX = screenWidth * margin;
  const maxX = screenWidth * (1 - margin);
  const minY = screenHeight * margin;
  const maxY = screenHeight * (1 - margin);
  mouseInsideBounds = e.clientX >= minX && e.clientX <= maxX && e.clientY >= minY && e.clientY <= maxY;
  if (mouseInsideBounds) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
});

imageProperties.forEach((img, i) => {
  img.element.addEventListener('mouseover', () => img.paused = true);
  img.element.addEventListener('mouseout', () => img.paused = false);
  img.element.addEventListener('click', () => {
    modal.style.display = 'flex';
    modalImage.src = img.element.src;
    currentIndex = i;
  });
});

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal || e.target === modalImage) modal.style.display = 'none';
});

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

// Navegação por scroll, swipe, teclado
window.addEventListener('wheel', e => modal.style.display === 'flex' && (e.deltaY > 0 ? showNextImage() : showPreviousImage()));
let touchStartX = 0;
window.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
window.addEventListener('touchend', e => {
  if (modal.style.display === 'flex') {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 30) dx < 0 ? showNextImage() : showPreviousImage();
  }
});
window.addEventListener('keydown', e => {
  if (modal.style.display === 'flex') {
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPreviousImage();
  }
});

function updateImagePositions() {
  const minX = screenWidth * margin;
  const maxX = screenWidth * (1 - margin);
  const minY = screenHeight * margin;
  const maxY = screenHeight * (1 - margin);

  imageProperties.forEach((img, i) => {
    if (img.paused) return;

    const dx = img.x - mouseX;
    const dy = img.y - mouseY;

    img.velocityX = dx * 0.01 + (Math.random() - 0.5) * img.variationStrength;
    img.velocityY = dy * 0.01 + (Math.random() - 0.5) * img.variationStrength;

    img.x += img.velocityX;
    img.y += img.velocityY;

    for (let j = 0; j < imageProperties.length; j++) {
      if (j === i) continue;
      const other = imageProperties[j];
      const dist = Math.hypot(img.x - other.x, img.y - other.y);
      const diff = dist - desiredDistance;

      if (diff < 0) {
        const angle = Math.atan2(img.y - other.y, img.x - other.x);
        const pushX = Math.cos(angle) * Math.abs(diff) * 0.5;
        const pushY = Math.sin(angle) * Math.abs(diff) * 0.5;
        img.x += pushX;
        img.y += pushY;
        other.x -= pushX;
        other.y -= pushY;
      }
    }

    const centerX = img.x + img.width / 2;
    const centerY = img.y + img.height / 2;

    if (centerX < minX) img.x = minX - img.width / 2;
    if (centerX > maxX) img.x = maxX - img.width / 2;
    if (centerY < minY) img.y = minY - img.height / 2;
    if (centerY > maxY) img.y = maxY - img.height / 2;

    img.element.style.left = `${img.x}px`;
    img.element.style.top = `${img.y}px`;
  });

  requestAnimationFrame(updateImagePositions);
}

window.addEventListener('load', () => {
  imageProperties.forEach(img => {
    img.width = img.element.offsetWidth;
    img.height = img.element.offsetHeight;
    img.x = (screenWidth - img.width) / 2;
    img.y = (screenHeight - img.height) / 2;
    img.element.style.left = `${img.x}px`;
    img.element.style.top = `${img.y}px`;
    img.element.classList.add('loaded');
  });
  updateImagePositions();
});

// Shuffle simples (fora do modo grelha)
function shuffleImages() {
  if (isGridActive) return;
  imageProperties.forEach(img => {
    img.x = Math.random() * (screenWidth - img.width);
    img.y = Math.random() * (screenHeight - img.height);
    img.element.style.left = `${img.x}px`;
    img.element.style.top = `${img.y}px`;
  });
}
shuffleBtn.addEventListener('click', shuffleImages);

// Grelha
function enableGridLayout() {
  isGridActive = true;
  gridBtn.textContent = 'shuffle it';
  container.style.display = 'grid';
  mixBtn.style.opacity = '0.4';
  mixBtn.style.pointerEvents = 'none';

  imageProperties.forEach(img => {
    Object.assign(img.element.style, {
      position: 'static',
      opacity: '0',
      transform: 'scale(0.8)',
      transition: 'opacity 0.5s, transform 0.5s'
    });
    setTimeout(() => {
      img.element.style.opacity = '1';
      img.element.style.transform = 'scale(1)';
    }, 100);
  });
}

function enableShuffle() {
  isGridActive = false;
  gridBtn.textContent = gridBtn.dataset.initialText;
  container.style.display = 'block';
  mixBtn.style.opacity = '1';
  mixBtn.style.pointerEvents = 'auto';

  imageProperties.forEach(img => {
    Object.assign(img.element.style, {
      position: 'absolute',
      transition: 'left 0.5s, top 0.5s',
    });
    shuffleImages();
  });
}

gridBtn.dataset.initialText = gridBtn.textContent;
gridBtn.addEventListener('click', () => isGridActive ? enableShuffle() : enableGridLayout());

// Filtros
function filterImagesByClass(className) {
  const about = document.querySelector('.about');
  document.querySelector('.grid').style.display = 'grid';

  imageProperties.forEach(img => {
    if (className === 'all' || img.element.classList.contains(className)) {
      img.element.style.display = 'block';
    } else {
      img.element.style.display = 'none';
    }
  });

  if (about) about.style.display = 'none';
}

function resetFilters() {
  imageProperties.forEach(img => img.element.style.display = 'block');
  const about = document.querySelector('.about');
  if (about) about.style.display = 'none';
  document.querySelector('.grid').style.display = 'grid';
}

function filterAbout() {
  imageProperties.forEach(img => img.element.style.display = 'none');
  const about = document.querySelector('.about');
  if (about) about.style.display = 'block';
  document.querySelector('.grid').style.display = 'none';
}

function toggleActive(button) {
  document.querySelectorAll('.shuffle-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  document.querySelector('.mix').style.display = button.id === 'about' ? 'none' : 'flex';
}

function preloadImages() {
  images.forEach(img => {
    const preload = new Image();
    preload.src = img.src;
  });
}
preloadImages();

// Liga os botões de filtro

document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');
    if (filter === 'all') resetFilters();
    else filterImagesByClass(filter);
    toggleActive(button);
  });
});

document.getElementById('about').addEventListener('click', function () {
  filterAbout();
  toggleActive(this);
});
