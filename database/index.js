const Pool = require('pg').Pool;
var format = require('pg-format');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'reviews'
});


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
  // console.log(format('SELECT * FROM reviews WHERE product_id = %s ORDER BY %s LIMIT %s OFFSET %s', product_id, rankBy, limit, offset));

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

  pool.query('SELECT sum (case when recommend = true then 1 end) as rec_true, sum(case when recommend = false then 1 end) as rec_false, sum(case when rating = 1 then 1 end) as rating1, sum(case when rating = 2 then 1 end) as rating2, sum(case when rating = 3 then 1 end) as rating3, sum(case when rating = 4 then 1 end) as rating4, sum(case when rating = 5 then 1 end) as rating5 FROM reviews WHERE product_id = $1 ', [product_id], (error, results) => {
    if (error) {
      res.sendStatus(500);
      throw error;
    } else {
      pool.query('select rc.name, rc.id, ROUND(avg(value), 4) from reviews_characteristics rc join reviews_characteristic_review rcr on rcr.characteristic_id = rc.id where rc.product_id = $1 group by rc.id ORDER BY rc.id ASC', [product_id], (error, results1) => {
        // console.log(results, results1);
        if (error) {
          res.sendStatus(500);
          throw error;
        }

        var meta = {
          "product_id": product_id,
          "ratings": {},
          "recommended": {},
          "characteristics": {}
        }

        for (var i = 1; i < 6; i++) {
          key = 'rating' + i;
          if (results.rows[0][key] !== null && results.rows[0][key] !== '0') {
            meta.ratings[i] = Number(results.rows[0][key]);
          }
        }

        meta.recommended[0] = Number(results.rows[0].rec_false);
        meta.recommended[1] = Number(results.rows[0].rec_true);

        for (var i = 0; i < results1.rows.length; i++) {
          meta.characteristics[results1.rows[i].name] = {id: results1.rows[i].id, value: results1.rows[i].round}
        }
        console.log(meta);
        res.status(200).json(meta);
      });
    }
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