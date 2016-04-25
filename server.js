 "use strict";

const http = require('http');
const express = require('express');
const generateSurvey = require('./lib/generate-survey');
const bodyParser = require('body-parser');
const handleMessage = require('./lib/handle-message');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app).listen(port);
const socketIo = require('socket.io');
const io = socketIo(server);

app.locals.surveys = {};

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
  res.render('pages/index');
});

app.post('/admin', function (req, res) {
  let newSurvey = generateSurvey(req, io);
  app.locals.surveys[newSurvey.id] = newSurvey;
  res.render('pages/admin-links', {survey: newSurvey});
});

app.get('/survey/results/:surveyId', function (req, res){
  res.render('pages/survey-results', {survey: getSurveyId(req)});
});

app.get('/survey/hideresults/:surveyId', function (req, res){
  res.render('pages/survey-hide-results', {survey: getSurveyId(req)});
});

app.get('/:adminId/:surveyId', function (req, res){
  res.render('pages/admin-results', {survey: getSurveyId(req)});
});


io.on('connection', function (socket) {
  io.sockets.emit('userConnection', io.engine.clientsCount - 1);

  socket.on('message', function (channel, message) {
    handleMessage(channel, message, io, app);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

function getSurveyId (req) {
  return app.locals.surveys[req.params.surveyId];
};

module.exports = app;