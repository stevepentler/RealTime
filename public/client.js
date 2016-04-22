 "use strict";

const socket = io();

let connectionCount = $('#connection-count');
let options = $('.options button')
let surveyId = window.location.pathname.split("/").slice(-1).toString();
let userVoted = $('#userVoted');
let inactiveSurvey = $('#inactive-survey');


socket.on('userConnection', function (count) {
  connectionCount.text(`Friends Active: ${count}`);
});

socket.on(`voteCount-${surveyId}`, function(tally) {
    console.log("tally", tally);
  let i = 1;
  for (var option in tally) {
    $(`#${surveyId}-${i}`).text(`${tally[option]}`)
    i++;
  }
})

for (let i = 0; i < options.length; i++) {
  options[i].addEventListener('click', function() {
    options.remove();
    userVoted.text(`You voted for: ${this.innerText}!`);
    socket.send(`voteCast-${surveyId}`, {vote: this.innerText,
                                         surveyId: surveyId});
  });
}

$('#close-survey').on('click', function() {
  socket.send(`closeSurvey-${surveyId}`, {surveyId: surveyId});
})

socket.on(`closeSurvey-${surveyId}`, function() {
  options.remove();
  inactiveSurvey.text("This survey has been closed!")
})