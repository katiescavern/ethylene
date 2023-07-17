const firebaseConfig = {
  apiKey: "AIzaSyD3vnejFrYuV81pZMlx7UagUN7KdezQZ7A",
  authDomain: "ethylene-808d8.firebaseapp.com",
  databaseURL: "https://ethylene-808d8-default-rtdb.firebaseio.com",
  projectId: "ethylene-808d8",
  storageBucket: "ethylene-808d8.appspot.com",
  messagingSenderId: "860019087299",
  appId: "1:860019087299:web:724419314a5d2d34094f76",
  measurementId: "G-WDPVVBPKPC"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get chatroom container and messages div
var chatroomContainer = document.getElementById('chatroom-container');
var chatroomMessages = document.getElementById('chatroom-messages');

// Get room name input, username input, and message input
var roomNameInput = document.getElementById('room-name');
var usernameInput = document.getElementById('username');
var messageInput = document.getElementById('message-input');

// Function to join/create a room
function joinOrCreateRoom() {
  var roomName = roomNameInput.value.trim();
  var username = usernameInput.value.trim();

  if (roomName !== '' && username !== '') {
    // Create or join the room
    var roomRef = firebase.database().ref('chatrooms/' + roomName);
    setupRoom(roomRef, username);
  }
}

// Function to set up the room and listen for new messages
function setupRoom(roomRef, username) {
  // Clear existing messages
  chatroomMessages.innerHTML = '';

  // Listen for new messages
  roomRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayMessage(message.username, message.text, message.timestamp);
  });

  // Save the username to local storage
  localStorage.setItem('username', username);
}

// Function to display a new message
function displayMessage(username, text, timestamp) {
  var messageElement = document.createElement('p');
  messageElement.innerHTML = '<strong>' + username + '</strong> (' + timestamp + '): ' + text;
  chatroomMessages.appendChild(messageElement);
}

// Function to send a message
function sendMessage() {
  var roomName = roomNameInput.value.trim();
  var username = localStorage.getItem('username');
  var messageText = messageInput.value.trim();

  if (roomName !== '' && username !== '' && messageText !== '') {
    // Get a new database reference for the room
    var roomRef = firebase.database().ref('chatrooms/' + roomName);

    // Generate a new message key
    var messageKey = roomRef.push().key;

    // Create the message object
    var message = {
      username: username,
      text: messageText,
      timestamp: new Date().toLocaleString()
    };

    // Save the message to the database
    roomRef.child(messageKey).set(message);

    // Clear the message input
    messageInput.value = '';
  }
}