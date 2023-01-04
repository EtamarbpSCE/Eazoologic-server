const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'server.oversight.co.il',
  user: 'rotem_private',
  password: 'T$l3715ml',
  database: 'rotem_private'
});

// Connect to the database
connection.connect(error => {
  if (error) throw error;
  console.log('Successfully connected to the database');
});

// Export the connection
module.exports = connection;