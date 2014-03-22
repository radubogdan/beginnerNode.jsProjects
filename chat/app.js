
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var socket = require('socket.io');
var redis = require('redis');
var rClient = redis.createClient();

var app = express();
var server = http.createServer(app);
var stylus = require('stylus');
var nib = require('nib');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
    .set('compress', true)
    .import('nib');
}

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
app.use(stylus.middleware({
  src: __dirname + '/resources',
  dest: __dirname + '/public',
  debug: true,
  force: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = socket.listen(server, { log: false });

// Use redis for persistance
var storeMessage = function (name, data) {
  // Turn object into string
  var message = JSON.stringify({ name: name, data: data });

  rClient.lpush('messages', message, function(err, res) {
    // When we get a response take latest 5 messages
    rClient.ltrim("messages", 0, 5);
  });
};

io.sockets.on('connection', function(client) {
  // Set the nickename of the client, emit last messages
  client.on('join', function(nickname) {
    rClient.lrange('messages', 0, -1, function(err, res) {
      res = res.reverse();

      // Loop through each message, parse and emit msg
      res.forEach(function(message) {
        message = JSON.parse(message);
        client.emit('messages', message.name + message.data);
      });
    });

    // When someone join the chat, notify others about this!
    client.broadcast.emit('add nickname', nickname);

    // Put the new client in the set
    rClient.sadd('users', nickname);

    rClient.smembers('users', function(err, users) {
      users.forEach(function(nickname) {
        client.emit('add nickname', nickname);
      });
    });

    // Set the nickname of a client
    client.set('nickname', nickname);
  });

  // Listen on disconnects
  client.on('disconnect', function(nickname) {
    client.get('nickname', function(err, nickname) {
      client.broadcast.emit('remove nickname', nickname);
      rClient.srem('users', nickname);
    });
  });

  // Setup a listener on messages event
  client.on('messages', function(data) {
    // Broadcast the message to all clients
    client.get('nickname', function(err, nickname) {
      client.broadcast.emit('messages', nickname + ": " + data);

      // Store the message into redis list
      storeMessage(nickname + ": ", data);
    });
  });

});
