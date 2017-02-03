var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db = {};

// export Sequelize module and sequelize instance
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// load sequelize models that will be organized in different files
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');

// Associations
db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

module.exports = db; // exporting a single object with many things inside (todo model, sequelize instance, Sequelize library)