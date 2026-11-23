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

# Guard against a dead/redirected source returning an HTML error page.
# Without this check a bad download would be parsed and overwrite the good
# codesCanada.js with garbage (which is how it was corrupted previously).
if [ ! -s ./ca_postal_codes.csv ]; then
    echo "Download failed or produced an empty file. Aborting without touching codesCanada.js."
    rm -f ./ca_postal_codes.csv
    exit 1
fi

if head -c 512 ./ca_postal_codes.csv | grep -qiE '<(!doctype|html|head|script|meta)' ; then
    echo "Downloaded file looks like HTML, not CSV. Source may be dead."
    echo "Aborting without touching codesCanada.js."
    rm -f ./ca_postal_codes.csv
    exit 1
fi

wait

echo "Processing CSV file."

./processCanada.js

wait

rm ./ca_postal_codes.csv

wait

echo "Build Complete"
