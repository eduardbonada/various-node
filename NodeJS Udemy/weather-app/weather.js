// Version with promises

var request = require('request');

module.exports = function (location){

	return new Promise(function(resolve, reject) {

		if(!location){
			reject('Weather: No location provided');
		}

		var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location) + '&units=metric&appid=2de143494c0b295cca9337e1e96b00e0';

		request(
		{
			url: url,
			json: true
		}, 
		function (error, response, jsonBodyWeather) { // this is the callback function
			if (error) {
				reject('Weather: Unable to fetch weather.');
			} else {
				//console.log(jsonBodyWeather);
				if(jsonBodyWeather.cod == 200){
					resolve(
						jsonBodyWeather.name + 
						'\n\tTemperature: ' + jsonBodyWeather.main.temp + 'C' +
						'\n\tHumidity:    ' + jsonBodyWeather.main.humidity + '%' +
						'\n\tCloudiness:  ' + jsonBodyWeather.clouds.all + '%'
					);
				}
				else{
					reject('Weather: Openweathermap error -> ' + jsonBodyWeather.message);
				}
			}
		});
	});
};


/* Version with callbacks

var request = require('request');

module.exports = function (location, weatherMessageCallback){
 
	if(!location){
		console.log('Weather: No location provided');
	}
	else{
		var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(location) + '&units=metric&appid=2de143494c0b295cca9337e1e96b00e0';

		request({
			url: url,
			json: true
		}, function (error, response, jsonBody) { // this is the callback function
			if (error) {
				console.log('Weather: Unable to fetch weather.');
			} else {
				//console.log(jsonBody);
				if(jsonBody.cod == 200){
					weatherMessageCallback(
						jsonBody.name + 
						'\n\tTemperature: ' + jsonBody.main.temp + 'C' +
						'\n\tHumidity:    ' + jsonBody.main.humidity + '%' +
						'\n\tCloudiness:  ' + jsonBody.clouds.all + '%'
					);
				}
				else{
					console.log('Weather: Openweathermap error -> ' + jsonBody.message);
				}
			}
		});

	}


}

*/