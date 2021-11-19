
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
app.get('/reviews/', (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort;
  const product_id = req.query.product_id;
  // console.log(page, count, sort, product_id);

  res.sendStatus(200);
});

// Post reviews
app.post('/reviews/', (req, res) => {
  const product_id = req.body.product_id;
  const rating = req.body.rating;
  const summary = req.body.summary;
  const body = req.body.body;
  const recommend = req.body.recommend;
  const name = req.body.name;
  const email = req.body.email;
  const photos = req.body.photos;
  const characteristics = req.body.characteristics;

  console.log(product_id, rating, summary, body, recommend, name, email, photos, characteristics );

  res.sendStatus(201);
});

// Get Meta
app.get('/reviews/meta/', (req, res) => {
  const product_id = req.query.product_id;

  console.log(product_id);

  res.sendStatus(200);

});

// Mark helpful
app.put('/reviews/:review_id/helpful', (req, res) => {
  const review_id = req.params.review_id;

  console.log(review_id);

  res.sendStatus(204);
});

// Report
app.put('/reviews/:review_id/report', (req, res) => {
  const review_id = req.params.review_id;

  console.log(review_id);

  res.sendStatus(204);
});



app.listen(port, () => {
  console.log(`Server listening at: ${port}`)
});

