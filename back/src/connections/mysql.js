/* CONEXION CON MYSQL */
const mysql = require('mysql2');
require('dotenv').config();
const logger = require('../utils/logger').init();

const pool = mysql.createPool({
  connectionLimit: 64,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  connectTimeout: 1000000,
  timezone: '+00:00'
});


pool.query('SELECT 1 + 1 AS solution', function (error) {
  if (error) {
    logger.error(JSON.stringify(error, null, 2));
    throw error;
  }
  console.log('Database connection create');
});

module.exports = {
  pool: pool,
};
