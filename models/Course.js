const Sequelize = require('sequelize')

const sequelize = require('../core/connect')

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
	status: {
		type: Sequelize.INTEGER,
		defaultValue: -2
	}
}, {
	timestamps: false
})

module.exports = Course