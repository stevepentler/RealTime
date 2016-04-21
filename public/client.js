 "use strict";

const socket = io();

let connectionCount = document.getElementById('connection-count');
let options = document.querySelectorAll('#options button')
let surveyId = window.location.pathname.split("/").slice(-1).toString();
let $options = $('.options');
socket.on('usersConnected', function (count) {
});

for (let i = 0; i < options.length; i++) {
  options[i].addEventListener('click', function() {
    socket.send('voteCast', {vote: this.innerText});
  });
}

$('#close-survey').on('click', function() {
  endUserOptions();
})


function endUserOptions() {
  console.log("hit user options");
  console.log($options.html("sdfjsdlkfjslkdjflas;kdjflas;kdfjsalk;dfj"));
  $('.options').html("<div class='expired'>This survey has ended!</div>")
}