// This file contains the sequelize DB model for 'todo' items

var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('todo', { // the table name will be this string with an 's' at the end
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250] // only strings with length '1' or greater and less or equal than '250'
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	},
	{
		hooks : {
			beforeValidate : function(todo, options){
				if(_.isString(todo.description)){
					todo.description = todo.description.trim();
				}
			}
		}
	});
}