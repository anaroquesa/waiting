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
