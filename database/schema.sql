DROP DATABASE IF EXISTS pley;

create database pley;

use pley;

create table restaurant
(
  restaurant_id   int auto_increment not null
    primary key,
  name varchar(100) not null
);

create table user_info
(
  user_id             int auto_increment not null
    primary key,
  user_name           varchar(100) not null,
  user_avatar         varchar(100) not null,
  location            varchar(100) not null,
  number_reviews      int  not null,
  number_photos       int  not null
);

create table users_reviews
(
  id             int auto_increment not null
    primary key,
  user_id        int  not null,
  restaurant_id  int  not null,
  date           date not null,
  review_comment text not null,
  score          varchar(100) not null,
  picture_food   varchar(100) not null,
  foreign key (user_id) references user_info (user_id),
  foreign key (restaurant_id) references restaurant (restaurant_id)
);
