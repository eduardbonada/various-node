var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var _ = require('underscore');

var db = require('./db.js');

// custom middleware
var middleware = require('./middleware')(db);

// body-parser middleware for any JSON request. Gives access to req.body
app.use(bodyParser.json());

// API Root
app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// Get all todos --> GET /todos (?completed=true/false?q=some_description_text_to_search)
app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var query = req.query; // gets query params (/api?key1=value1&key2=value2)

	// compile the GET passed params into a where object
	var where = {
		userId: req.user.get('id')
	};
	if (query.hasOwnProperty('completed')) {
		if (query.completed === 'true') {
			where.completed = true;
		} else if (query.completed === 'false') {
			where.completed = false;
		}
	}
	if (query.hasOwnProperty('q')) {
		if (query.q.length > 0) {
			where.description = {
				$like: '%' + query.q + '%'
			}
		}
	}

	// fetching by 'where'
	db.todo.findAll({
		where: where
	}).then(
		function(todos) {
			res.json(todos);
		},
		function(e) {
			res.status(500).json({
				error: e
			});
		});
});

// Get todo by id --> GET /todos/:id
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10); // make it a base-10 number

	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(
		function(todo) {
			if (!!todo) {
				res.json(todo.toJSON());
			} else {
				res.status(404).json({
					error: 'No todo found with that id'
				});
			}
		},
		function(e) {
			res.status(500).json({
				error: e
			});
		});
});

// Add new todo --> POST /todos
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed'); // only the fields we want

	db.todo.create(body).then(
		function(todo) {
			req.user.addTodo(todo).then(
					function() {
						return todo.reload(); // reload because now the todo has an association, and return the promise so the chain continues
					})
				.then(function(todo) {
					res.json(todo.toJSON());
				});

			// res.json(todo.toJSON()); // version without associations
		},
		function(e) {
			res.status(400).json(e);
		});
});

// Delete todo --> DELETE /todos/:id
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10); // make it a base-10 number

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(
		function(deletedRows) {
			if (deletedRows === 0) {
				res.status(404).json({
					error: 'No todo found with that id'
				});
			} else {
				// res.json(todo.toJSON());
				res.status(204).send(); // 204: ok but nothing to send back
			}
		},
		function(e) {
			res.status(500).json({
				error: e
			});
		});
});

// Update todo --> PUT /todos/:id
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {

	var todoId = parseInt(req.params.id, 10); // make it a base-10 number
	var body = _.pick(req.body, 'description', 'completed'); // only the fields we want
	var attributes = {};

	// check and validate 'description'
	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	// check and validate 'completed'
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	db.todo.findOne({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(
		function(todo) {
			if (todo) {
				todo.update(attributes).then(
					function(todo) {
						res.json(todo.toJSON());
					},
					function(e) {
						res.status(400).json({
							error: e
						});
					});
			} else {
				res.status(404).json({
					error: 'No todo found with that id'
				});
			}
		},
		function(e) {
			res.status(500).json({
				error: e
			})
		});

	// validate description set as true/false --> hooks?
});

// Add new user --> POST /users
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password'); // only the fields we want

	db.user.create(body)
		.then(
			function(user) {
				res.json(user.toPublicJSON());
			},
			function(e) {
				res.status(400).json(e);
			});
});

// Login --> POST /users/login
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password'); // only the fields we want
	var userInstance; // to keep user instance along all chain of promises

	db.user.authenticate(body)
		.then(
			function(user) {
				var token = user.generateToken('authentication');
				userInstance = user;

				// save the token into the database, and return a promise
				return db.token.create({
					token: token
				});

			})
		.then(
			function(token) {
				res.header('Auth', token.get('token')).json(userInstance.toPublicJSON());
			})
		.catch(
			function() {
				// any error...
				res.status(401).send(); // Unauthorized
			});
});

// DELETE /users/login
app.delete('/users/login', middleware.requireAuthentication, function(req, res) {
	req.token.destroy()
		.then(
			function() {
				res.status(204).send();
			})
		.catch(
			function() {
				res.status(500).send();
			});
});

db.sequelize.sync({
	logging: console.log,
	force: true // cleans tables
}).then(
	function() {
		// start the server once the db has been succesfully set
		app.listen(PORT, function() {
			console.log('Express listening on port ' + PORT + '!');
		});
	});