#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    zips = {}, str,
    data = fs.readFileSync('./zips.csv', 'utf8').split('\n');

data.shift();


data.forEach(function(line) {
    line = line.replace(/ /g, '').replace(/"/g, '').split(',');
    if (line.length > 1) {
        var o = {};

        o.state = line.pop();
        o.city = line.pop();
        o.longitude = line.pop();
        o.latitude = line.pop();
        o.abbr = line.pop();
        o.zip = line.pop();

        zips[o.zip] = o;
    }
});

str = 'exports.zips = ' + JSON.stringify(zips) + ';\n';

fs.writeFileSync(path.join('../', 'lib', 'codes.js'), str, 'utf8');
