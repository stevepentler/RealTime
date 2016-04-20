 "use strict";

const socket = io();

var connectionCount = document.getElementById('connection-count');
var options = document.querySelectorAll('#options button')

socket.on('usersConnected', function (count) {
  connectionCount.innerText = `${count} Friends are Active`;
});

for (let i = 0; i < options.length; i++) {
  options[i].addEventListener('click', function() {
    socket.send('voteCast', this.innerText);
  });
}