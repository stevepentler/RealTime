 "use strict";

const http = require('http');
const express = require('express');
const generateId = require('./lib/generate-id');
const bodyParser = require('body-parser');
const SurveyTracker = require('./lib/survey-tracker');
const $ = require('jquery');

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

  surveyData.options.forEach(function(singleOption) {
    options[singleOption] = 0;
  })

  let newSurvey = new SurveyTracker(id, adminId, question, options);
  app.locals.surveys[newSurvey.id] = newSurvey;

  response.render('admin-links', {survey: newSurvey});
});

app.get('/survey/results/:surveyId', function (req, res){
  var survey = app.locals.surveys[req.params.surveyId];
  res.render('survey-results', {survey: survey});
});

app.get('/survey/hideresults/:surveyId', function (req, res){
  var survey = app.locals.surveys[req.params.surveyId];
  res.render('survey-hide-results', {survey: survey});
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

  io.sockets.emit('userConnection', io.engine.clientsCount);

  socket.on('message', function (channel, message) {
    let surveyId = message.surveyId;
    let survey = app.locals.surveys[surveyId];
    let userVote = message.vote;
    let tally = survey.options;

    if (channel === `voteCast-${surveyId}`) {
      console.log("survey options before", tally)
      tally[userVote]++
      console.log("survey options after", tally)
      io.sockets.emit(`voteCount-${surveyId}`, tally);
      app.locals.votes[socket.id] = message.vote
      console.log("apps.locals.votes", app.locals.votes)
    }

    else if (channel === `closeSurvey-${surveyId}`) {
      io.sockets.emit(`closeSurvey-${surveyId}`);
    }

    else if (channel === `activeUser-${surveyId}`) {
      io.sockets.emit(`activeUser`)
    }
  })

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

});

module.exports = server;