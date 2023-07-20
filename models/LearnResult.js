const Sequelize = require('sequelize')

const sequelize = require('../core/connect')

const LearnResult = sequelize.define('learn_results', {
	userId: {
		type: Sequelize.INTEGER,
		field: 'user_id',
		primaryKey: true,
	},
  subjectId: {
    type: Sequelize.INTEGER,
    field: 'subject_id',
    primaryKey: true
  },
	rate: Sequelize.FLOAT,
  timeTest: {
    type: Sequelize.FLOAT,
    field: 'time_test'
  },
  timeVideo: {
    type: Sequelize.FLOAT,
    field: 'time_video'
  },
  score: Sequelize.FLOAT,
  testTimes: {
    type: Sequelize.FLOAT,
    field: 'test_times'
  },
  videoTimes: {
    type: Sequelize.FLOAT,
    field: 'video_times'
  },
  courseTotal: {
    type: Sequelize.INTEGER,
    field: 'course_total'
  },
  label: Sequelize.STRING
}, {
	timestamps: false
})

module.exports = LearnResult