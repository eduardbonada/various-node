var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.listen('8081', function(){

	console.log('Scraping happens on port 8081');

	//scrapeIndexPage();
	//console.log(JSON.stringify(tripPages));

	/*
	get url from tripPages, or passed
	*/

	scrapeTripPage();

	console.log(emails);

});

var tripPages = [];
var emails = [];


function scrapeIndexPage(){

	/*
	cosntruct url with index page: http://lavueltaalmundo.net/companeros-de-viaje/1
	*/

	var $ = cheerio.load(fs.readFileSync('vuelta_index_test.html'));

	$('.comp .compder .h2_c').each(function(i, elem) {
		tripPages.push('http://lavueltaalmundo.net/' + $(elem).find('a').eq(1).attr('href') );
	});


};

function scrapeTripPage(){

	var $ = cheerio.load(fs.readFileSync('vuelta_trip_test.html'));

	$('div .comentariostexto').each(function(i, elem) {
		extractedEmails = extractEmails( String( $(this).text() ) );
		if (extractedEmails != null){
			emails = emails.concat(extractedEmails);
		}
	});

};

function extractEmails (text){
	return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}
