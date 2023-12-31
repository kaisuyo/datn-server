const Sequelize = require('sequelize')

const sequelize = require('../core/connect')

const Question = sequelize.define('questions', {
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
  answer: Sequelize.STRING,
  optionA: {
		type: Sequelize.STRING,
		field: 'option_a'
	},
  optionB: {
		type: Sequelize.STRING,
		field: 'option_b'
	},
  optionC: {
		type: Sequelize.STRING,
		field: 'option_c'
	},
  optionD: {
		type: Sequelize.STRING,
		field: 'option_d'
	},
}, {
	timestamps: false
})

module.exports = Question