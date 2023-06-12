const Sequelize = require('sequelize')

const sequelize = require('../services/services')

const Test = sequelize.define('tests', {
	testId: {
		type: Sequelize.INTEGER,
		field: 'test_id',
		autoIncrement: true,
    primaryKey: true
	},
	courseId: {
		type: Sequelize.INTEGER,
		field: 'course_id'
	},
	description: Sequelize.STRING,
	estimate: Sequelize.INTEGER,
	title: Sequelize.STRING,
}, {
	timestamps: false
})

module.exports = Test