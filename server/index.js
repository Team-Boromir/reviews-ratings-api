
const express = require('express');
const path = require("path");
const port = 3000;

const app = express ();


// routers
const reviews = require('./routes/reviews.js')

//setup bodyparser
app.use(express.json());

// use the products.js file to handle endpoints that relates to products data

// app.use('/reviews', reviews);


// handle root
app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(port, () => {
  console.log(`Server listening at: ${port}`)
});
