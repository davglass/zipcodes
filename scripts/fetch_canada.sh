#!/bin/bash

cd "$(dirname "$0")"


if [ ! -f ./ca_postal_codes.csv ]; then
    echo "Fetching Canada Postal Codes CSV File"
    wget -nv "https://www.aggdata.com/download_sample.php?file=ca_postal_codes.csv" -O ca_postal_codes.csv
fi


wait

echo "Processing CSV file."

./processCanada.js

wait

rm ./ca_postal_codes.csv

wait

echo "Build Complete"