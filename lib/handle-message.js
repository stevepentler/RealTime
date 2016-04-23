"use strict";

const sendText = require('./twilio');

function handleMessage(channel, message, io, app) {
  let surveyId = message.surveyId;
  let survey = app.locals.surveys[surveyId];
  let userVote = message.vote;
  let tally = survey.options;

  if (channel === `voteCast-${surveyId}`) {
    tally[userVote]++
    io.sockets.emit(`voteCount-${surveyId}`, tally);
  }

  else if (channel === `closeSurvey-${surveyId}`) {
    let results = JSON.stringify(tally);
    sendText(results);
    io.sockets.emit(`closeSurvey-${surveyId}`);
  }

  else if (channel === `activeUser-${surveyId}`) {
    io.sockets.emit(`activeUser`)
  }
};

module.exports = handleMessage;