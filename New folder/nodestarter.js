// server.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/submit', (req, res) => {
    console.log(req.body);
    res.send('Form submitted successfully!');
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
