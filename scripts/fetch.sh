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

if [ ! -f ./US.txt ]; then
    echo "Fetching US Zipcodes CSV File From geonames "
    $wget -nv "http://download.geonames.org/export/zip/US.zip"
    $unzip -oq "US.zip" "US.txt"
fi

if [ ! -f ./GU.txt ]; then
    echo "Fetching Guam Zipcodes CSV File From geonames "
    $wget -nv "http://download.geonames.org/export/zip/GU.zip"
    $unzip -oq "GU.zip" "GU.txt"
fi

if [ ! -f ./VI.txt ]; then
    echo "Fetching US Virgin Islands Zipcodes CSV File From geonames "
    $wget -nv "http://download.geonames.org/export/zip/VI.zip"
    $unzip -oq "VI.zip" "VI.txt"
fi

if [ ! -f ./ZIP_Locale_Detail.xls ]; then
  echo "fetching usps zipcodes"
  $wget -nv "https://postalpro.usps.com/mnt/glusterfs/2025-06/ZIP_Locale_Detail.xls"
fi

wait

echo "Processing CSV file."

./process.js

wait
rm ./ZIP_Locale_Detail.xls
rm ./US.zip*
rm ./US.txt
rm ./GU.zip*
rm ./GU.txt
rm ./VI.zip*
rm ./VI.txt

wait

echo "Build Complete"
