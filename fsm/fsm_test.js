StateMachine = require("./state-machine.js") // https://github.com/jakesgordon/javascript-state-machine

var travFsm = StateMachine.create({
	initial: 'Welcome',
	events: [
		{ name: 'WelcomeCompleted',  from: 'Welcome',  to: 'WaitTripInfoDestination' },
		{ name: 'CompletedTripInfoDestination',  from: 'WaitTripInfoDestination', to: 'WaitLocalToAccept' },
		{ name: 'LocalAccepted',  from: 'WaitLocalToAccept',  to: 'WaitNewTrip' },
		{ name: 'UnknownAnswer',  from: 'WaitTripInfoDestination',  to: 'WaitTripInfoDestination' },
		{ name: 'AsyncComment',  from: 'WaitLocalToAccept',  to: 'WaitLocalToAccept' },
		{ name: 'AsyncComment',  from: 'WaitNewTrip',  to: 'WaitNewTrip' }
		],
	callbacks: {

		onWelcome: function(event, from, to) {
			// send welcome message
			console.log("Welcome!");

			//trigger event WelcomeCompleted
			this.WelcomeCompleted();
		},

		onWaitTripInfoDestination: function(event, from, to) {
			// send message asking destination
			console.log("Where are you going?");
		},

		onWaitLocalToAccept: function(event, from, to) {
			// send 24h message
			console.log("Let's wait the local)");
		},

		onWaitNewTrip: function(event, from, to) {
			// send message about new local / trip
			console.log("Go talk to your local");
		},	

		onUnknownAnswer: function(event, from, to) {
			// send message about not understood answer
			console.log("I did not understand");
		},

		onAsyncComment: function(event, from, to) {
			// send message with random answer
			console.log("Great Scott!");
		},
	}
});

var stdin = process.openStdin();

stdin.addListener("data", function(d) {

	var data = d.toString().trim();

	switch (data){
		case "CD": travFsm.CompletedTripInfoDestination(); break;
		case "LA": travFsm.LocalAccepted(); break;
		case "UA": travFsm.UnknownAnswer(); break;
		case "AC": travFsm.AsyncComment(); break;
		default:  break;
	}

});
