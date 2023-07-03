const Sequelize = require('sequelize')

const sequelize = require('../services/connect')

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
	subjectId: {
		type: Sequelize.INTEGER,
		field: 'subject_id'
	}
}, {
	timestamps: false
})

module.exports = Test