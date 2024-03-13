const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool
const pool = mysql.createPool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

// Check if the connection is successful
pool.getConnection()
    .then(connection => {
        console.log("Database connected successfully!");
        connection.release(); // Release the connection back to the pool
    })
    .catch(error => {
        console.error("Error connecting to database:", error.message);
    });

// Export the pool for reuse across the application
module.exports = pool;
