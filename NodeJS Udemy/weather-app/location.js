// Version with Promises

var request = require('request');
var url = 'http://ipinfo.io';

module.exports = function (){

	return new Promise(function(resolve, reject){
		request({
			url: url,
			json: true
		}, function (error, response, jsonBodyLocation) {
			if (error) {
				reject('Location: Unable to get location.');
			} else {
				resolve(jsonBodyLocation);
			}
		});
	});


}

/* Version with callbacks

var request = require('request');
var url = 'http://ipinfo.io';

module.exports = function (locationCallback){

	request({
		url: url,
		json: true
	}, function (error, response, jsonBody) { // this is the callback function
		if (error) {
			console.log('Unable to get location.');
			locationCallback(jsonBody);
		} else {
			locationCallback(jsonBody);
		}
	});

}

*/