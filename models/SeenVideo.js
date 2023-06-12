const Sequelize = require('sequelize')

const sequelize = require('../services/services')

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
	fraq: Sequelize.INTEGER,
	rate: Sequelize.FLOAT,
	time: Sequelize.INTEGER
}, {
	timestamps: false
})

module.exports = SeenVideo