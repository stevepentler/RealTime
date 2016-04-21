 "use strict";

const socket = io();

let connectionCount = ('#connection-count');
let options = $('.options button')
let surveyId = window.location.pathname.split("/").slice(-1).toString();
let userVoted = $('#userVoted');

socket.on('usersConnected', function (count) {
});

socket.on(`voteCount-${surveyId}`, function(tally) {
    console.log("tally", tally);
  let i = 1;
  for (var option in tally) {
    i++;
  }
})

for (let i = 0; i < options.length; i++) {
  options[i].addEventListener('click', function() {
    userVoted.innerHTML = `You voted for: ${this.innerText}!`;
    options.remove();
    socket.send(`voteCast-${surveyId}`, {vote: this.innerText,
                                         surveyId: surveyId});
  });
}

// $('#close-survey').on('click', function() {
//   endUserOptions();
// })


// function endUserOptions() {
//   console.log("hit user options");
//   console.log($options.html("sdfjsdlkfjslkdjflas;kdjflas;kdfjsalk;dfj"));
//   $('.options').html("<div class='expired'>This survey has ended!</div>")
// }