
const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
// const db = require('../database');

const port = 3000;
const app = express ();

//setup bodyparser
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// handle root
app.get('/', (req, res) => {
  res.send('hello world');
});

// Get reviews
app.get('/reviews/:review_id', (req, res) => {
  res.send('hello world');
});

// Post reviews
app.post('/reviews/:review_id', (req, res) => {
  res.send('hello world');
});

// Get Meta
app.get('/reviews/meta/:review_id', (req, res) => {
  res.send('hello world');
});

// Report
app.put('/reviews/:review_id/report', (req, res) => {
  res.send('hello world');
});



app.listen(port, () => {
  console.log(`Server listening at: ${port}`)
});


// API

