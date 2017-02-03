var express = require('express');
var app = express();
var http = require('http');

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

app.get('/', function(req, res){
	res.send('Hello World from Openshift!');
});

http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
    console.log("Express server listening at %s:%d ", app.get('ip'),app.get('port'));
});

/*********************/

var mongoose = require('mongoose');
var url = "mongodb://localhost/test_database";
if(process.env.OPENSHIFT_MONGODB_DB_HOST && process.env.OPENSHIFT_MONGODB_DB_PORT){
	url = "mongodb://" + process.env.OPENSHIFT_MONGODB_DB_HOST + ":" + process.env.OPENSHIFT_MONGODB_DB_PORT;
}
var db = mongoose.connect(
	url,
	function(err) {
		if(err)	throw err;
		console.log("Connected to DB at " + url);
		Test({ test_string: 'Hello World from Mongoose!' });
});

var Test = mongoose.model('Test', mongoose.Schema({ test_string: { type: String } }) );

app.get('/hello', function(req, res){
	db.Test.findOne({}, function(err, result){
		if (result){
			res.send(result.test_string);
		}
	});
});
