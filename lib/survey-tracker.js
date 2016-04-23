"use strict";
function SurveyTracker(id, adminId, question, options, timeSelector) {
  this.id = id;
  this.adminId = adminId;
  this.question = question;
  this.options = options;
  this.votes = {};
  this.timeSelector = timeSelector;
}

module.exports = SurveyTracker;