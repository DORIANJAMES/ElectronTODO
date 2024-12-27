const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
})

console.log(process.env.MYSQL_HOST)
console.log(process.env.MYSQL_USER)
console.log(process.env.MYSQL_PASSWORD)
console.log(process.env.MYSQL_DATABASE)

connection.connect()

module.exports = {
    db: connection
}