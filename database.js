// database.js
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run('CREATE TABLE IF NOT EXISTS customers (name TEXT,idcode TEXT PRIMARY KEY,mobileNum TEXT,email TEXT, address TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS sellers ( name TEXT,idcode TEXT PRIMARY KEY,mobileNum TEXT,email TEXT, address TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, seller_id INTEGER, title TEXT, date timestamp, money_type TEXT, goodsname TEXT, amount REAL, price REAL, discount REAL, desc TEXT, FOREIGN KEY(customer_id) REFERENCES customers(idcode), FOREIGN KEY(seller_id) REFERENCES sellers(idcode))');
  }
});

module.exports = db;


