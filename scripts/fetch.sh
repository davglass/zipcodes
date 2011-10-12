#!/bin/bash

cd "$(dirname "$0")"


if [ ! -f ./free-zipcode-database.csv ]; then
    echo "Fetching zipscodes CSV File"
    wget -nv "http://federalgovernmentzipcodes.us/free-zipcode-database.csv"
fi


wait

echo "Processing CSV file."

./process.js

wait

rm ./free-zipcode-database.csv

wait

echo "Build Complete"
