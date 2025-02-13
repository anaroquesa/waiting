$(document).ready(function() {
  $(document).on('mousemove', function(e) {
    $('#cursor').css({
      left: e.pageX - 10,
      top: e.pageY - 10
    });
  })
});

var NUM_PARTICLES = ( ( ROWS = 100 ) * ( COLS = 300 ) ),
    THICKNESS = Math.pow( 200, 2 ),
    SPACING = 4,
    MARGIN = 100,
    COLOR = 80,
    DRAG = 0.95,
    EASE = 0.25,

    container,
    particle,
    canvas,
    mouse,
    stats,
    list,
    ctx,
    tog,
    man,
    dx, dy,
    mx, my,
    d, t, f,
    a, b,
    i, n,
    w, h,
    p, s,
    r, c
    ;

particle = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0
};

function init() {

  container = document.getElementById( 'container' );
  canvas = document.createElement( 'canvas' );

  ctx = canvas.getContext( '2d' );
  man = false;
  tog = true;

  list = [];

  w = canvas.width = COLS * SPACING + MARGIN * 2;
  h = canvas.height = ROWS * SPACING + MARGIN * 2;

  container.style.marginLeft = Math.round( w * -0.5 ) + 'px';
  container.style.marginTop = Math.round( h * -0.5 ) + 'px';

  for ( i = 0; i < NUM_PARTICLES; i++ ) {

    p = Object.create( particle );
    p.x = p.ox = MARGIN + SPACING * ( i % COLS );
    p.y = p.oy = MARGIN + SPACING * Math.floor( i / COLS );

    list[i] = p;
  }

  container.addEventListener('mousemove', function(e) {
    bounds = container.getBoundingClientRect();
    mx = Math.min(Math.max(e.clientX - bounds.left, MARGIN), w - MARGIN);
    my = Math.min(Math.max(e.clientY - bounds.top, MARGIN), h - MARGIN);
    man = true;
});

  if ( typeof Stats === 'function' ) {
    document.body.appendChild( ( stats = new Stats() ).domElement );
  }

  container.appendChild( canvas );
}

function step() {

  if ( stats ) stats.begin();

  if ( tog = !tog ) {

    if ( !man ) {

      t = +new Date() * 0.001;
      mx = w * 0.5 + ( Math.cos( t * 2.1 ) * Math.cos( t * 0.9 ) * w * 0.45 );
      my = h * 0.5 + ( Math.sin( t * 3.2 ) * Math.tan( Math.sin( t * 0.8 ) ) * h * 0.45 );
    }

    for ( i = 0; i < NUM_PARTICLES; i++ ) {

      p = list[i];

      d = ( dx = mx - p.x ) * dx + ( dy = my - p.y ) * dy;
      f = -THICKNESS / d;

      if ( d < THICKNESS ) {
        t = Math.atan2( dy, dx );
        p.vx += f * Math.cos(t);
        p.vy += f * Math.sin(t);
      }

      p.x += (p.vx *= DRAG) + (p.ox - p.x) * EASE;
      p.y += (p.vy *= DRAG) + (p.oy - p.y) * EASE;

    }

  } else {

    b = ( a = ctx.createImageData( w, h ) ).data;

    for ( i = 0; i < NUM_PARTICLES; i++ ) {

      p = list[i];
      b[n = ( ~~p.x + ( ~~p.y * w ) ) * 4] = b[n+1] = b[n+2] = COLOR, b[n+3] = 255;
    }

    ctx.putImageData( a, 0, 0 );
  }

  if ( stats ) stats.end();

  requestAnimationFrame( step );
}

init();
step();

var timer;
var timerStart;
var timeSpentOnSite;

function getTimeSpentOnSite() {
    timeSpentOnSite = parseInt(localStorage.getItem('timeSpentOnSite'));
    timeSpentOnSite = isNaN(timeSpentOnSite) ? 0 : timeSpentOnSite;
    return timeSpentOnSite;
}

function startCounting() {
    timerStart = Date.now();
    timer = setInterval(function () {
        timeSpentOnSite = getTimeSpentOnSite() + (Date.now() - timerStart);
        localStorage.setItem('timeSpentOnSite', timeSpentOnSite);
        timerStart = Date.now();
        updateDisplay();
    }, 1000);
}

function resetTimeSpentOnSite() {
    localStorage.setItem('timeSpentOnSite', 0);
    timeSpentOnSite = 0;
    // Update time display
    updateDisplay();
}

function updateDisplay() {
    var timeDisplay = document.getElementById('timeDisplay');
    timeDisplay.textContent = parseInt(timeSpentOnSite / 1000) + ' seconds';
}

window.onload = function () {
    resetTimeSpentOnSite();
    startCounting();
};

var animationDuration = window.innerWidth < 768 ? 10 : 15;
container.addEventListener('touchmove', function(e) {
  e.preventDefault(); // Prevent default scrolling
  var touch = e.touches[0];
  mx = Math.min(Math.max(touch.pageX - bounds.left, MARGIN), w - MARGIN);
  my = Math.min(Math.max(touch.pageY - bounds.top, MARGIN), h - MARGIN);
  man = true;
});


function replace(currentDivId, nextDivId) {
  var currentDiv = document.getElementById(currentDivId);
  var nextDiv = document.getElementById(nextDivId);
  currentDiv.style.display = 'none';
  nextDiv.style.display = 'block';
}

function gridMode () {

}
