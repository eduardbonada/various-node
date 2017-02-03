
/// ---------- LOAD DEPENDECIES ---------- ///

var express  	= require('express');
var app 	 	= express();

var mongoose 	= require('mongoose');
// var mysql 		= require("mysql");

var bodyParser 	= require('body-parser');
var morgan 		= require('morgan');

// import configuration
var config = require('./config/main');


/// ---------- CONNECT TO DATABASE ---------- ///

// MongoDB
mongoose.connect(config.databaseMongo, function(err) {
	if (err) throw err;
	console.log("Connected to DB");
});


/// ---------- SERVER CONFIGURATION ---------- ///

// set listening port
var PORT = process.env.PORT || 3000;

// set super secret key
app.set('superSecret', config.secret); // secret variable

// Body-parser middleware to get POST requests for API use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Morgan middleware to log requests to console
app.use(morgan('dev'));

// home route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + PORT + '/');
});

// import authentication routes
require('./app/routes/routes-auth')(app);

// import api routes
require('./app/routes/routes')(app);


/// ---------- START UP SERVER ---------- ///

app.listen(PORT, function() {
	console.log('Server listening on port ' + PORT);
});