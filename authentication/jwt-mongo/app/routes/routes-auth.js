
/// ---------- IMPORT DEPENDENCIES ---------- ///

var passport 	= require('passport');
var express 	= require('express');
var jwt 		= require('jsonwebtoken');

// Import configuration
const config = require('../../config/main');

// Import models
var User = require('../models/user');


/// ---------- API AUTH routes ---------- ///

module.exports = function(app) {

	// Initialize passport for use and bring in defined Passport Strategy
	app.use(passport.initialize());
	// require('../../config/passport')(passport);

	// Create API group routes
	var authRoutes = express.Router();

	// Register new users
	authRoutes.post('/register', function(req, res) {
		if (!req.body.email || !req.body.password) {
			res.json({
				success: false,
				message: 'Please enter an email and a password.'
			});
		} else {
			var newUser = new User({
				email: req.body.email,
				password: req.body.password
			});

			// Attempt to save the user
			newUser.save(function(err) {
				if (err) {
					return res.json({
						success: false,
						message: 'That email address already exists.'
					});
				}
				res.json({
					success: true,
					message: 'Successfully created new user.'
				});
			});
		}
	});

	// Authenticate the user and get a JSON Web Token to include in the header of future requests.
	authRoutes.post('/login', function(req, res) {
		User.findOne({
			email: req.body.email
		}, function(err, user) {
			if (err) throw err;

			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else {
				// Check if password matches
				user.comparePassword(req.body.password, function(err, isMatch) {
					if (isMatch && !err) {
						// Create token if the password matched and no error was thrown
						var token = jwt.sign(user, app.get('superSecret'), {
							expiresIn: 1440 // expires in 24 hours
						});
						res.json({
							success: true,
							token: 'JWT ' + token
						});
					} else {
						res.json({
							success: false,
							message: 'Authentication failed. Wrong password.'
						});
					}
				});
			}
		});
	});

	// Set url for API group routes. Api routes are accessed via 'e.g. /api/dashboard'
	app.use('/auth', authRoutes);

};