const Sequelize = require('sequelize')

const sequelize = require('../services/services')

const Course = sequelize.define('courses', {
	courseId: {
		type: Sequelize.INTEGER,
		field: 'course_id',
		primaryKey: true,
    autoIncrement: true,
	},
	subjectId: {
		type: Sequelize.INTEGER,
		field: 'subject_id'
	},
	title: Sequelize.STRING,
	description: Sequelize.STRING,
}, {
	timestamps: false
})

module.exports = Course