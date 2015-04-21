#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    zips = {}, str,
    data = fs.readFileSync('./free-zipcode-database.csv', 'utf8').replace(/\r/g, '').split('\n');

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

var headers = data.shift().split(','),
    index = {};

headers.forEach(function(header, num){
    index[clean(header)] = num;
});


data.forEach(function(line, num) {
    line = line.split(',');
    if (line.length > 1 && clean(line[index['LocationType']]).toLowerCase() == 'primary') {
        var o = {};

        o.zip = clean(line[index['Zipcode']])
        o.latitude = Number(clean(line[index['Lat']]));
        o.longitude = Number(clean(line[index['Long']]));
        o.city = ucfirst(clean(line[index['City']]));
        o.state = clean(line[index['State']]);

        zips[o.zip] = o;
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
