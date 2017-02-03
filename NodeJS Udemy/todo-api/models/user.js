// This file contains the sequelize DB model for 'user' items

var _ = require('underscore');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cryptojs = require('crypto-js');


module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', { // the table name will be this string with an 's' at the end
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true, // make sure there is not another user with the same email
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value); // not really stored in DB (virtual)
				this.setDataValue('password_hash', hashedPassword);
			}
		},
		password_hash: {
			type: DataTypes.STRING
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (_.isString(user.email)) {
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (_.isString(body.email) && _.isString(body.password)) {
						user.findOne({
							where: {
								email: body.email
							}
						}).then(
							function(user) {
								if (!user) {
									reject();
								} else {
									if (bcrypt.compareSync(body.password, user.get('password_hash'))) {
										resolve(user);
									} else {
										reject();
									}
								}
							},
							function(e) {
								reject();
							});

					} else {
						reject();
					}
				});
			},
			findByToken: function(token) {
				return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, 'qwerty12345'); // use KEY2 to verify the token
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123|@#'); // use KEY1 to decrypt the data into bytes
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8)); // bytes into JSON 

						user.findById(tokenData.id).then(
							function(user) {
								if (user) {
									resolve(user);
								} else {
									reject();
								}
							},
							function(e) {
								reject();
							});
					} catch (e) {
						reject();
					}
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() { // only return public properties
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					console.log('if');
					return undefined; // something is wrong if it is not string
				}

				try {
					var stringData = JSON.stringify({
						id: this.get('id'),
						type: type
					}); // data including type and userId
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123|@#').toString(); // encrypted version of the data (using KEY1)
					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty12345'); // token object including the encrypted data and signed (using KEY2)

					return token;
				} catch (e) {
					console.log('catch');
					console.error(e);
					return undefined; // something went wrong
				}

			}
		}
	});
	return user;
}