const Sequelize = require('sequelize')

const sequelize = require('../services/services')

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
  score: Sequelize.INTEGER,
  time: Sequelize.INTEGER,
  rate: Sequelize.FLOAT
}, {
  timestamps: false
})

Tested.removeAttribute('id')

module.exports = Tested