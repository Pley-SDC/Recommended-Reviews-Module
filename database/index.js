const mysql = require('mysql');

// connect to database
const connection = mysql.createConnection({
  host: 'ec2-13-52-51-11.us-west-1.compute.amazonaws.com',
  user: 'root',
  database: 'pley',
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected');
});

const getReviews = (id, callback) => {
  const query = `
    select restaurant.name, user_info.user_avatar, user_info.user_name, user_info.location, user_info.number_reviews, user_info.number_photos, users_reviews.date, users_reviews.review_comment, users_reviews.score, users_reviews.picture_food, restaurant.name FROM users_reviews 
    INNER JOIN restaurant ON restaurant.restaurant_id = users_reviews.restaurant_id  
    INNER JOIN user_info ON user_info.user_id = users_reviews.user_id
    WHERE restaurant.restaurant_id = ${id}
    ORDER BY users_reviews.date desc
  `;
  connection.query(query, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};

const addReview = (review, callback) => {
  const columns = 'user_id, restaurant_id, date, review_comment, score, picture_food';
  const values = `"${review.user_id}", "${review.restaurant_id}", "${review.date}", "${review.review_comment}", "${review.score}", "${review.picture_food}"`;
  const query = `INSERT INTO users_reviews (${columns}) VALUES (${values});`;
  connection.query(query, (error) => {
    if (error) {
      callback(error);
    } else {
      callback(null);
    }
  });
};

const editReview = (review, callback) => {
  const columns = Object.keys(review);
  let updates = columns.filter(col => col !== 'id');
  updates = updates.map(col => (typeof review[col] === 'string' ? `${col}="${review[col]}"` : `${col}=${review[col]}`)).join(', ');
  const query = `UPDATE users_reviews SET ${updates} WHERE id=${review.id};`;
  connection.query(query, (error) => {
    if (error) {
      callback(error);
    } else {
      callback(null);
    }
  });
};

const deleteReview = (review, callback) => {
  const query = `DELETE FROM users_reviews WHERE id=${review.id}`;
  connection.query(query, (error) => {
    if (error) {
      callback(error);
    } else {
      callback(null);
    }
  });
};

module.exports = {
  connection, getReviews, addReview, editReview, deleteReview,
};
