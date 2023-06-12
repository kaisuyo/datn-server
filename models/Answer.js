const Sequelize = require('sequelize')

const sequelize = require('../services/services')

const Answer = sequelize.define('courses', {
	answerId: {
		type: Sequelize.INTEGER,
		field: 'answer_id',
		primaryKey: true,
    autoIncrement: true,
	},
	questionId: {
		type: Sequelize.INTEGER,
		field: 'question_id'
	},
	title: Sequelize.STRING,
	description: Sequelize.STRING,
}, {
	timestamps: false
})

module.exports = Answer