var weather = require('./weather.js');
var location = require('./location.js');

// yargs
var argv = require('yargs')
    .option('location', {
                demand: false,
                alias: 'l',
                description: 'Location where to get weather from',
                type: 'string'
            })
    .help('help')
    .argv;
var command = argv._[0];


// Version with Promises

if(typeof argv.location === 'string' && argv.location.length > 0){
	weather(argv.location).then(
		// success
		function (weatherMessage){
			console.log(weatherMessage);
		}
	).catch(function (error) {
		console.log(error);
	})
}
else{
	location().then( // manage location promise result
		// success
		function (location){
			return weather(location.city);
		}
	).then( // manage weather promise result
		// success
		function (weatherMessage){
			console.log(weatherMessage);
		}
	).catch(
		function (error){
			console.log(error);
		}
	)
}




/* Version with callbacks

if(typeof argv.location === 'string' && argv.location.length > 0){
	console.log('Location was provided');
	weather(argv.location, function(weatherMessage){
		console.log(weatherMessage);	
	});
}
else{
	console.log('Location was not provided');
	location(function(location){
		if(!location){
			console.log('Unable to guess location.');
		}
		else{
			weather(location.city, function(weatherMessage){
				console.log(weatherMessage);	
			});
		}
	});
}
*/


/* Initial weather and location testing code

weather(function(weatherMessage){
	console.log(weatherMessage);
});

location(function(location){
	if(!location){
		console.log('Unable to guess location');
	}
	else{
		console.log('city: ' + location.city);
		console.log('long/lat: ' + location.loc);
	}
});
*/
