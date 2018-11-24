const faker = require('faker');
const HipsterIpsum = require('hipsteripsum');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const _ = require('underscore');
const { sprintf } = require('sprintf-js');

const batchSize = 1000;
let restaurantId = 1;
let userInfoId = 1;
let usersReviewsId = 1;

// create a company name without commas
const genCompName = () => {
  const name = faker.company.companyName();
  return name.includes(',') ? name.split(',').join('') : name;
};

// generate restaurant table data (10M)
const seedRestaurant = (rows = batchSize) => {
  const dataRestaurant = [];
  for (let i = 0; i < rows; i += 1) {
    const restaurant = {};
    restaurant.restaurant_id = restaurantId;
    restaurantId += 1;
    restaurant.name = genCompName();
    dataRestaurant.push(restaurant);
  }
  return dataRestaurant;
};

// generate user_info table data (10M)
const seedUserInfo = (rows = batchSize) => {
  const dataUserInfo = [];
  for (let i = 0; i < rows; i += 1) {
    const user = {};
    user.user_id = userInfoId;
    userInfoId += 1;
    user.user_name = faker.name.findName();
    user.user_avatar = faker.image.avatar();
    user.location = `${faker.address.city()} ${faker.address.state()}`;
    user.number_reviews = _.random(1, 50);
    user.number_photos = _.random(1, 40);
    dataUserInfo.push(user);
  }
  return dataUserInfo;
};

// generate users_review table data (40M)
const seedUserReviews = (rows = batchSize) => {
  const dataUserReview = [];
  for (let i = 0; i < rows; i += 1) {
    const reviews = {};
    const urlPath = 'https://s3-us-west-1.amazonaws.com/pley-food/';
    reviews.id = usersReviewsId;
    usersReviewsId += 1;
    reviews.user_id = _.random(1, 10000000);
    reviews.restaurant_id = _.random(1, 10000000);
    reviews.date = faker.date.past();
    reviews.date = moment(reviews.date).format('YYYY-MM-DD');
    reviews.review_comment = HipsterIpsum.get(1);
    reviews.score = `${urlPath}star_${_.random(1, 9)}.png`;
    reviews.picture_food = `${urlPath + sprintf('%05s.jpg', _.random(1, 1000))}`;
    dataUserReview.push(reviews);
  }
  return dataUserReview;
};

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

function createSeedWriter(fileName, total, seedGenerator, cb) {
  let totalSeedEntries = total / batchSize;
  const destination = path.resolve(__dirname, fileName);
  const stream = fs.createWriteStream(destination);

  const writer = () => {
    let result = true;
    while (result && totalSeedEntries > 0) {
      result = stream.write(csvConverter(seedGenerator()));
      totalSeedEntries -= 1;
    }
    if (totalSeedEntries > 0) {
      stream.once('drain', writer);
    } else if (totalSeedEntries <= 0 && cb) {
      console.log('Switching to next table...');
      cb();
    }
  };
  return writer;
}

const userReviewsWriter = createSeedWriter('users_reviews.csv', 40000000, seedUserReviews);
const userInfoWriter = createSeedWriter('user_info.csv', 10000000, seedUserInfo, userReviewsWriter);
const restaurantWriter = createSeedWriter('restaurant.csv', 10000000, seedRestaurant, userInfoWriter);
restaurantWriter();
