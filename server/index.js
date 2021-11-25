
const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const db = require('../database/index.js');

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
  
  db.getReviewsById(req, res);
  // console.log(page, count, sort, product_id);

  // res.sendStatus(200);
});

// Post reviews
app.post('/reviews/', (req, res) => {

  db.postReviews(req, res);

  // console.log(product_id, rating, summary, body, recommend, name, email, photos, characteristics );

  // res.sendStatus(201);
});

// Get Meta
app.get('/reviews/meta/', (req, res) => {
  const product_id = req.query.product_id;

  db.getMeta(req, res);

  // console.log(product_id);

  // res.sendStatus(200);

});

// Mark helpful
app.put('/reviews/:review_id/helpful', (req, res) => {
  const review_id = req.params.review_id;

  db.markHelpful(req, res);

  // console.log(review_id);

  // res.sendStatus(204);
});

// Report
app.put('/reviews/:review_id/report', (req, res) => {
  const review_id = req.params.review_id;

  db.report(req, res);

  // console.log(review_id);

  // res.sendStatus(204);
});



app.listen(port, () => {
  console.log(`Server listening at: ${port}`)
});

