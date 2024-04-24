#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  zips = {},
  str,
  geonamesData = fs.readFileSync('./US.txt', 'utf8').split('\n'),
  xlsx = require('xlsx'),
  axios = require('axios'),
  codes = require('../lib/codes').codes,
  rateLimit = require('axios-rate-limit'),
  axiosRateLimit = rateLimit(axios.create(), {
    maxRequests: 5,
    perMilliseconds: 1000,
    maxRPS: 1
  });
var workbook = xlsx.readFile('./ZIP_Locale_Detail.xls');
var workbook_sheet_name_list = workbook.SheetNames;
var zip_detail_sheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook_sheet_name_list[0]]);
for (var i in codes) {
  if (!codes[i].longitude) {
    delete codes[i];
  }
}
var clean = function (str) {
  return str.replace(/"/g, '').trimLeft();
}

var ucfirst = function (str) {
  str = str.toLowerCase();
  var lines = str.split(' ');
  lines.forEach(function (s, i) {
    var firstChar = s.charAt(0),
      upperFirstChar = firstChar.toUpperCase();

    lines[i] = upperFirstChar + s.substring(1);

  });
  return lines.join(' ');
};

geonamesLookupData = {};
// replace lat long US zip Codes 
geonamesData.forEach(function (line, num) {
  var dt = line.split('\t');
  if (dt.length == 12) {
    geonamesLookupData[clean(dt[1])] = {
      latitude: dt[9],
      longitude: dt[10]
    };
  }
});

async function getZipData(row) {
  const urlEncodedAddress = encodeURIComponent(`${row['PHYSICAL DELV ADDR']} ${row['PHYSICAL CITY']} ${row['DELIVERY ZIPCODE']}`);
  try {

    const response = await axiosRateLimit.get(`https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${urlEncodedAddress}&benchmark=2020&format=json`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.data.result.addressMatches.length > 0) {
      zips[row['DELIVERY ZIPCODE']] = {
        zip: row['DELIVERY ZIPCODE'],
        city: ucfirst(row['PHYSICAL CITY']),
        state: row['PHYSICAL STATE'],
        country: 'US',
        latitude: response.data.result.addressMatches[0].coordinates.y,
        longitude: response.data.result.addressMatches[0].coordinates.x
      };
      return zips[row['DELIVERY ZIPCODE']];
    }
  } catch (error) {
    console.error('error', error);
  }
}
var newCount = 0;
async function getZips() {
  const promises = [];
  for (const row of zip_detail_sheet) {
    if (!codes[row['DELIVERY ZIPCODE']]) {
      newCount++;

      promises.push(getZipData(row));
      console.log('newCount', newCount);
    }
  }
  const results = await Promise.all(promises);
  results.forEach(result => {
    if (result) {
      zips[result.zip] = result;
    }
  });

  geonamesData.forEach(function (line, num) {
    var dt = line.split('\t');
    if (dt.length == 12) {
      var zip = clean(dt[1]);
      if (!zips[zip] && dt[4]) {
        zips[zip] = {
          zip: zip,
          latitude: Number(clean(dt[9])),
          longitude: Number(clean(dt[10])),
          city: ucfirst(clean(dt[2])),
          state: clean(dt[4]),
          country: 'US'
        };
      }
    }
  });


  var stateMap = {};

  for (var i in zips) {
    var item = zips[i];
    stateMap[item.state] = stateMap[item.state] || [];

    stateMap[item.state].push(item.zip);
  }

  str = 'exports.codes = ' + JSON.stringify(zips) + ';\n';
  str += 'exports.stateMap = ' + JSON.stringify(stateMap) + ';\n';

  fs.writeFileSync(path.join('../', 'lib', 'codes.js'), str, 'utf8');
}
getZips();