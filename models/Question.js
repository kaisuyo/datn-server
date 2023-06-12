const Sequelize = require('sequelize')

const sequelize = require('../services/services')

const Question = sequelize.define('courses', {
	questionId: {
		type: Sequelize.INTEGER,
		field: 'question_id',
		primaryKey: true,
    autoIncrement: true,
	},
	testId: {
		type: Sequelize.INTEGER,
		field: 'test_id'
	},
	title: Sequelize.STRING,
	description: Sequelize.STRING,
  answer: Sequelize.STRING
}, {
	timestamps: false
})

module.exports = Question