require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const db = require('../database/index.js');
const morgan = require('morgan');

const app = express();

function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) return false;
  return compression.filter(req, res);
}

app.use(morgan('dev'));
app.use(express.static('build'));
app.use(compression({
  level: 2, // set compression level from 1 to 9 (6 by default)
  filter: shouldCompress, // set predicate to determine whether to compress
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// send to dist folder where client is being render when a GET request is sent to '/'
app.use(express.static(path.join(__dirname, '../public/dist')));

// send to index.html of particular restaurant_id and shows all reviews for that restaurant_id
app.get('/:restaurantId', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dist/index.html'));
});

// shows an array of objects filled with data of that
// particular restaurant_id and all the reviews for that restaurant
app.get('/api/:restaurantId/', (req, res) => {
  const { restaurantId } = req.params;
  // db.getReviews(restaurantId, (error, results) => {
  //   if (error) {
  //     console.log(error.message);
  //     res.status(500).send(error);
  //   } else {
  //     console.log(results);
  //     res.send(results);
  //   }
  // });
  console.log('restaurantId = ', restaurantId);
  console.log('GET.trigger');
});

app.post('/api/:restaurantId/', (req, res) => {
  db.addReview(req.body, (error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.sendStatus(201);
    }
  });
});

app.put('/api/:restaurantId/', (req, res) => {
  db.editReview(req.body, (error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.sendStatus(202);
    }
  });
});

app.delete('/api/:restaurantId/', (req, res) => {
  db.deleteReview(req.body, (error) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(3003, () => { console.log('listening on port', 3003); });
