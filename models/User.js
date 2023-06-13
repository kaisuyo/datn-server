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
  password: Sequelize.STRING,
	/// 0 -> user, 1 -> admin
	role: Sequelize.INTEGER,
	// 0 -> không đăng nhập được, 1 -> có thể đăng nhập
	status: Sequelize.INTEGER
}, {
	timestamps: false
})

module.exports = User