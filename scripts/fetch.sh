#!/bin/bash

set -e

cd "$(dirname "$0")"

wget=`which wget`

if [ ! -x "$wget" ]; then
    echo "Could not find wget in path.."
    exit 1;
fi

if [ ! -f ./free-zipcode-database.csv ]; then
    echo "Fetching US Zipcodes CSV File"
    $wget -nv "http://federalgovernmentzipcodes.us/free-zipcode-database.csv"
fi


wait

echo "Processing CSV file."

./process.js

wait

rm ./free-zipcode-database.csv

wait

echo "Build Complete"
