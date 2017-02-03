// https://scotch.io/tutorials/scraping-the-web-with-node-js

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var fs = require('fs');

app.listen('8081', function(){

	console.log('Scraping happens on port 8081');

	scrape();

});

function scrape(){

	var title = '';
	var year = '';
	var rating = '';

	var $ = cheerio.load(fs.readFileSync('imdb_test.html'));

	$('.title_wrapper h1').filter(function(i, elem) {

		var data = $(elem);

		var titleYearString = data.text().split('(')

		title = titleYearString[0].trim();
		year = (titleYearString[1].split(')'))[0].trim();

	});

	$('.ratingValue').filter(function(i, elem) {

		rating = $(elem).find('span').first().text();

	});

	console.log(title + ' [' + year + ']' + ' - ' + rating);

}
