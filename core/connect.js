const Sequelize = require('sequelize')

const sequelize = new Sequelize('datn_bacnd', 'sa', 'kinjirou', {
	host: 'postgres.bacnd.own.vn',
	dialect: 'postgres',

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},

});

// const sequelize = new Sequelize('gr1', 'bacnd', '123456789', {
// 	host: 'localhost',
// 	dialect: 'postgres',

// 	pool: {
// 		max: 5,
// 		min: 0,
// 		idle: 10000
// 	},

// });

module.exports = sequelize