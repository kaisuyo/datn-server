const Sequelize = require('sequelize')

const sequelize = require('../services/connect')

const WaitData = sequelize.define('wait_datas', {
  waitId: {
    type: Sequelize.INTEGER,
		field: 'wait_id',
    primaryKey: true,
    autoIncrement: true,
  },
	userId: {
		type: Sequelize.INTEGER,
		field: 'user_id',
	},
	waitType: {
    // waitType  = 0 -> wait upload course, = 1 -> regis course
		type: Sequelize.INTEGER,
		field: 'wait_type',
	},
  waitDataDest: {
		type: Sequelize.INTEGER,
		field: 'wait_data_dest',
	}
}, {
	timestamps: false
})

module.exports = WaitData