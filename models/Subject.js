const Sequelize = require('sequelize')

const sequelize = require('../core/connect')

const Subject = sequelize.define('subjects', {
	subjectId: {
		type: Sequelize.INTEGER,
		field: 'subject_id',
		primaryKey: true,
    autoIncrement: true,
	},
	title: Sequelize.STRING,
	description: {
		type: Sequelize.STRING,
		defaultValue: ''
	}
}, {
	timestamps: false
})


module.exports = Subject