 "use strict";

const http = require('http');
const express = require('express');
const generateId = require('./lib/generate-id');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                 .listen(port, function () {
                    console.log('Listening on port ' + port + '.');
                  });

app.locals.votes = {}

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/', function (request, response) {
  console.log("you hit this");
  // console.log(request.body.survey);
  response.redirect('/admin/survey');
})

app.get('/survey', function (req, res){
  res.sendFile(__dirname + '/views/survey.html');
});

app.get('/admin/survey', function (req, res){
  res.sendFile(__dirname + '/views/admin.html'); //esj downloads results, sweet!
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