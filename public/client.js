 "use strict";

const socket = io();

var connectionCount = document.getElementById('connection-count');
var options = document.querySelectorAll('#options button')


socket.on('usersConnected', function (count) {
});

for (let i = 0; i < options.length; i++) {
  options[i].addEventListener('click', function() {
    socket.send('voteCast', {vote: this.innerText});
  });
}

$('#close-survey').on('click', function() {
console.log(req.params.surveyId)
  socket.send(`endsurvey-${surveyId}`, { surveyId: surveyId });
})