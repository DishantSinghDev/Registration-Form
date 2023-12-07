const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');

require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String
});

const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    fs.readFile("form.html", (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    })
});

app.post('/submit', (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    user.save()
        .then(() => res.redirect('/success.html'))
        .catch(err => res.status(400).send('Error: ' + err));
});

app.listen(port);