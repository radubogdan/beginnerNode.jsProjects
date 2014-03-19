
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
var server = http.createServer(app);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socket.listen(server);

// Log out when somebody connects
io.sockets.on('connection', function(client) {
  console.log('Client connected');
  // Here I can use client.emit to send messages
  client.emit('messages', { hello: 'Welcome to my chat server' });
});

// Setup a listener on messages event
io.sockets.on('connection', function(client) {
  client.on('messages', function(data) {
    // Broadcast the message to all clients
    client.broadcast.emit("messages", data);
  });
});
