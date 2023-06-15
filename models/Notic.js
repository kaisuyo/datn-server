const Sequelize = require('sequelize')

const sequelize = require('../services/connect')

const Notic = sequelize.define('notics', {
  noticId: {
    type: Sequelize.INTEGER,
		field: 'notic_id',
    primaryKey: true,
    autoIncrement: true,
  },
	userId: {
		type: Sequelize.INTEGER,
		field: 'user_id',
	},
	message: Sequelize.STRING,
	// 0 -> chưa đọc,  -> đã đọc
  status: Sequelize.INTEGER
}, {
	timestamps: false
})

module.exports = Notic