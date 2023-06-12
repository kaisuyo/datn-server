const Sequelize = require('sequelize')

const sequelize = require('../services/services')

const Subject = sequelize.define('subjects', {
	subjectId: {
		type: Sequelize.INTEGER,
		field: 'subject_id',
		primaryKey: true,
    autoIncrement: true,
	},
	title: Sequelize.STRING,
	description: Sequelize.STRING,
}, {
	timestamps: false
})


module.exports = Subject