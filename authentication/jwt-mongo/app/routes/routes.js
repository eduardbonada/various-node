
/// ---------- IMPORT DEPENDENCIES ---------- ///

var passport 	= require('passport');
var express 	= require('express');
var jwt 		= require('jsonwebtoken');

// Import models
var User = require('../models/user');


/// ---------- API AUTH routes ---------- ///

module.exports = function(app) {

	// Import defined Passport Strategy
	require('../../config/passport')(passport);

	// Create API group routes
	var apiRoutes = express.Router();

	// Protect dashboard route with JWT
	apiRoutes.get('/test', passport.authenticate('jwt', { session: false }), function(req, res) {
		res.send('It worked! User id is: ' + req.user._id + '.');
	});

	// Set url for API group routes. Api routes are accessed via 'e.g. /api/dashboard'
	app.use('/api', apiRoutes);

};