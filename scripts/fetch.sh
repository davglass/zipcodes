#!/bin/bash

cd "$(dirname "$0")"

echo "Fetching zipscodes CSV File"

if [ -f ./zips.csv.gz ]; then
    rm ./zips.csv.gz
fi

if [ -f ./zips.csv ]; then
    rm ./zips.csv
fi

wget -nv "http://sourceforge.net/projects/zips/files/zips/zips.csv.gz/zips.csv.gz/download"

wait

echo "Unzipping CSV file"
gzip -d ./zips.csv.gz
wait

echo "Processing CSV file."

./process.js

wait

echo "Build Complete"
