"use strict";

function startTimer(expirationDate, id, io) {
  let expirationYear = parseInt(splitDate(expirationDate)[0]);
  let expirationMonth = parseInt(splitDate(expirationDate)[1]);
  let expirationDay = parseInt(splitDate(expirationDate)[2]);
  let epochExpiration = Date.UTC(expirationYear, expirationMonth, expirationDay);
  let surveyId = id;
  let interval = setInterval( function() {
    console.log("timeselector", epochExpiration)
    if (epochExpiration >= (new Date).getTime()) {
      io.sockets.emit(`closeSurvey-${surveyId}`);
      clearInterval(interval);
    }
  }, 1000);
};

function splitDate(expirationDate) {
  return expirationDate.split("-");
}

module.exports = startTimer;