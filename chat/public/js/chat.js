var server = io.connect('http://localhost:3000');

// Hold nickname in global scope untill another solution
Global = {};

server.on('connect', function(data) {
  // When client connect ask for nickname and emit to the server
  var nickname = prompt('What is your nickname?');

  // Set nickname in global scope
  Global.nickname = nickname;

  // Emit nickname to server
  server.emit('join', nickname);
});

server.on('messages', function(data) {
  //alert(data.hello);
  // Wait for events ... insert the broadcasted message into the chat.
  broadcastMessage(data);
});

// This is called when send is pressed
function SendMessage() {
  var message = document.getElementById('chat-message').value;

  // Emit the message to the server
  server.emit('messages', message);

  // Insert message into message container - used to see your own message
  insertMessage(Global.nickname, message);
}

// This will insert message into chat - used by client
function insertMessage(nickname, msg) {
  var data = "<dt>" + nickname + ":" + "</dt>" + "<dd>" + msg + "</dd>";
  var field = document.getElementById('chat-list');
  field.innerHTML += data;
}

// This will insert message into chat - used by server
function broadcastMessage(msg) {
  var field = document.getElementById('chat-list');

  var re_nickname = /.*:/;
  var re_msg = /:(.*)/;

  var data = "<dt>" + msg.match(re_nickname) + "</dt>" + "<dd>" + msg.match(re_msg)[1] + "</dd>";
  field.innerHTML += data;
}
