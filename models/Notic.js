const Sequelize = require('sequelize')

const sequelize = require('../services/services')

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
  status: Sequelize.INTEGER
}, {
	timestamps: false
})

module.exports = Notic