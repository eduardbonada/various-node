var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

// this creates the DB table (returns a Promise)
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250] // only strings with length '1' or greater and less or equal than '250'
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})


sequelize.sync({
	logging: console.log//,
	//force: true
}).then(function() {

	// fetching by id
	Todo.findById(2).then(function(todo){
		if(todo){
			console.log(todo.toJSON());
		}
		else{
			console.log('no todo found');
		}
	});

	// fetching by completed
	Todo.findAll({
		where:{
			completed: false
		}
	}).then(function(todos){
		if(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		}
		else{
			console.log('no todo found');
		}
	});

	// fetching by description text
	Todo.findAll({
		where:{
			description: {
				$like : '%bread%'
			}
		}
	}).then(function(todos){
		if(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		}
		else{
			console.log('no todo found');
		}
	});

	/*

	// This block of text creates two entries and fetches them with different options
	// this sequence of then's is not what we would do in production, 
	// it is just for this example to show how to add entries and how to fetch them

	Todo.create({
		description: "Walk out the dog" //add one entry
	}).then(function(todo) {
		return Todo.create({
			description: "Buy bread" //add another entry
		});
	}).then(function() {
		// fetch an entry from the database

		// return Todo.findById(3); // find by id

		return Todo.findAll({ // find all that match 'where'
			where: {
				description: {
					$like: '%Bread%'
				},
				completed: false
			}
		});

	}).then(function(todos) {
		// show the todos found
		if (todos) {
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		} else {
			console.log('no todo found');
		}
	}).catch(function(e) {
		console.log(e);
	});
	*/

});