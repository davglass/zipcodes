#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    zips = {}, str,
    data = fs.readFileSync('./ca_postal_codes.csv', 'utf8').replace(/\r/g, '').split('\n');

data.shift();

var clean = function(str) {
    return str.replace(/"/g, '').trimLeft();
}

var ucfirst = function(str) {
    str = str.toLowerCase();
    var lines = str.split(' ');
    lines.forEach(function(s, i) {
        var firstChar      = s.charAt(0),
            upperFirstChar = firstChar.toUpperCase();

        lines[i] = upperFirstChar + s.substring(1);
        
    });
    return lines.join(' ');
};

data.forEach(function(line, num) {
    line = line.split(',');
    if (line.length > 1) {
        var o = {};

        o.zip = clean(line[0]);
        o.latitude = Number(clean(line[3]));
        o.longitude = Number(clean(line[4]));
        o.city = ucfirst(clean(line[1]));
        o.state = clean(line[2]);
        o.country = 'Canada';

        // Only accept rows that look like real Canadian postal data. This keeps
        // an HTML error page or malformed source from corrupting codesCanada.js.
        var validZip = /^[A-Za-z]\d[A-Za-z]/.test(o.zip);
        var validCoords = Number.isFinite(o.latitude) && Number.isFinite(o.longitude) &&
            o.latitude !== 0 && o.longitude !== 0;

        if (validZip && validCoords && !zips[o.zip]) {
            zips[o.zip] = o;
        }
    }
});

var MIN_EXPECTED_CODES = 1000;
if (Object.keys(zips).length < MIN_EXPECTED_CODES) {
    console.error('Refusing to write codesCanada.js: only ' + Object.keys(zips).length +
        ' valid postal codes parsed (expected at least ' + MIN_EXPECTED_CODES + ').');
    console.error('The source is likely dead or returned an invalid file. Existing data left untouched.');
    process.exit(1);
}

var stateMap = {};

for (var i in zips) {
    var item = zips[i];
    stateMap[item.state] = stateMap[item.state] || [];
    stateMap[item.state].push(item.zip);
}

str = 'exports.codes = ' + JSON.stringify(zips) + ';\n';
str += 'exports.stateMap = ' + JSON.stringify(stateMap) + ';\n';

fs.writeFileSync(path.join('../', 'lib', 'codesCanada.js'), str, 'utf8');
