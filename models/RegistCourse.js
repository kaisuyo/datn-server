const Sequelize = require('sequelize')

const sequelize = require('../services/connect')

const RegisCourse = sequelize.define('regis_courses', {
	userId: {
		type: Sequelize.INTEGER,
		field: 'user_id',
		primaryKey: true,
	},
	courseId: {
		type: Sequelize.INTEGER,
    primaryKey: true,
		field: 'course_id'
	}
}, {
	timestamps: false
})

module.exports = RegisCourse