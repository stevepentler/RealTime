 "use strict";

const http = require('http');
const express = require('express');
const generateId = require('./lib/generate-id');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                 .listen(port, function () {
                    console.log('Listening on port ' + port + '.');
                  });

app.locals.votes = {}

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
  res.render('index');
});

app.post('/survey', (request, response) => {
  let adminId = generateId(3);
  let id = generateId(10);

  let surveyData = request.body.survey;
  let question = surveyData.question
  let
  console.log(surveyData);

  response.render('admin');
});

app.get('/survey', function (req, res){
  res.render('survey');
});

app.get('/admin/survey', function (req, res){
  res.render('admin');
});



const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', function (channel, message) {
    if (channel === "voteCast") {
      app.locals.votes[socket.id] = message.vote
      console.log(app.locals.votes);
    }
  })

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });

});
module.exports = server;