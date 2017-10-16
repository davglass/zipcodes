#!/bin/bash

set -e

cd "$(dirname "$0")"

wget=`which wget`
unzip=`which unzip`

if [ ! -x "$wget" ]; then
    echo "Could not find wget in path.."
    exit 1;
fi

if [ ! -x "$unzip" ]; then
    echo "Could not find unzip in path.."
    exit 1;
fi

if [ ! -f ./free-zipcode-database.csv ]; then
    echo "Fetching US Zipcodes CSV File"
    $wget -nv "http://federalgovernmentzipcodes.us/free-zipcode-database.csv"
fi

if [ ! -f ./US.txt ]; then
    echo "Fetching US Zipcodes CSV File From geonames "
    $wget -nv "http://download.geonames.org/export/zip/US.zip"
    $unzip -oq "US.zip" "US.txt"
fi


wait

echo "Processing CSV file."

./process.js

wait

rm ./free-zipcode-database.csv
rm ./US.zip*
rm ./US.txt

wait

echo "Build Complete"
