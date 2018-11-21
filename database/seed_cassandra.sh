#!/bin/bash

echo $PWD

mysqlimport --ignore-lines=1 --fields-terminated-by=, --local -u root pley_cassandra ./restaurant.csv

mysqlimport --ignore-lines=1 --fields-terminated-by=, --local -u root pley_cassandra ./user_info.csv

mysqlimport --ignore-lines=1 --fields-terminated-by=, --local -u root pley_cassandra ./users_reviews.csv