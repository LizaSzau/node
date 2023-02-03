const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'xn-test',
    password: ''
})

module.exports = pool.promise()