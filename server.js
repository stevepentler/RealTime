 "use strict";

const http = require('http');
const express = require('express');
const generateSurvey = require('./lib/generate-survey');
const bodyParser = require('body-parser');
const sendText = require('./lib/twilio');
const startTimer = require('./lib/timer');
const $ = require('jquery');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                 .listen(port, function () {
                    console.log('Listening on port ' + port + '.');
                  });
const socketIo = require('socket.io');
const io = socketIo(server);

app.locals.surveys = {};
app.locals.votes = {};

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
  res.render('index');
});

app.post('/admin', function (req, res) {
  let newSurvey = generateSurvey(req);
  app.locals.surveys[newSurvey.id] = newSurvey;
  res.render('admin-links', {survey: newSurvey});
  startTimer(timeSelector, id, io);
});

app.get('/survey/results/:surveyId', function (req, res){
  res.render('survey-results', {survey: getSurveyId(req)});
});

app.get('/survey/hideresults/:surveyId', function (req, res){
  res.render('survey-hide-results', {survey: getSurveyId(req)});
});

app.get('/:adminId/:surveyId', function (req, res){
  res.render('admin-results', {survey: getSurveyId(req)});
});


io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('userConnection', io.engine.clientsCount);

  socket.on('message', function (channel, message) {
    let surveyId = message.surveyId;
    let survey = app.locals.surveys[surveyId];
    let userVote = message.vote;
    let tally = survey.options;

    if (channel === `voteCast-${surveyId}`) {
      tally[userVote]++
      io.sockets.emit(`voteCount-${surveyId}`, tally);
      app.locals.votes[socket.id] = message.vote
    }

    else if (channel === `closeSurvey-${surveyId}`) {
      let results = JSON.stringify(tally);
      sendText(results);
      io.sockets.emit(`closeSurvey-${surveyId}`);
    }

    else if (channel === `activeUser-${surveyId}`) {
      io.sockets.emit(`activeUser`)
    }
  })

  socket.on('disconnect', function () {
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

});

function getSurveyId (req) {
  return app.locals.surveys[req.params.surveyId];
};

module.exports = server;