function SurveyTracker(id, adminId, question, options) {
  this.id = id;
  this.adminId = adminId;
  this.question = question;
  this.options = options;
  console.log(this.id, this.adminId, this.question, this.options);
}

module.exports = SurveyTracker;