"use strict";

const generateId = require('./generate-id');
const SurveyTracker = require('./survey-tracker');
const startTimer = require('./timer');

function generateSurvey(req, io) {
  let adminId = generateId(3);
  let id = generateId(10);

  let surveyData = req.body.survey;
  let question = surveyData.question;
  let timeSelector = (surveyData.time * 60);
  let options = {};

  surveyData.options.forEach(function(singleOption) {
    options[singleOption] = 0;
  })

  startTimer(timeSelector, id, io);

  let newSurvey = new SurveyTracker(id, adminId, question, options, timeSelector);
  return newSurvey
}

module.exports = generateSurvey;