const Sequelize = require('sequelize')

const sequelize = require('../services/services')

const User = sequelize.define('users', {
	userId: {
		type: Sequelize.INTEGER,
		field: 'user_id',
		primaryKey: true,
    autoIncrement: true,
	},
	username: {
		type: Sequelize.STRING,
		field: 'user_name'
	},
  password: Sequelize.STRING
}, {
	timestamps: false
})

module.exports = User