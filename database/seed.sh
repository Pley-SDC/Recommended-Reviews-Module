#!/bin/bash

echo $PWD

mysqlimport --ignore-lines=1 --fields-terminated-by=, --local -u root pley ./restaurant.csv

mysqlimport --ignore-lines=1 --fields-terminated-by=, --local -u root pley ./user_info.csv

mysqlimport --ignore-lines=1 --fields-terminated-by=, --local -u root pley ./users_reviews.csv
