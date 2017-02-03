var request = require('request');
var url = 'http://api.openweathermap.org/data/2.5/weather?q=Barcelona&units=metric&appid=2de143494c0b295cca9337e1e96b00e0';

request({
	url: url,
	json: true
}, function (error, response, jsonBody) { // this is the collback function
	if (error) {
		console.log('Unable to fetch weather.');
	} else {
		//console.log(JSON.stringify(body, null, 4)); // to pretty print the JSON
		// It's 77.77 in Philadelphia!
		console.log('It\'s ' + jsonBody.main.temp + ' in ' + jsonBody.name + '!');
	}
});

console.log('After request!');