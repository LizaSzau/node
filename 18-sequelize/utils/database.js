const Sequelize = require("sequelize").Sequelize

const sequelize = new Sequelize('xn-test', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize