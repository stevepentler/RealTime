"use strict";

const generateId = require('./generate-id');
const SurveyTracker = require('./survey-tracker');
const startTimer = require('./timer');

function generateSurvey(req, io) {
  let adminId = generateId(3);
  let id = generateId(10);

  let surveyData = req.body.survey;
  let question = surveyData.question;
  let expirationDate = (surveyData.date);
  let options = {};

  surveyData.options.forEach(function(singleOption) {
    options[singleOption] = 0;
  })

  startTimer(expirationDate, id, io);

  let newSurvey = new SurveyTracker(id, adminId, question, options, expirationDate);
  return newSurvey
}

module.exports = generateSurvey;