"use strict";

function startTimer(timeSelector, id, io) {
  let timeRemaining = timeSelector;
  let surveyId = id;
  let interval = setInterval( function() {
    console.log("timeselector", timeRemaining)
    timeRemaining--
    if (timeRemaining === 0) {
      io.sockets.emit(`closeSurvey-${surveyId}`);
      clearInterval(interval);
    } else if (timeRemaining < 0) {
      clearInterval(interval);
    }
  }, 1000);
};

module.exports = startTimer;