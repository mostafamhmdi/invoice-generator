const express = require('express');
const fs = require('fs');
const path = require('path');
const initDatabase = require('./db'); // Import the initDatabase function

const app = express();
const port = 8000;

app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'invoice.html'));
});

app.get('/submit', (req, res) => {
    const firstname = req.query.name;
    const lastname = req.query.lname;
    fs.appendFile('myText.txt', firstname + ' ' + lastname + '\n', function(err) {
        if (err) throw err;
        console.log('Saved!');
    });
    res.send(`Hi ${firstname} ${lastname}!`);
});

app.get('/buyer.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'buyer.html'));
});

app.get('/seller.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'seller.html'));
});

async function startServer() {
    try {
        await initDatabase(); // Initialize the database
        console.log('Database initialized successfully');
        
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}/`);
        });
    } catch (error) {
        console.error('Failed to initialize database', error);
    }
}

startServer(); // Start the server
