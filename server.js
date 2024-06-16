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

app.get('/check-seller', (req, res) => {
    const { idcode } = req.query;
    db.get('SELECT * FROM sellers WHERE idcode = ?', [idcode], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ message: 'Seller not found' });
        }
    });
});

app.get('/check-buyer', (req, res) => {
    const { idcode } = req.query;
    db.get('SELECT * FROM customers WHERE idcode = ?', [idcode], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.json(row);
        } else {
            res.status(404).json({ message: 'Buyer not found' });
        }
    });
});

const appendDataToFile = (filename, data) => {
    fs.appendFile(filename, data + '\n', function(err) {
        if (err) throw err;
        console.log('Data saved to file.');
    });
};

app.post('/buyer.html', (req, res) => {
    const { customerName, idcode, customerNumber, customeremail, customerAddress } = req.body;
    const data = `Customer: ${customerName} , ID: ${idcode}, Phone: ${customerNumber}, Email: ${customeremail}, Address: ${customerAddress}`;
    appendDataToFile('customers.txt', data);

    db.run('INSERT INTO customers (name, idcode, mobileNum, email, address) VALUES (?, ?, ?, ?, ?)', 
        [customerName, idcode, customerNumber, customeremail, customerAddress], 
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
    const { sellerName, idcode, sellerNumber, selleremail, sellerAddress } = req.body;
    const data = `Seller: ${sellerName} , ID: ${idcode}, Phone: ${sellerNumber}, Email: ${selleremail}, Address: ${sellerAddress}`;
    appendDataToFile('sellers.txt', data);

    db.run('INSERT INTO sellers (name, idcode, mobileNum, email, address) VALUES (?, ?, ?, ?, ?)', 
        [sellerName, idcode, sellerNumber, selleremail, sellerAddress], 
        function(err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.redirect('/');
        }
    );
});

app.post('/invoice.html', (req, res) => {
    const { 
        invoiceTitle, invoiceDate, currency, 
        sellerName, sellerNumber, sellerAddress, 
        customerName, customerNumber, customerAddress, 
        commoditName, customerNo, unitprice, discount, 
        totalprice, commoditdescription 
    } = req.body;
    
    const unitPrice = parseFloat(unitprice);
    const customerNoValue = parseInt(customerNo);
    const discountValue = discount ? parseFloat(discount) : 0;

    const calculatedTotalPrice = unitPrice * customerNoValue;
    const discountAmount = (discountValue / 100) * calculatedTotalPrice;

    const invoiceData = `Invoice: ${invoiceTitle} ${invoiceDate} ${currency}, Seller: ${sellerNumber} ,Buyer: ${customerNumber} ,Good: ${commoditName} ${customerNo} ${unitprice} ${discountAmount} ${calculatedTotalPrice} ${commoditdescription}`;
    appendDataToFile('invoice.txt', invoiceData);

    db.run('INSERT INTO invoices (customer_id, seller_id, title, date, money_type, goodsname, amount, price, discount, desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [customerNumber, sellerNumber, invoiceTitle, invoiceDate, currency, commoditName, customerNoValue, unitPrice, discountAmount, commoditdescription],  
        function(err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.redirect('/');
        }
    );
});



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
