"use strict";
function SurveyTracker(id, adminId, question, options, active) {
  this.id = id;
  this.adminId = adminId;
  this.question = question;
  this.options = options;
  this.active = active;
  this.votes = {};
  console.log("survey tracker", this.id, this.adminId, this.question, this.options);
}

module.exports = SurveyTracker;