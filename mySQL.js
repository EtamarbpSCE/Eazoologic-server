const mysql = require('mysql2/promise');
// Create a connection to the database
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // Replace with your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    console.log("0trying")
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Successfully connected to the database');
        connection.release(); // Release the connection back to the pool
    }
});

// const connection = mysql.createConnection({
//   host: 'server.oversight.co.il',
//   user: 'rotem_private',
//   password: 'T$l3715ml',
//   database: 'rotem_private'
// });

// Connect to the database
// connection.connect(error => {
//   if (error) throw error;
//   console.log('Successfully connected to the database');
// });

// Export the connection
module.exports = pool;