const mysql = require('mysql');

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'MySQL_Changer_24052023',
    database: 'changer'
})

module.exports = db;