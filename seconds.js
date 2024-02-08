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
