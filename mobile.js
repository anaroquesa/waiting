// Verificar se o contador já existe no localStorage
let entryCount = localStorage.getItem('entryCount');
if (!entryCount) {
entryCount = 0;  // Caso não exista, inicializa o contador
}

// Incrementar o contador
entryCount++;

// Salvar o novo contador no localStorage
localStorage.setItem('entryCount', entryCount);

// Função para obter a geolocalização
function getGeolocation() {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(saveLocation, showError);
} else {
  console.log("Geolocalização não é suportada por este navegador.");
}
}

// Função de callback para salvar a localização
function saveLocation(position) {
const latitude = position.coords.latitude;
const longitude = position.coords.longitude;

// Criar um objeto com as informações de entrada e localização
const entryData = {
  entryCount: entryCount,
  latitude: latitude,
  longitude: longitude,
  timestamp: new Date().toISOString() // Horário de entrada
};

// Recuperar entradas anteriores ou criar uma nova lista
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// Adicionar nova entrada à lista
entries.push(entryData);

// Salvar a lista atualizada de entradas no localStorage
localStorage.setItem('entries', JSON.stringify(entries));

console.log(`Entrada ${entryCount} registrada com sucesso!`);
console.log(`Localização: Lat: ${latitude}, Long: ${longitude}`);
}

// Função de erro caso não seja possível obter a localização
function showError(error) {
switch(error.code) {
  case error.PERMISSION_DENIED:
    console.log("Usuário rejeitou a solicitação de geolocalização.");
    break;
  case error.POSITION_UNAVAILABLE:
    console.log("Informações de localização não disponíveis.");
    break;
  case error.TIMEOUT:
    console.log("A solicitação de geolocalização expirou.");
    break;
  case error.UNKNOWN_ERROR:
    console.log("Erro desconhecido.");
    break;
}
}

// Chamar a função para obter a geolocalização
getGeolocation();

// Exibir o número de entradas no console (ou onde desejar)
console.log(`Número total de entradas: ${entryCount}`);



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
    img.src = image.src;
  });
}

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


images.forEach((image, index) => {
  image.addEventListener('click', () => {
    currentIndex = index;
    modal.style.display = 'flex';
    modalImage.src = image.src;
  });
});


closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal || event.target === modalImage) {
    modal.style.display = 'none';
  }
});

document.getElementById('prev-arrow').addEventListener('click', () => {
  showPreviousImage();
});

document.getElementById('next-arrow').addEventListener('click', () => {
  showNextImage();
});

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  modalImage.src = images[currentIndex].src;
}

function showPreviousImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  modalImage.src = images[currentIndex].src;
}


window.addEventListener('wheel', (event) => {
  if (modal.style.display === 'flex') {
    if (event.deltaY > 0) {
      showNextImage();
    } else {
      showPreviousImage();
    }
  }
});

let touchStartX = 0;
let touchEndX = 0;

grid.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
});

grid.addEventListener('touchmove', (event) => {

  if (touchStartX === 0) return;

  touchEndX = event.touches[0].clientX;
  const diffX = touchStartX - touchEndX;

  // Atualiza o número de colunas com base no movimento horizontal contínuo
  if (Math.abs(diffX) > 20) {
    if (diffX > 0 && currentColumns < maxColumns) {
      currentColumns++;  // Aumenta as colunas se o dedo se moveu para a esquerda
    } else if (diffX < 0 && currentColumns > minColumns) {
      currentColumns--;  // Diminui as colunas se o dedo se moveu para a direita
    }

    updateGridColumns(currentColumns);

    touchStartX = touchEndX;
  }
});

grid.addEventListener('touchend', () => {
  touchStartX = 0;
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
  const logos = document.querySelectorAll('.logo');
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
  const illustrations = document.querySelectorAll('.illustration');
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
  const editorials = document.querySelectorAll('.editorial');
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
  const webs = document.querySelectorAll('.web');
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

function lightMode() {
  var element = document.body;
  element.classList.toggle("light-mode");
}

function toggleDiv(divid) {
  varon = divid + 'on';
  varoff = divid + 'off';

  if (document.getElementById(varon).style.display == 'block') {
    document.getElementById(varon).style.display = 'none';
    document.getElementById(varoff).style.display = 'block';
  } else {
    document.getElementById(varoff).style.display = 'none';
    document.getElementById(varon).style.display = 'block'
  }
}

let currentColumns = 3; // Default number of columns
const minColumns = 1;   // Minimum number of columns
const maxColumns = 10;  // Maximum number of columns

// Function to update the grid columns dynamically
function updateGridColumns(columns) {
  const grid = document.querySelector('.grid');
  if (grid) {
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
}

// Initialize the grid with the default number of columns
updateGridColumns(currentColumns);

// Event listener for horizontal scrolling (desktop)
const grid = document.querySelector('.grid');
