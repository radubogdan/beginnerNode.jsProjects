var server = io.connect('http://localhost:3000');

server.on('connect', function(data) {
  // When client connect ask for nickname and emit to the server
  var nickname = prompt('What is your nickname?');
  server.emit('join', nickname);
});

server.on('messages', function(data) {
  //alert(data.hello);
  // Wait for events ... insert the broadcasted message into the chat.
  insertMessage(data);
  console.log(data);
});

// This is called when send is pressed
function SendMessage() {
  var message = document.getElementById('chat-message').value;

  // Emit the message to the server
  server.emit('messages', message);

  // Insert message into message container - used to see your own message
  insertMessage(message);
}

// This will insert message into chat
function insertMessage(msg) {
  var data = "<li>" + msg + "</li>";
  var field = document.getElementById('chat-list');
  field.innerHTML += data;
}
