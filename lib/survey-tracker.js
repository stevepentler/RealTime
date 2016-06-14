"use strict";
function SurveyTracker(id, adminId, question, options, expirationDate) {
  this.id = id;
  this.adminId = adminId;
  this.question = question;
  this.options = options;
  this.votes = {};
  this.expirationDate = expirationDate;
}

module.exports = SurveyTracker;