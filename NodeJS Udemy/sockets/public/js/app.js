var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

jQuery('.room-title').text(room);

var socket = io(); // io() is in the socket.io js file in html


////////////////////////////////////
// Setup socket connection
////////////////////////////////////

// listen to the event 'connect' to detect when the browser has made a connection to the server
socket.on('connect', function() {
	console.log('Connected to server via socket.io!');

	// send event to join a particular room
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

////////////////////////////////////
// Manage  receiving of new message
////////////////////////////////////

socket.on('message', function(message) {
	var momentTimestamp = moment.utc(message.timestamp);

	var $messages = jQuery('.messages');

	var $message = jQuery('<li class="list-group-item"></li>');

	$message.append('<p><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + '</strong>: </p>');
	$message.append('<p>' + message.text + '</p>');

	$messages.append($message);
})

////////////////////////////////////
// Manage submitting of new message
////////////////////////////////////

// select form element
var $form = jQuery('#message-form');

// 'on' method of the jQuery lib to manage submitting new message
$form.on('submit', function(event) {
	event.preventDefault(); // avoid resubmitting page (?)

	var $message = $form.find('input[name=message]'); // just store in a variable the access to the html element (via jquery)

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');
});