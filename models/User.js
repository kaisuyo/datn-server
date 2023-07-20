const Sequelize = require('sequelize')

const sequelize = require('../core/connect')

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
	/// 0 -> user, 1 -> admin, 2 -> system admin
	role: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	// 0 -> không đăng nhập được, 1 -> có thể đăng nhập
	status: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	}
}, {
	timestamps: false
})

module.exports = User