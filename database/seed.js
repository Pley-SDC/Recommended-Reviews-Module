const faker = require('faker');
const HipsterIpsum = require('hipsteripsum');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const _ = require('underscore');
const { sprintf } = require('sprintf-js');

// generate restaurant table data (10M)
const dataRestaurant = [];
for (let i = 0; i < 10000000; i += 1) {
  if (i % 100000 === 0) {
    console.log(`${i} rows written to restaurant table`);
  }
  const restaurant = {};
  restaurant.restaurant_id = i + 1;
  restaurant.name = faker.company.companyName();
  dataRestaurant.push(restaurant);
}

// generate user_info table data (10M)
const dataUserInfo = [];
for (let i = 0; i < 10000000; i += 1) {
  if (i % 100000 === 0) {
    console.log(`${i} rows written to user_info table`);
  }
  const user = {};
  user.user_id = i + 1;
  user.user_name = faker.name.findName();
  user.user_avatar = faker.image.avatar();
  user.location = `${faker.address.city()} ${faker.address.state()}`;
  user.number_reviews = _.random(1, 50);
  user.number_photos = _.random(1, 40);
  dataUserInfo.push(user);
}

// generate users_review table data (40M)
const dataUserReview = [];
for (let i = 0; i < 40000000; i += 1) {
  if (i % 100000 === 0) {
    console.log(`${i} rows written to users_review table`);
  }
  const reviews = {};
  const urlPath = 'https://s3-us-west-1.amazonaws.com/pley-food/';
  reviews.id = i + 1;
  reviews.user_id = _.random(1, 10000000);
  reviews.restaurant_id = _.random(1, 10000000);
  reviews.date = faker.date.past();
  reviews.date = moment(reviews.date).format('YYYY-MM-DD');
  reviews.review_comment = HipsterIpsum.get(1);
  reviews.score = `${urlPath}star_${_.random(1, 9)}.png`;
  reviews.picture_food = `${urlPath + sprintf('%05s.jpg', _.random(1, 1000))}`;
  dataUserReview.push(reviews);
}

const csvConverter = (arr) => {
  let output = '';
  let column = [];
  for (const key in arr[0]) {
    column.push(key);
  }
  output += `${column.join()}\n`;
  for (let i = 0; i < arr.length; i += 1) {
    column = [];
    for (const key in arr[i]) {
      column.push(arr[i][key]);
    }
    output += `${column.join()}\n`;
  }
  return output;
};

const restaurantCSV = csvConverter(dataRestaurant);
const userInfoCSV = csvConverter(dataUserInfo);
const userReviewCSV = csvConverter(dataUserReview);

fs.writeFile(path.join(__dirname, 'restaurant.csv'), restaurantCSV, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('data stored in restaurant table :)');
  }
});

fs.writeFile(path.join(__dirname, 'user_info.csv'), userInfoCSV, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('data stored in user_info table :)');
  }
});

fs.writeFile(path.join(__dirname, 'users_reviews.csv'), userReviewCSV, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('data stored in users_reviews table :)');
  }
});
