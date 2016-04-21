 "use strict";

const socket = io();

let connectionCount = document.getElementById('connection-count');
let options = document.querySelectorAll('#options button')
let suveyId = window.location.pathname.split("/").slice(-1).toString();

socket.on('usersConnected', function (count) {
});

for (let i = 0; i < options.length; i++) {
  options[i].addEventListener('click', function() {
    socket.send('voteCast', {vote: this.innerText});
  });
}

$('#close-survey').on('click', function() {
console.log(url)

  socket.send(`endsurvey-${surveyId}`, { surveyId: surveyId });
})