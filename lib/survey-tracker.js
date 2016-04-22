"use strict";
function SurveyTracker(id, adminId, question, options) {
  this.id = id;
  this.adminId = adminId;
  this.question = question;
  this.options = options;
  this.votes = {};
  console.log("survey tracker", this.id, this.adminId, this.question, this.options);
}

module.exports = SurveyTracker;