const Sequelize = require('sequelize')

const sequelize = require('../services/connect')

const Video = sequelize.define('videos', {
	videoId: {
		type: Sequelize.INTEGER,
		field: 'video_id',
    autoIncrement: true,
    primaryKey: true
	},
	courseId: {
		type: Sequelize.INTEGER,
		field: 'course_id'
	},
	title: Sequelize.STRING,
	description: Sequelize.STRING,
	time: Sequelize.INTEGER,
  URL: {
    type: Sequelize.STRING,
    field: 'video_link'
  }
}, {
	timestamps: false
})

module.exports = Video