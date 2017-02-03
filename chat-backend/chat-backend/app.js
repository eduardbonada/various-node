var express = require('express');
var	mongoose = require('mongoose');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = {};


/// Server Config ///

server.listen(3000, function(){
	console.log('Server listening on port 3000');
});


/// Mongo Config ///

// connect to DB
mongoose.connect('mongodb://localhost/chatXYZ', function(err){
	if(err){
		console.log(err);
	} else{
		console.log('Connected to mongodb!');
	}
});

// define the schema
var chatSchema = mongoose.Schema({
	nick: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

// actually create the collection 'MessageS' in the DB (collection = model + s)
var Chat = mongoose.model('Message', chatSchema);


/// Express Routes ///

app.get('/', function(req, res){
	// send back the index.html file
	res.sendFile(__dirname + '/index.html');
});


/// Socket Events ///

io.sockets.on('connection', function(socket){
	console.log('Someone connected');

	// retrieve all messages from DB
	// Chat.find({}, function(err, docs){
	// 	if(err) throw err;
	// 	socket.emit('load old msgs', docs);
	// });

	// retrieve last 4 messages from DB
	var query = Chat.find({});
	query.sort('-created').limit(4).exec(function(err, docs){
		if(err) throw err;
		socket.emit('load old msgs', docs);
	});

	socket.on('new user', function(data, callback){
		console.log('New user named ' + data);

		if (data in users){
			callback(false); // send back false if username already picked
		} else{
			callback(true);
			socket.nickname = data; // storing the nickname is convenient to knowthe user inside the chat behind that socket
			users[socket.nickname] = socket;
			updateNicknames(); 
		}
	});

	socket.on('send message', function(data, callback){

		var msg = data.trim();
		if(msg.substr(0,3) === '/w '){
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if(ind !== -1){
				var name = msg.substring(0, ind);
				var msg = msg.substring(ind + 1);
				if(name in users){
					console.log('New whisper: ' + msg + " to " + name + " from " + socket.nickname);
					users[name].emit('whisper', {msg: msg, nick: socket.nickname}); // we emit into the socket of the destination user
				} else{
					callback('Error! Enter a valid user.');
				}
			} else{
				callback('Error! Please enter a message for your whisper.');
			}
		} else{
			console.log('New message: ' + data);
			var newMsg = new Chat({msg: msg, nick: socket.nickname});
			newMsg.save(function(err){
				if(err) throw err;
				io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
			});
		}
	});

	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		console.log('A user named ' + socket.nickname + ' left');
		delete users[socket.nickname];
		updateNicknames(); 
	});

	function updateNicknames(){
		io.sockets.emit('usernames', Object.keys(users)); // emit an event to tell the clients all connected users
	}

});