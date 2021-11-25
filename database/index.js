const Pool = require('pg').Pool;
var format = require('pg-format');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'reviews'
});

// connection.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Connected to PostgreSQL!');
//   }
// });

// Database Queries
const getReviewsById = (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort;
  const product_id = parseInt(req.query.product_id);

  var rankBy;
  if (sort === 'newest') {
    rankBy = 'date DESC';
  } else if (sort === 'helpful') {
    rankBy = 'helpfulness DESC';
  } else {
    rankBy = 'helpfulness DESC, date DESC';
  }

  var limit = page * count;
  var offset = (page - 1) * count;

  // console.log(rankBy, limit, offset);
  console.log(format('SELECT * FROM reviews WHERE product_id = %s ORDER BY %s LIMIT %s OFFSET %s', product_id, rankBy, limit, offset));

  pool.query(format('SELECT * FROM reviews WHERE product_id = %s ORDER BY %s LIMIT %s OFFSET %s', product_id, rankBy, limit, offset), (error, results)=> {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const postReviews = (req, res) => {
  let date = Date.now();
  const {product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, photos, characteristics} = req.body;

  pool.query('INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id', [product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email], (error, results) => {
    // console.log(results.rows[0].id);
    if (error) {
      throw error;
    }
    else {
      var review_id = results.rows[0].id;
      var characteristics_list=[];
      for (var key in characteristics) {
        characteristics_list.push([key, review_id, characteristics[key]]);
      }

      // console.log(format('INSERT INTO characteristics_review (characteristics_id,value) VALUES %L', characteristics_list));
      pool.query(format('INSERT INTO reviews_characteristic_review (characteristic_id, review_id,value) VALUES %L', characteristics_list), [], (error, results) => {
        if (error) {
          throw error;
        } else {
          var photolist=[];
          for (const url of photos) {
            photolist.push([review_id, url]);
          }

          pool.query(format('INSERT INTO reviews_photos (review_id, url) VALUES %L', photolist), [], (error, results) => {
            if (error) {
              throw error;
            }
          })

        }
        res.status(201).json(results.rows);
      });
    }
  })

}

const getMeta = (req, res) => {
  const product_id = parseInt(req.query.product_id)

  pool.query('SELECT * FROM reviews WHERE product_id = $1', [product_id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows);
    // res.sendStatus(200);
  })
}

const markHelpful = (req, res) => {
  const product_id = parseInt(req.query.product_id)

  pool.query('UPDATE helpfulness SET helpfulness = helpfulness + 1 WHERE product_id = $1' ,[product_id],(error, results) => {
    if (error) {
      throw error
    }
    res.status(204).send(`Helpfull was marked on: ${product_id}`)
  })
}

const report = (req, res) => {
  const product_id = parseInt(req.query.product_id)

  pool.query('UPDATE report SET report = true WHERE product_id = $1' ,[product_id], (error, results)=> {
    if (error) {
      throw error
    }
    res.status(204).send(`Reported on: ${product_id}`)
  })
}

// Don't forget to export your functions!
module.exports = {
  getReviewsById, postReviews, getMeta, markHelpful, report
};