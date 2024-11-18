const mysql = require('mysql2');
require('dotenv').config(); 

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

// Create a pool of connections
const pool = mysql.createPool(dbConfig);

// Create a promise-based query function
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.execute(sql, params, (err, results) => {
      if (err) {
        reject(err);  // Reject the promise if there's an error
      } else {
        resolve(results);  // Resolve the promise with results
      }
    });
  });
};

// Optionally, to test the connection:
const connectDB = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err);
      process.exit(1);
    } else {
      console.log('Connected to MySQL database');
      connection.release(); // Release the connection back to the pool
    }
  });
};

module.exports = { query, connectDB };
