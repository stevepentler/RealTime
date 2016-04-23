"use strict";
function SurveyTracker(id, adminId, question, options, timeSelector) {
  this.id = id;
  this.adminId = adminId;
  this.question = question;
  this.options = options;
  this.votes = {};
  this.timeSelector = timeSelector;
  console.log("survey tracker", this.id, this.adminId, this.question, this.options);
}

module.exports = SurveyTracker;