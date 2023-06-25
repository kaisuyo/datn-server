const Sequelize = require('sequelize')

const sequelize = require('../services/connect')

const SeenVideo = sequelize.define('seen_videos', {
	userId: {
		type: Sequelize.INTEGER,
		field: 'user_id',
    primaryKey: true
	},
	videoId: {
		type: Sequelize.INTEGER,
		field: 'video_id',
    primaryKey: true
	},
	fraq: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	rate: {
		type: Sequelize.FLOAT,
		defaultValue: 0
	},
	time: {
		type: Sequelize.FLOAT,
		defaultValue: 0
	}
}, {
	timestamps: false
})

module.exports = SeenVideo