 "use strict";

const http = require('http');
const express = require('express');
const generateId = require('./lib/generate-id');
const bodyParser = require('body-parser');
const SurveyTracker = require('./lib/survey-tracker');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                 .listen(port, function () {
                    console.log('Listening on port ' + port + '.');
                  });

app.locals.surveys = {};
app.locals.votes = {};

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
  res.render('index');
});

app.post('/admin', (request, response) => {
  let adminId = generateId(3);
  let id = generateId(10);

  let surveyData = request.body.survey;
  let question = surveyData.question;
  let options = {};
  let active = true;

  surveyData.options.forEach(function(singleOption) {
    options[singleOption] = 0;
  })

  let newSurvey = new SurveyTracker(id, adminId, question, options, active);
  app.locals.surveys[newSurvey.id] = newSurvey;

  response.render('admin-links', {survey: newSurvey});
});

app.get('/survey/results/:surveyId', function (req, res){
  var survey = app.locals.surveys[req.params.surveyId];
  res.render('survey-results', {survey: survey});
});

app.get('/survey/hideresults/:surveyId', function (req, res){
  var survey = app.locals.surveys[req.params.surveyId];
  res.render('survey-results', {survey: survey});
});

app.get('/:adminId/:surveyId', function (req, res){
  console.log("params", req.params.surveyId)
  var existingSurvey = app.locals.surveys[req.params.surveyId];
  res.render('admin-results', {survey: existingSurvey});
});



const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', function (channel, message) {
    console.log(message);
    if (channel === "voteCast") {
      app.locals.votes[socket.id] = message.vote
      console.log("apps.locals.votes", app.locals.votes)
    }
  })

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

});

function countVoters() {
  let sockets = Object.keys(app.locals.votes);
  let voterCount = sockets.length
  console.log("voter count", voterCount)
  return voterCount;
};

function countVotes() {
  let result = _.mapValues(app.locals.votes, function(key, value) { return key })
  console.log("result", result)
  return result;
}

module.exports = server;