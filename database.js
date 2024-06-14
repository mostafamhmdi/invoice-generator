// database.js
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run('CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,family TEXT,idcode TEXT,mobileNum TEXT,email TEXT, address TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS sellers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,family TEXT,idcode TEXT,mobileNum TEXT,email TEXT, address TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, seller_id INTEGER, amount REAL, FOREIGN KEY(customer_id) REFERENCES customers(id), FOREIGN KEY(seller_id) REFERENCES sellers(id))');
  }
});

module.exports = db;
