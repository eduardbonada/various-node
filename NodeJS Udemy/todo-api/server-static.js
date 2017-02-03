var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var bodyParser = require('body-parser');

var _ = require('underscore');

// Static data to use before we connect to DB 
var todos = [{
	id: 1,
	description: 'Comprar pa',
	completed: false
}, {
	id: 2,
	description: 'Comprar platans',
	completed: true
}];
var todoNextId = 1;

// body-parser middleware for any JSON request. Gives access to req.body
app.use(bodyParser.json());

// API Root
app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// Get all todos --> GET /todos (?completed=true/false?q=some_description_text_to_search)
app.get('/todos', function(req, res) {

	var queryParams = req.query; // gets query params (/api?key1=value1&key2=value2)

	var filteredTodos = todos;

	// select todos by matching 'completed'
	if (queryParams.hasOwnProperty('completed')) {
		if (queryParams.completed === 'true') {
			filteredTodos = _.where(filteredTodos, {
				completed: true
			});
		} else if (queryParams.completed === 'false') {
			filteredTodos = _.where(filteredTodos, {
				completed: false
			});
		}
	}

	// select todos by matching 'q' query
	if (queryParams.hasOwnProperty('q')) {
		if (queryParams.q.length > 0) {
			filteredTodos = _.filter(filteredTodos, function(todo) {
				return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
			});
		}
	}

	res.json(filteredTodos);
});

// Get todo by id --> GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10); // make it a base-10 number

	// look for item with _ (returns first match)
	var foundTodo = _.findWhere(todos, {
		id: todoId
	});

	if (foundTodo) {
		res.json(foundTodo);
	} else {
		res.status(404).json({
			error: 'No todo found with that id'
		});
	}
});

// Add new todo --> POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed'); // only the fields we want

	if (_.isString(body.description) && body.description.trim().length > 0 // check for empty description or only spaces
		&& _.isBoolean(body.completed)) {
		body.id = todoNextId; // add id
		body.description = body.description.trim(); // removing spaces

		todos.push(body);
		todoNextId++;

		res.json(body);
	} else {
		// return 404 and empty body if bad fields format
		return res.status(404).json({
			error: 'Bad fields format'
		});

	}
});

// Delete todo --> DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10); // make it a base-10 number

	// look for item with _ (returns first match)
	var foundTodo = _.findWhere(todos, {
		id: todoId
	});

	if (foundTodo) {
		todos = _.without(todos, foundTodo);
		res.json(foundTodo);
	} else {
		res.status(404).json({
			error: 'No todo found with that id'
		});
	}
});

// Update todo --> PUT /todos/:id
app.put('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id, 10); // make it a base-10 number

	// look for item with _ (returns first match)
	var foundTodo = _.findWhere(todos, {
		id: todoId
	});

	if (!foundTodo) {
		res.status(404).json({
			error: 'No todo found with that id'
		});
	}

	var body = _.pick(req.body, 'description', 'completed'); // only the fields we want
	var validAttributes = {};

	// check and validate 'description'
	if (body.hasOwnProperty('description')) {
		if (_.isString(body.description) && body.description.trim().length > 0) {
			validAttributes.description = body.description.trim();
		} else {
			res.status(404).json({
				error: 'Wrong description property'
			});
		}
	}

	// check and validate 'completed'
	if (body.hasOwnProperty('completed')) {
		if (_.isBoolean(body.completed)) {
			validAttributes.completed = body.completed;
		} else {
			res.status(404).json({
				error: 'Wrong completed property'
			});
		}
	}

	// Copy properties from validAttributes to foundTodo.
	// No need to do anything else because foundTodo is passed by reference 
	// and actually points to an object in todos
	_.extend(foundTodo, validAttributes);

	res.json(foundTodo);

});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});