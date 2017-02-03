var cryptojs = require('crypto-js');

module.exports = function(db) {

	return {
		// define all middleware in ths object
		requireAuthentication: function(req, res, next) {

			var token = req.get('Auth') || ''; // get the token from header, default to empty string

			db.token.findOne({
					where: {
						tokenHash: cryptojs.MD5(token).toString()
					}
				}).then(
					function(tokenInstance) {
						if (!tokenInstance) {
							throw new error;
						}

						req.token = tokenInstance; // set to req so it can be accessed by route code (eg. to destroy it in logout)

						return db.user.findByToken(token); // look for the user and keep the chain alive
					})
				.then(
					function(user) {
						req.user = user;
						next();
					})
				.catch(function() {
					res.status(401).send();
				});
		}
	};

}