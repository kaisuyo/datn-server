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
	receiverId: {
		type: Sequelize.INTEGER,
		field: 'receiver_id',
	},
	waitType: {
		type: Sequelize.INTEGER,
		field: 'wait_type',
	},
  waitDataDest: {
		type: Sequelize.INTEGER,
		field: 'wait_data_dest',
	},
	message: Sequelize.STRING
}, {
	timestamps: false
})

module.exports = WaitData