const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'invoice.html'));
});

app.get('/buyer.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'buyer.html'));
});

app.get('/seller.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'seller.html'));
});

// Sample GET request handling
app.get('/submit', (req, res) => {
    const { name, lname } = req.query;
    fs.appendFile('myText.txt', `${name} ${lname}\n`, function(err) {
        if (err) throw err;
        console.log('Saved!');
    });
    res.send(`Hi ${name} ${lname}!`);
});

// Function to append data to a text file
const appendDataToFile = (filename, data) => {
    fs.appendFile(filename, data + '\n', function(err) {
        if (err) throw err;
        console.log('Data saved to file.');
    });
};

// Routes to handle form submissions
app.post('/buyer.html', (req, res) => {
    const { customerName, customerfamily, idcode, customerNumber, customeremail, customerAddress } = req.body;
    const data = `Customer: ${customerName} ${customerfamily}, ID: ${idcode}, Phone: ${customerNumber}, Email: ${customeremail}, Address: ${customerAddress}`;
    appendDataToFile('customers.txt', data);

    db.run('INSERT INTO customers (name, family, idcode, mobileNum, email, address) VALUES (?, ?, ?, ?, ?, ?)', 
        [customerName, customerfamily, idcode, customerNumber, customeremail, customerAddress], 
        function(err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.redirect('/');
        }
    );
});

app.post('/seller.html', (req, res) => {
    const { sellerName, sellerfamily, idcode, sellerNumber, selleremail, sellerAddress } = req.body;
    const data = `Seller: ${sellerName} ${sellerfamily}, ID: ${idcode}, Phone: ${sellerNumber}, Email: ${selleremail}, Address: ${sellerAddress}`;
    appendDataToFile('sellers.txt', data);

    db.run('INSERT INTO sellers (name, family, idcode, mobileNum, email, address) VALUES (?, ?, ?, ?, ?, ?)', 
        [sellerName, sellerfamily, idcode, sellerNumber, selleremail, sellerAddress], 
        function(err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.redirect('/');
        }
    );
});

app.post('/invoice', (req, res) => {
    const { customer_id, seller_id, amount } = req.body;
    const data = `Invoice: Customer ID: ${customer_id}, Seller ID: ${seller_id}, Amount: ${amount}`;
    appendDataToFile('invoices.txt', data);

    db.run('INSERT INTO invoices (customer_id, seller_id, amount) VALUES (?, ?, ?)', [customer_id, seller_id, amount], 
        function(err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({ "invoice_id": this.lastID });
        }
    );
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
