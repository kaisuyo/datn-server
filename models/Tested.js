const Sequelize = require('sequelize')

const sequelize = require('../services/connect')

const Tested = sequelize.define('testeds', {
  testId: {
    type: Sequelize.INTEGER,
    field: 'test_id',
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id',
    primaryKey: true
  },
  score: Sequelize.FLOAT,
  time: Sequelize.FLOAT,
  rate: Sequelize.FLOAT,
  fraq: Sequelize.INTEGER
}, {
  timestamps: false
})

Tested.removeAttribute('id')

module.exports = Tested