#!/bin/bash

set -e

cd "$(dirname "$0")"

wget=`which wget`

if [ ! -x "$wget" ]; then
    echo "Could not find wget in path.."
    exit 1;
fi

if [ ! -f ./ca_postal_codes.csv ]; then
    echo "Fetching Canada Postal Codes CSV File"
    wget --progress bar -nv "https://www.aggdata.com/download_sample.php?file=ca_postal_codes.csv" -O ca_postal_codes.csv
fi


wait

echo "Processing CSV file."

./processCanada.js

wait

rm ./ca_postal_codes.csv

wait

echo "Build Complete"
