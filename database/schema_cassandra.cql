CREATE KEYSPACE pley
  WITH REPLICATION = { 
   'class' : 'SimpleStrategy', 
   'replication_factor' : 3 
  };

CREATE TABLE pley.user_info ( 
  user_id int PRIMARY KEY,
  user_name text,
  user_avatar text,
  location text,
  number_reviews int,
  number_photos int
);

CREATE TABLE pley.restaurant ( 
  restaurant_id int PRIMARY KEY,
  name text
);

CREATE TABLE pley.users_reviews ( 
  id int PRIMARY KEY,
  user_id int,
  restaurant_id int,
  date date,
  review_comment text,
  score text,
  picture_food text
);

COPY pley.user_info (user_id,user_name,user_avatar,location,number_reviews,number_photos)
  FROM '/Users/eBookPro/Desktop/HackReactor/projects/SDC/Recommended-Reviews-Module/database/user_info.csv'
  WITH HEADER = TRUE;

COPY pley.restaurant (restaurant_id,name)
  FROM '/Users/eBookPro/Desktop/HackReactor/projects/SDC/Recommended-Reviews-Module/database/restaurant.csv'
  WITH HEADER = TRUE;

COPY pley.users_reviews (id,user_id,restaurant_id,date,review_comment,score,picture_food)
  FROM '/Users/eBookPro/Desktop/HackReactor/projects/SDC/Recommended-Reviews-Module/database/users_reviews.csv'
  WITH HEADER = TRUE;

CREATE index RestaurantIndex ON pley.users_reviews(restaurant_id);
