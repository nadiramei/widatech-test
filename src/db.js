import mysql from "mysql2";

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'sql6.freesqldatabase.com',
    user: 'sql6683322',
    password: 'E2TSJqq7At',
    database: 'your_dsql6683322atabase_name'
});

module.exports = db;