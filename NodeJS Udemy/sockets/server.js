var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var moment = require('moment');

// create a server with the built-in module in Node (http)
var http = require('http').Server(app); // both 'http' and app (express) are listening

// io expects to pass the http server, we do it direxctly here
var io = require('socket.io')(http);

// expose the 'public' folder
app.use(express.static(__dirname + '/public'));

// to keep info of the socket user
var clientInfo = {
	/*
		string_representing_the_socket: {name: ..., room: ...}, 
		string_representing_the_socket: {name: ..., room: ...}, 
		...
	*/
};

// listen to the event 'connection' to detect when a browser has made a connection to the server
io.on('connection', function(socket) {

	console.log('User connected via socket.io!');

	// Send initial message
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application',
		timestamp: moment().valueOf()
	});

	/////////////////////////////
	// JoinRoom received
	/////////////////////////////
	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;

		socket.join(req.room); // connect to the room

		// send a message notifying that a new user joined the room
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined the room.',
			timestamp: moment.valueOf()
		});
	});

	/////////////////////////////
	// Disconnect received
	/////////////////////////////
	socket.on('disconnect', function(req) {
		if(typeof clientInfo[socket.id] !== 'undefined'){
			var userData = clientInfo[socket.id];
			
			socket.leave(userData); // tell socket to leave the room

			// emit a message to notify it
			io.to(userData.room).emit('message',{
				name: 'System',
				text: userData.name + ' has left the room.',
				timestamp: moment.valueOf()
			});

			delete clientInfo[socket.id]; // delete from array
		}
	});

	/////////////////////////////
	// Message received
	/////////////////////////////
	socket.on('message', function(message) {
		console.log('Message received: ' + message.text);

		if(message.text === '@currentUsers'){
			sendCurrentUsers(socket);
		}
		else{
			message.timestamp = moment().valueOf();

			io.to(clientInfo[socket.id].room).emit('message', message); // to send the message to everyone in the room including the browser that sent it
			//socket.broadcast.emit('message', message); // to send the message to everyone but the browser that sent it
		}
	});
});

http.listen(PORT, function() {
	console.log('Server started!');
});

// Sends current users to provided socket
function sendCurrentUsers (socket){
	if(typeof clientInfo[socket.id] === 'undefined'){
		return;
	}

	var users = [];
	var currentRoom = clientInfo[socket.id].room;
	Object.keys(clientInfo).forEach(function (socketId){
		if(currentRoom === clientInfo[socketId].room){
			users.push(clientInfo[socketId].name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: moment.valueOf()
	});
}








