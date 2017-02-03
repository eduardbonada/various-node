var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = process.env.PORT || 3000;

var userList = [];
var typingUsers = {};

var sentences = [
	{name: "Doc", text: "Roads? Where we're going, we don't need roads."},
	{name: "Doc", text: "Great Scott!"},
	{name: "Doc", text: "1.21 gigawatts?! 1.21 gigawatts?! Great Scott!"},
	{name: "Doc", text: "If my calculations are correct, when this baby hits eighty-eight miles per hour..."},
	{name: "Doc", text: "Next Saturday night, we're sending you back to the future!"},
	{name: "Marty", text: "This is heavy."},
	{name: "Marty", text: "Why do you keep calling me Calvin?"},
	{name: "Marty", text: "Are you telling me that you built a time machine... out of a DeLorean?"}, 
	{name: "Marvin", text: "Chuck. Chuck. It's Marvin - your cousin, Marvin BERRY. You know that new sound you're looking for? Well, listen to this."}, 

];

app.get('/', function(req, res){
	res.send('<h1>AppCoda - SocketChat Server</h1>');
});


http.listen(PORT, function(){
	console.log('Listening on *:3000');
});


io.on('connection', function(clientSocket){
	console.log('a user connected');

	clientSocket.on("connectUser", function(clientNickname) {
		console.log('inbound event connectUser: ' + clientNickname);

		// check if user is already in the list
		var userInfo = {};
		var foundUser = false;
		for (var i=0; i<userList.length; i++) {
			if (userList[i]["nickname"] == clientNickname) {
				userList[i]["isConnected"] = true
				userList[i]["id"] = clientSocket.id;
				userInfo = userList[i];
				foundUser = true;
				break;
			}
		}

		// if user not found, create a new one
		if (!foundUser) {
			userInfo["id"] = clientSocket.id;
			userInfo["nickname"] = clientNickname;
			userInfo["isConnected"] = true
			userList.push(userInfo);
		}

		// update the rest of users
		io.emit("userList", userList);
		io.emit("userConnectUpdate", userInfo)
	});

	clientSocket.on('chatMessage', function(clientNickname, message){
		console.log('inbound event chatMessage from: ' + clientNickname);

		// send received message to all
		var currentDateTime = new Date().toLocaleString();
		delete typingUsers[clientNickname];
		io.emit("userTypingUpdate", typingUsers);
		io.emit('newChatMessage', clientNickname, message, currentDateTime);

		// send random sentence to all
		setTimeout(function() {
			var sentence = sentences[Math.floor(Math.random()*sentences.length)];
			var currentDateTime = new Date().toLocaleString();
			io.emit('newChatMessage', sentence["name"], sentence["text"], currentDateTime);
		}, 2000);

	});

	clientSocket.on("startType", function(clientNickname){
		console.log('inbound event startType: ' + clientNickname);

		typingUsers[clientNickname] = 1;
		io.emit("userTypingUpdate", typingUsers);
	});

	clientSocket.on("stopType", function(clientNickname){
		console.log('inbound event stopType: ' + clientNickname);

		delete typingUsers[clientNickname];
		io.emit("userTypingUpdate", typingUsers);
	});


	clientSocket.on('disconnect', function(){
		console.log('inbound event disconnect');

		var clientNickname;
		for (var i=0; i<userList.length; i++) {
			if (userList[i]["id"] == clientSocket.id) {
				userList[i]["isConnected"] = false;
				clientNickname = userList[i]["nickname"];
				break;
			}
		}

		delete typingUsers[clientNickname];
		io.emit("userList", userList);
		io.emit("userExitUpdate", clientNickname);
		io.emit("userTypingUpdate", typingUsers);
	});


	clientSocket.on("exitUser", function(clientNickname){
		console.log('inbound event exitUser: ' + clientNickname);

		for (var i=0; i<userList.length; i++) {
			if (userList[i]["id"] == clientSocket.id) {
				userList.splice(i, 1);
				break;
			}
		}
		io.emit("userExitUpdate", clientNickname);
	});

});
